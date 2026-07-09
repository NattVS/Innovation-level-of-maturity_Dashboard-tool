import React from 'react';

const getFullDimName = (dimKey) => {
    const names = {
        D1: 'Estrategia',
        D2: 'Gobernanza',
        D3: 'Docente',
        D4: 'Pedagógico',
        D5: 'Infraestructura',
        D6: 'Vinculación',
        D7: 'Medición',
        D8: 'Creatividad'
    };
    return `${dimKey} - ${names[dimKey] || ''}`;
};

const Dimensiones = ({ surveyData }) => {
    if (!surveyData || !surveyData.radarData) {
        return <div className="p-8 text-center text-gray-500">Esperando datos válidos...</div>;
    }

    const colors = {
        'Estratégico': '#4E007F',
        'Táctico': '#F37324',
        'Operativo': '#19857d'
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Comportamiento por Dimensión</h1>
                <p className="text-sm text-gray-500 mt-1">Nivel de madurez y consistencia jerárquica individual.</p>
            </header>

            {surveyData.radarData.map((dimData, idx) => {
                const estScore = dimData['Estratégico'] || 0;
                const tacScore = dimData['Táctico'] || 0;
                const opeScore = dimData['Operativo'] || 0;
                const textoAnalisis = surveyData.dimensionAnalysis?.[dimData.subject];

                return (
                    <div
                        key={idx}
                        className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col gap-5 hover:border-gray-200 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                            <div className="flex flex-col gap-3 w-full md:w-64 shrink-0">
                                <h3 className="font-bold text-gray-800 text-sm leading-tight min-h-[32px]">
                                    {getFullDimName(dimData.subject)}
                                </h3>

                                <div className="grid grid-cols-3 gap-1.5 text-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                    <div className="flex flex-col border-r border-gray-100">
                                        <span className="text-[10px] font-medium text-gray-400">EST</span>
                                        <span className="text-sm font-bold" style={{ color: colors['Estratégico'] }}>
                                            {estScore.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col border-r border-gray-100">
                                        <span className="text-[10px] font-medium text-gray-400">TAC</span>
                                        <span className="text-sm font-bold" style={{ color: colors['Táctico'] }}>
                                            {tacScore.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-medium text-gray-400">OPE</span>
                                        <span className="text-sm font-bold" style={{ color: colors['Operativo'] }}>
                                            {opeScore.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center gap-3.5 px-2 w-full">
                                {/* Barra Estratégico */}
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 w-8">EST</span>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${(estScore / 5) * 100}%`, backgroundColor: colors['Estratégico'] }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Barra Táctico */}
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 w-8">TAC</span>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700 ease-out delay-75"
                                            style={{ width: `${(tacScore / 5) * 100}%`, backgroundColor: colors['Táctico'] }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Barra Operativo */}
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 w-8">OPE</span>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700 ease-out delay-150"
                                            style={{ width: `${(opeScore / 5) * 100}%`, backgroundColor: colors['Operativo'] }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-1 pt-3 border-t border-gray-100 w-full">
                            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    Análisis detallado de dimensión
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {textoAnalisis || "No se registran observaciones cualitativas para esta dimensión en el archivo actual."}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Dimensiones;