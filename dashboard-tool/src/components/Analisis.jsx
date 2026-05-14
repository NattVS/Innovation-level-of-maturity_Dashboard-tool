import React from 'react';

const Analisis = ({ analysisData }) => {
    if (!analysisData) return null;

    return (
        <div className="space-y-10 animate-fadeIn">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Análisis Cualitativo</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Mapeo detallado de capacidades y puntos de mejora extraídos de la matriz de resultados.
                </p>
            </header>

            <div className="flex flex-col gap-12">

                {/* SECCIÓN FORTALEZAS */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                        FORTALEZAS IDENTIFICADAS
                    </h2>
                    <div className="space-y-3">
                        {analysisData.fortalezas.length > 0 ? (
                            analysisData.fortalezas.map((item, idx) => (
                                <div key={idx} className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
                                    <h4 className="font-bold text-emerald-900 mb-1 uppercase text-xs tracking-wider">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-emerald-800 leading-relaxed">
                                        {item.info}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm ml-4">No hay fortalezas registradas.</p>
                        )}
                    </div>
                </div>

                {/* SECCIÓN DEBILIDADES */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
                        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                        DEBILIDADES IDENTIFICADAS
                    </h2>
                    <div className="space-y-3">
                        {analysisData.debilidades.length > 0 ? (
                            analysisData.debilidades.map((item, idx) => (
                                <div key={idx} className="bg-red-50 border border-red-100 p-5 rounded-xl shadow-sm">
                                    <h4 className="font-bold text-red-900 mb-1 uppercase text-xs tracking-wider">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-red-800 leading-relaxed">
                                        {item.info}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm ml-4">No hay debilidades registradas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analisis;