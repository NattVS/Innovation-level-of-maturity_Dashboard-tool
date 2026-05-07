import React from 'react';

const getFullDimName = (dimKey) => {
    const names = { D1: 'Estrategia', D2: 'Gobernanza', D3: 'Docente', D4: 'Pedagógico', D5: 'Infraestructura', D6: 'Vinculación', D7: 'Medición', D8: 'Creatividad' };
    return `${dimKey} - ${names[dimKey] || ''}`;
};

const getGapDescription = (gap) => {
    if (gap >= 1.5) return "una desconexión crítica";
    if (gap >= 1.0) return "una alta falta de alineación";
    if (gap > 0.5) return "una moderada diferencia";
    return "una alineación saludable";
};

const Dimensiones = ({ surveyData }) => {
    if (!surveyData || !surveyData.radarData) {
        return <div className="p-8 text-gray-500">Esperando datos válidos...</div>;
    }

    const colors = {
        'Estratégico': '#4E007F',
        'Táctico': '#F37324',
        'Operativo': '#19857d'
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Comportamiento por Dimensión</h1>
                <p className="text-sm text-gray-500 mt-1">Nivel de madurez y consistencia jerárquica individual.</p>
            </header>

            {/* Listado vertical de tarjetas horizontales */}
            {surveyData.radarData.map((dimData, idx) => {
                const estScore = dimData['Estratégico'];
                const tacScore = dimData['Táctico'];
                const opeScore = dimData['Operativo'];

                const scores = [estScore, tacScore, opeScore];
                const gap = (Math.max(...scores) - Math.min(...scores)).toFixed(2);

                return (
                    <div
                        key={idx}
                        className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-6 hover:border-gray-200 transition-colors"
                    >
                        {/* 1. SECCIÓN IZQUIERDA: TÍTULO Y NÚMEROS */}
                        <div className="flex flex-col gap-3 w-64 shrink-0">
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

                        {/* 2. SECCIÓN CENTRAL */}
                        <div className="flex-1 flex flex-col justify-center gap-3 px-2">
                            {/* Barra Estratégico */}
                            <div className="flex items-center gap-3">
                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${(estScore / 5) * 100}%`, backgroundColor: colors['Estratégico'] }}
                                    ></div>
                                </div>
                            </div>

                            {/* Barra Táctico */}
                            <div className="flex items-center gap-3">
                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out delay-75"
                                        style={{ width: `${(tacScore / 5) * 100}%`, backgroundColor: colors['Táctico'] }}
                                    ></div>
                                </div>
                            </div>

                            {/* Barra Operativo */}
                            <div className="flex items-center gap-3">
                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out delay-150"
                                        style={{ width: `${(opeScore / 5) * 100}%`, backgroundColor: colors['Operativo'] }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* 3. SECCIÓN DERECHA: TEXTO DE ANÁLISIS */}
                        <div className="w-1/3 shrink-0 pl-6 border-l border-gray-100 h-full flex items-center">
                            <p className="text-xs text-gray-600 leading-relaxed">
                                La brecha jerárquica neta de <span className="font-bold text-gray-900">{gap} puntos</span> en esta dimensión indica <span className="font-semibold text-gray-800">{getGapDescription(parseFloat(gap))}</span>
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Dimensiones;