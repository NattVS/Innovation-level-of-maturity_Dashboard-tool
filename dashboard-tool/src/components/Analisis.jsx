import React from 'react';

const Analisis = ({ analysisData }) => {
    if (!analysisData) return null;

    return (
        <div className="space-y-12 animate-fadeIn">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Análisis Cualitativo de Valor</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Resultados cualitativos consolidados, prácticas identificadas y plan estratégico de recomendación temporal.
                </p>
            </header>

            {/* BLOQUE 1: FORTALEZAS Y DEBILIDADES */}
            <div className="flex flex-col gap-8">
                {/* FORTALEZAS */}
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-emerald-800 flex items-center gap-2 tracking-wide">
                        <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                        FORTALEZAS IDENTIFICADAS
                    </h2>
                    <div className="space-y-3">
                        {analysisData.fortalezas.length > 0 ? (
                            analysisData.fortalezas.map((item, idx) => (
                                <div key={idx} className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl shadow-sm">
                                    <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">{item.title}</h4>
                                    <p className="text-sm text-emerald-800 leading-relaxed">{item.info}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-xs ml-2">No se registran fortalezas.</p>
                        )}
                    </div>
                </div>

                {/* DEBILIDADES */}
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-red-800 flex items-center gap-2 tracking-wide">
                        <div className="w-1.5 h-5 bg-red-500 rounded-full"></div>
                        DEBILIDADES IDENTIFICADAS
                    </h2>
                    <div className="space-y-3">
                        {analysisData.debilidades.length > 0 ? (
                            analysisData.debilidades.map((item, idx) => (
                                <div key={idx} className="bg-red-50/60 border border-red-100 p-4 rounded-xl shadow-sm">
                                    <h4 className="font-bold text-red-900 text-xs uppercase tracking-wider mb-1">{item.title}</h4>
                                    <p className="text-sm text-red-800 leading-relaxed">{item.info}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-xs ml-2">No se registran debilidades.</p>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* BLOQUE 2: PRÁCTICAS METODOLÓGICAS TRANSFERIBLES */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-blue-800 flex items-center gap-2 tracking-wide">
                    <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                    PRÁCTICAS METODOLÓGICAS TRANSFERIBLES
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisData.practicas && analysisData.practicas.length > 0 ? (
                        analysisData.practicas.map((item, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
                                <div>
                                    <span className="text-[10px] uppercase bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">Estrategia Aplicada</span>
                                    <h3 className="font-bold text-gray-800 text-sm mt-2 mb-3">{item.practica}</h3>

                                    <div className="space-y-2.5">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block">¿Cómo se implementa?</span>
                                            <p className="text-xs text-gray-600 leading-relaxed">{item.descripcion}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Resultados Observables</span>
                                            <p className="text-xs text-gray-700 font-medium leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">{item.resultados}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic text-xs col-span-2 ml-2">No se registran prácticas transferibles definidas.</p>
                    )}
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* BLOQUE 3: RECOMENDACIONES - HORIZONTE TEMPORAL */}
            <section className="space-y-4">
                <h2 className="text-base font-bold text-purple-800 flex items-center gap-2 tracking-wide">
                    <div className="w-1.5 h-5 bg-purple-500 rounded-full"></div>
                    RECOMENDACIONES POR HORIZONTE TEMPORAL
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* COLUMNA INMEDIATO */}
                    <div className="bg-[#fcfaff] border border-purple-100 rounded-xl p-4 flex flex-col gap-3">
                        <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-center uppercase tracking-wider">
                            Inmediato (0-12 Meses)
                        </div>
                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-1">
                            {analysisData.recomendaciones.filter(r => r.inmediato).map((item, idx) => (
                                <div key={idx} className="bg-white border border-purple-100/70 p-3 rounded-lg text-xs text-gray-700 leading-relaxed shadow-xs">
                                    {item.inmediato}
                                </div>
                            ))}
                            {analysisData.recomendaciones.filter(r => r.inmediato).length === 0 && (
                                <p className="text-gray-400 italic text-[11px] text-center pt-4">Sin acciones programadas.</p>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA MEDIANO */}
                    <div className="bg-[#fffbf7] border border-orange-100 rounded-xl p-4 flex flex-col gap-3">
                        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-center uppercase tracking-wider">
                            Mediano (12-36 Meses)
                        </div>
                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-1">
                            {analysisData.recomendaciones.filter(r => r.mediano).map((item, idx) => (
                                <div key={idx} className="bg-white border border-orange-100/70 p-3 rounded-lg text-xs text-gray-700 leading-relaxed shadow-xs">
                                    {item.mediano}
                                </div>
                            ))}
                            {analysisData.recomendaciones.filter(r => r.mediano).length === 0 && (
                                <p className="text-gray-400 italic text-[11px] text-center pt-4">Sin acciones programadas.</p>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA LARGO */}
                    <div className="bg-[#f7fbf9] border border-emerald-100 rounded-xl p-4 flex flex-col gap-3">
                        <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-center uppercase tracking-wider">
                            Largo Plazo (36+ Meses)
                        </div>
                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-1">
                            {analysisData.recomendaciones.filter(r => r.largo).map((item, idx) => (
                                <div key={idx} className="bg-white border border-emerald-100/70 p-3 rounded-lg text-xs text-gray-700 leading-relaxed shadow-xs">
                                    {item.largo}
                                </div>
                            ))}
                            {analysisData.recomendaciones.filter(r => r.largo).length === 0 && (
                                <p className="text-gray-400 italic text-[11px] text-center pt-4">Sin acciones programadas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Analisis;