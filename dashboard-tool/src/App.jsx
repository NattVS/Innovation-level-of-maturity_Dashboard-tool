import React from 'react';
import { useSurveyData } from './hooks/userSurveyData';
import ResumenGen from './pages/ResumenGen';

function App() {
  const { surveyData, loadExcel } = useSurveyData();
  const getTagColor = (val) => {
    if (val >= 3) return "text-[#ca8a04]"; // Media (Amarillo)
    return "text-[#dc2626]"; // Alta/Débil (Rojo)
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-[320px] bg-white text-gray-800 flex-col hidden md:flex border-r-2 border-gray-200 overflow-y-auto">
        <div className="p-6">

          {/* Logo y Título */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
              <span className="text-xs text-gray-500">LOGO UPM</span>
            </div>
          </div>

          <div className="border border-gray-200 p-4 rounded-xl mb-4">
            <h2 className="font-bold text-sm text-gray-800 mb-1">Diagnóstico</h2>
            <h3 className="font-bold text-gray-800 leading-tight mb-2">Nivel de madurez <br /> en la enseñanza de la innovación</h3>
            <p className="text-[10px] text-gray-500">Escuela Técnica Superior de Ingeniería y Diseño Industrial · Universidad Politécnica de Madrid</p>
          </div>

          {/* Card nivel global */}
          <div className="border border-gray-200 bg-[#f8fafc] p-4 rounded-xl text-center mb-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-600">Nivel Global Institución</p>
            <p className="text-5xl font-extrabold text-blue-700 my-2">5</p>
            <p className="text-xs font-bold text-gray-800">Nivel de madurez: Avanzado</p>
            <p className="text-[10px] text-gray-500 mt-2 leading-tight">
              Innovación integrada en el currículo con soporte institucional, comunidades de práctica y evidencia de impacto documentada.
            </p>
            <p className="text-[9px] text-gray-400 mt-3">Promedio 3.22 / 5.0 - 64.5% del máximo <br /> N = 15 encuestados · 2026</p>
          </div>

          {/* jerarquía */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 text-sm mb-3">Nivel de madurez por jerarquía</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Estratégico</p>
                  <p className="text-[10px] text-gray-500">Rectores · vicerrectores · decanos</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-[#4c1d95]"></div>
                  <span className="text-xs font-bold text-[#4c1d95]">3.37</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Táctico</p>
                  <p className="text-[10px] text-gray-500">Directores · jefes de dpto.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-[#ca8a04]"></div>
                  <span className="text-xs font-bold text-[#ca8a04]">3.10</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Operativo</p>
                  <p className="text-[10px] text-gray-500">Docentes e investigadores</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-[#dc2626]"></div>
                  <span className="text-xs font-bold text-[#dc2626]">2.09</span>
                </div>
              </div>
            </div>

            {/* Adv */}
            <div className="mt-4 bg-[#fef2f2] border border-[#fca5a5] p-3 rounded-lg">
              <p className="text-xs font-bold text-gray-800">Brecha jerárquica crítica: 1.28 pts</p>
              <p className="text-[10px] text-gray-600 mt-1">Entre Estratégico y Operativo. La política institucional no llega a la práctica docente.</p>
            </div>
          </div>

          {/* Dimensiones  */}
          <div>
            <h4 className="font-bold text-gray-800 text-sm mb-3">Nivel Por Dimensión</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(surveyData?.dimensions || {}).map(([key, val]) => (
                <div key={key} className="border border-gray-200 p-2 rounded-lg bg-[#f8fafc]">
                  <p className="text-[10px] text-gray-500">{key}</p>
                  <p className="text-sm font-bold text-gray-800">{val.toFixed(2)}</p>
                  <p className={`text-[10px] font-semibold ${getTagColor(val)}`}>
                    {val >= 3 ? "Media" : "Alta"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-10 bg-white">
        <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 opacity-0">.</h1> {/* Spacer */}

          <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Subir Excel
            <input
              type="file"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => loadExcel(e.target.files[0])}
            />
          </label>
        </header>

        {/* COMPONENTE PRINCIPAL */}
        <ResumenGen surveyData={surveyData} />
      </main>
    </div>
  )
}

export default App;