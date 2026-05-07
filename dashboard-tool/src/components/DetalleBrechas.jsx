import React from 'react';
import RadarChartComponent from '../components/RadarChart';

// Función auxiliar para determinar la severidad de la brecha (incluye nivel verde "Alineado")
const getGapSeverity = (gap) => {
    if (gap >= 1.5) return { text: "Brecha Crítica", color: "bg-red-100 text-red-800", dot: "bg-red-500" };
    if (gap >= 1.0) return { text: "Brecha Alta", color: "bg-orange-100 text-orange-800", dot: "bg-orange-500" };
    if (gap > 0.5) return { text: "Brecha Media", color: "bg-amber-100 text-amber-800", dot: "bg-amber-500" };
    return { text: "Alineado", color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" };
};

const getFullDimName = (dimKey) => {
    const names = { D1: 'Estrategia', D2: 'Gobernanza', D3: 'Docente', D4: 'Pedagógico', D5: 'Infraestructura', D6: 'Vinculación', D7: 'Medición', D8: 'Creatividad' };
    return `${dimKey} ${names[dimKey] || ''}`;
};

const Brechas = ({ surveyData }) => {
    if (!surveyData || !surveyData.radarData || !surveyData.gapsPerDimension) {
        return <div className="p-8 text-gray-500">Esperando datos válidos...</div>;
    }

    const allDimensions = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];

    const allDimensionsData = surveyData.radarData.map(item => {
        const valores = [item['Estratégico'], item['Táctico'], item['Operativo']];
        const gapThreeLevels = Math.max(...valores) - Math.min(...valores);

        return {
            dim: item.subject,
            estAvg: item['Estratégico'],
            tacAvg: item['Táctico'],
            opeAvg: item['Operativo'],
            gap: gapThreeLevels
        };
    });

    let consolidatedQualAnalysis = [];

    if (surveyData.qualMatrix) {
        consolidatedQualAnalysis = allDimensionsData.map(primaryDimData => {
            const primaryDimKey = primaryDimData.dim;
            let impacts = [];

            allDimensions.forEach(targetDimKey => {
                if (primaryDimKey === targetDimKey) return;

                const hallazgoText = surveyData.qualMatrix[primaryDimKey]?.[targetDimKey];
                if (hallazgoText && hallazgoText !== 'X') {
                    impacts.push({
                        targetDim: targetDimKey,
                        text: hallazgoText
                    });
                }
            });

            return {
                primaryKey: primaryDimKey,
                numData: primaryDimData,
                impacts: impacts
            };
        }).filter(item => item.numData.gap >= 1.5);
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Sección Brechas</h1>
                <p className="text-gray-500 mt-1 max-w-3xl">
                    Análisis detallado de las desconexiones institucionales. Una brecha alta indica tensión o falta de alineación entre jerarquías.
                </p>
            </header>

            {/* GRID SUPERIOR: COMO LEER + RADAR */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Cómo leer este gráfico
                    </h3>
                    <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                        <p><b className="text-[#4c1d95]">Violeta (Estratégico):</b> Visión institucional formal.</p>
                        <p><b className="text-[#ea580c]">Naranja (Táctico):</b> Gestión intermedia y de departamentos.</p>
                        <p><b className="text-[#0f766e]">Verde (Operativo):</b> Ejecución real de docentes.</p>
                        <p>La brecha neta es la diferencia matemática entre el nivel más alto y el más bajo de los tres.</p>
                    </div>
                </div>

                <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <RadarChartComponent data={surveyData.radarData} />
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* 1. BRECHAS INTRA-DIMENSIONALES */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">1. Brechas intra-dimensionales · Entre niveles jerárquicos</h2>
                </div>

                <div className="space-y-3">
                    {allDimensionsData.map((data, idx) => {
                        const severity = getGapSeverity(data.gap);
                        return (
                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm grid grid-cols-1 lg:grid-cols-6 gap-3 items-center">
                                <div className="lg:col-span-2">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${severity.color}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${severity.dot}`}></div>
                                        {severity.text}
                                    </div>
                                    <h4 className="font-bold text-gray-900 mt-1.5 text-sm">{getFullDimName(data.dim)}</h4>
                                </div>

                                <div className="flex gap-3 justify-between text-center lg:col-span-3 px-3">
                                    <div className="flex-1"><p className="text-2xl font-extrabold text-[#4c1d95]">{data.estAvg.toFixed(2)}</p></div>
                                    <div className="w-px bg-gray-100 my-1"></div>
                                    <div className="flex-1"><p className="text-2xl font-extrabold text-[#ca8a04]">{data.tacAvg.toFixed(2)}</p></div>
                                    <div className="w-px bg-gray-100 my-1"></div>
                                    <div className="flex-1"><p className="text-2xl font-extrabold text-[#0f766e]">{data.opeAvg.toFixed(2)}</p></div>
                                </div>

                                <div className="text-center lg:text-right pt-3 lg:pt-0 lg:pl-3 border-t lg:border-t-0 lg:border-l border-gray-100">
                                    <p className="text-3xl font-black text-gray-900">{data.gap.toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">pts brecha neta</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 2. MATRIZ LISTADO  */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">2. Matriz de Causa Raíz Inter-dimensional </h2>
                    <p className="text-sm text-gray-500 mt-1 max-w-3xl">Este muestra cómo las deficiencias jerárquicas en una dimensión causa actúan como un cuello de botella, limitando el potencial de otras dimensiones. </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm text-sm overflow-hidden">

                    <div className="grid grid-cols-6 border-b border-gray-200 bg-[#f8fafc] text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">
                        <div className="col-span-2">1. Dimensión Causa & Puntajes</div>
                        <div className="col-span-4 pl-6">2. Efectos cualitativos sobre otras dimensiones</div>
                    </div>

                    {/* Filas  */}
                    {consolidatedQualAnalysis.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-xs border-t border-gray-100">
                            No se encontraron hallazgos cualitativos cruzados en el archivo Excel para las dimensiones seleccionadas.
                        </div>
                    ) : (
                        consolidatedQualAnalysis.map((entry, idx) => {

                            if (entry.impacts.length === 0) return null;

                            const primarySeverity = getGapSeverity(entry.numData.gap);

                            return (
                                <div key={idx} className={`grid grid-cols-6 items-stretch ${idx > 0 ? 'border-t border-gray-100' : ''}`}>

                                    <div className="col-span-2 p-4 border-r border-gray-100 flex flex-col gap-3 justify-center">
                                        <div className="flex items-center gap-2">
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${primarySeverity.color}`}>
                                                {primarySeverity.text}
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-sm">{getFullDimName(entry.primaryKey)}</h4>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            <div className="flex flex-col"><span className="text-[10px] font-medium text-gray-400">EST</span><span className="text-xs font-bold text-[#4c1d95]">{entry.numData.estAvg.toFixed(1)}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] font-medium text-gray-400">TAC</span><span className="text-xs font-bold text-[#ca8a04]">{entry.numData.tacAvg.toFixed(1)}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] font-medium text-gray-400">OPE</span><span className="text-xs font-bold text-[#0f766e]">{entry.numData.opeAvg.toFixed(1)}</span></div>
                                        </div>
                                    </div>

                                    <div className="col-span-4 p-5 pl-8">
                                        <h5 className="font-bold text-gray-800 text-xs mb-3 uppercase tracking-wide">Afecta a:</h5>
                                        <ul className="space-y-3.5 list-disc list-outside text-xs text-gray-700 marker:text-blue-500 pl-4">
                                            {entry.impacts.map((impact, i) => (
                                                <li key={i} className="leading-relaxed">
                                                    <b>{getFullDimName(impact.targetDim)}:</b> {impact.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
};

export default Brechas;