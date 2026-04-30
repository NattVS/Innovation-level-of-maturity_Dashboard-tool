import React from 'react';
import { useSurveyData } from './hooks/userSurveyData';
import ResumenGen from './pages/ResumenGen';

function App() {
  const { surveyData, loadExcel } = useSurveyData();

  const getTagColor = (val) => {
    if (val >= 3) return "text-[#ca8a04]";
    return "text-[#dc2626]";
  };

  const getMaturityLevel = (avg) => {
    if (avg <= 0.71) return { level: 1, name: "Reactivo", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };
    if (avg <= 1.43) return { level: 2, name: "Incipiente", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };
    if (avg <= 2.14) return { level: 3, name: "Emergente", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };
    if (avg <= 2.86) return { level: 4, name: "Establecido", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };
    if (avg <= 3.57) return { level: 5, name: "Avanzado", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };
    if (avg <= 4.29) return { level: 6, name: "Sistémico", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };

    return { level: 7, name: "Transformador", desc: "CAMBIAME:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." };
  };

  //variables
  const globalAvg = surveyData?.globalAvg || 0;
  const respondents = surveyData?.raw?.length || 0;
  const gap = surveyData?.gap || 0;

  const estScore = surveyData?.hierarchy?.["estratégico"] || 0;
  const tacScore = surveyData?.hierarchy?.["táctico"] || 0;
  const opeScore = surveyData?.hierarchy?.["operativo"] || 0;

  const maturity = getMaturityLevel(globalAvg);
  const percentage = ((globalAvg / 5) * 100).toFixed(1);
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">

      {/*sidebar */}
      <aside className="w-[320px] bg-white text-gray-800 flex-col hidden md:flex border-r-2 border-gray-200 overflow-y-auto">
        <div className="p-6">

          {/* Logo y Título */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
              <span className="text-xs text-gray-500">LOGO TEMP</span>
            </div>
          </div>

          <div className="border border-gray-200 p-4 rounded-xl mb-4">
            <h2 className="font-bold text-sm text-gray-800 mb-1">Diagnóstico</h2>
            <h3 className="font-bold text-gray-800 leading-tight mb-2">Nivel de madurez <br /> en la enseñanza de la innovación</h3>
            <p className="text-[10px] text-gray-500">Escuela Técnica Superior de Ingeniería y Diseño Industrial · Universidad Politécnica de Madrid</p>
          </div>

          {/*card Nivel Global*/}
          <div className="border border-gray-200 bg-[#f8fafc] p-4 rounded-xl text-center mb-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-600">Nivel Global Institución</p>
            <p className="text-5xl font-extrabold text-blue-700 my-2">
              {surveyData ? maturity.level : "-"}
            </p>
            <p className="text-xs font-bold text-gray-800">
              Nivel de madurez: {surveyData ? maturity.name : "Esperando datos"}
            </p>
            <p className="text-[10px] text-gray-500 mt-2 leading-tight min-h-[40px]">
              {surveyData ? maturity.desc : "Sube un archivo Excel para ver el diagnóstico global."}
            </p>
            {surveyData && (
              <p className="text-[9px] text-gray-400 mt-3">
                Promedio {globalAvg.toFixed(2)} / 5.0 - {percentage}% del máximo <br />
                N = {respondents} encuestados · {currentYear}
              </p>
            )}
          </div>

          {/*jerarquía (3 lvs)*/}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 text-sm mb-3">Nivel de madurez por jerarquía</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Estratégico</p>
                  <p className="text-[10px] text-gray-500">Rectores · vicerrectores · decanos</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 bg-[#4c1d95] transition-all duration-500" style={{ width: `${(estScore / 5) * 40}px` }}></div>
                  <span className="text-xs font-bold text-[#4c1d95]">{estScore.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Táctico</p>
                  <p className="text-[10px] text-gray-500">Directores · jefes de dpto.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 bg-[#ca8a04] transition-all duration-500" style={{ width: `${(tacScore / 5) * 40}px` }}></div>
                  <span className="text-xs font-bold text-[#ca8a04]">{tacScore.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Operativo</p>
                  <p className="text-[10px] text-gray-500">Docentes e investigadores</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 bg-[#dc2626] transition-all duration-500" style={{ width: `${(opeScore / 5) * 40}px` }}></div>
                  <span className="text-xs font-bold text-[#dc2626]">{opeScore.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/*Adver */}
            {surveyData && (
              <div className={`mt-4 border p-3 rounded-lg ${gap >= 1 ? 'bg-[#fef2f2] border-[#fca5a5]' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs font-bold text-gray-800">Brecha jerárquica: {gap.toFixed(2)} pts</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  {gap >= 1
                    ? "Brecha crítica entre Estratégico y Operativo. La política institucional no llega a la práctica docente."
                    : "Alineación aceptable entre la visión estratégica y la ejecución operativa."}
                </p>
              </div>
            )}
          </div>

          {/*dimensiones (8)*/}
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
          <h1 className="text-2xl font-bold text-gray-800 opacity-0">.</h1>

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

        {/*pRINCIPAL */}
        <ResumenGen surveyData={surveyData} />
      </main>
    </div>
  )
}

export default App;