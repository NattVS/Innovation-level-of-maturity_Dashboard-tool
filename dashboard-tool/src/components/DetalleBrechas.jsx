import React from 'react';
import RadarChartComponent from '../components/RadarChart';

// Función auxiliar para determinar la severidad de la brecha (incluye nivel verde "Alineado")
const getGapSeverity = (gap) => {
    if (gap >= 1.5) return { text: "Brecha Crítica", color: "bg-red-100 text-red-800", dot: "bg-red-500" };
    if (gap >= 1.0) return { text: "Brecha Alta", color: "bg-orange-100 text-orange-800", dot: "bg-orange-500" };
    if (gap > 0.5) return { text: "Brecha Media", color: "bg-amber-100 text-amber-800", dot: "bg-amber-500" };
    // Si la brecha es <= 0.5 (incluso negativa), se considera sana o alineada
    return { text: "Alineado", color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" };
};

// Función para obtener el nombre completo de la dimensión
const getFullDimName = (dimKey) => {
    const names = { D1: 'Estrategia', D2: 'Gobernanza', D3: 'Docente', D4: 'Pedagógico', D5: 'Infraestructura', D6: 'Vinculación', D7: 'Medición', D8: 'Creatividad' };
    return `${dimKey} ${names[dimKey] || ''}`;
};

const Brechas = ({ surveyData }) => {
    if (!surveyData || !surveyData.radarData || !surveyData.gapsPerDimension) {
        return <div className="p-8 text-gray-500">Esperando datos válidos...</div>;
    }

    // 1. Preparamos TODAS las dimensiones con sus 3 niveles para la Sección 1
    const allDimensionsData = surveyData.radarData.map(item => {
        const gap = item['Estratégico'] - item['Operativo'];
        return {
            dim: item.subject,
            estAvg: item['Estratégico'],
            tacAvg: item['Táctico'],
            opeAvg: item['Operativo'],
            gap: gap
        };
    });

    // 2. Para la Sección 2 (Cualitativa), seguimos tomando las 2 peores dimensiones para cruzarlas
    const sortedGaps = [...allDimensionsData].sort((a, b) => b.gap - a.gap);
    const topGapsForQual = sortedGaps.slice(0, 2);

    let interDimensionalCards = [];
    if (surveyData.qualMatrix && topGapsForQual.length >= 2) {
        const dimA = topGapsForQual[0].dim;
        const dimB = topGapsForQual[1].dim;

        // Verificamos si existe un cruce entre estas dos en la matriz del Excel (Hoja 3)
        const hallazgo1 = surveyData.qualMatrix[dimA]?.[dimB];
        const hallazgo2 = surveyData.qualMatrix[dimB]?.[dimA];

        if (hallazgo1 && hallazgo1 !== 'X') {
            interDimensionalCards.push({
                title: `Efecto de ${getFullDimName(dimA)} sobre ${getFullDimName(dimB)}`,
                text: hallazgo1
            });
        }
        if (hallazgo2 && hallazgo2 !== 'X') {
            interDimensionalCards.push({
                title: `Efecto de ${getFullDimName(dimB)} sobre ${getFullDimName(dimA)}`,
                text: hallazgo2
            });
        }
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Sección Brechas</h1>
                <p className="text-gray-500 mt-1 max-w-3xl">
                    Análisis detallado de las desconexiones institucionales. Una brecha alta indica tensión entre la visión estratégica y la ejecución operativa, dificultando la consolidación de la innovación.
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
                        <p><b className="text-[#4c1d95]">Línea Violeta (Estratégico):</b> Representa la percepción de rectores, decanos y alta dirección. Es la visión y política formal.</p>
                        <p><b className="text-[#ca8a04]">Línea Amarilla (Táctico):</b> Directores de departamento y jefes. Es la gestión intermedia.</p>
                        <p><b className="text-[#0f766e]">Línea Verde (Operativo):</b> Docentes e investigadores. Es la ejecución real en el aula y laboratorio.</p>
                        <p>El área gris sombreada representa el estado consolidado actual. Las brechas ocurren donde las líneas están más separadas.</p>
                    </div>
                </div>

                <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <RadarChartComponent data={surveyData.radarData} />
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* 1. BRECHAS INTRA-DIMENSIONALES (Muestra TODAS las dimensiones y compara los 3 niveles) */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">1. Brechas intra-dimensionales · Entre niveles jerárquicos</h2>
                    <p className="text-sm text-gray-500 mt-1 max-w-3xl">Comparativa de los tres niveles jerárquicos por dimensión. La brecha neta representa la diferencia entre los 3 niveles jerárquicos.</p>
                </div>

                <div className="space-y-4">
                    {allDimensionsData.map((data, idx) => {
                        const severity = getGapSeverity(data.gap);
                        return (
                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                                {/* Dimensión e Info */}
                                <div className="lg:col-span-2">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${severity.color}`}>
                                        <div className={`w-2 h-2 rounded-full ${severity.dot}`}></div>
                                        {severity.text}
                                    </div>
                                    <h4 className="font-bold text-gray-900 mt-2">{getFullDimName(data.dim)}</h4>
                                    <p className="text-xs text-gray-500">Promedio global: {surveyData.dimensions[data.dim]?.toFixed(2)}</p>
                                </div>

                                {/* Calificaciones de los 3 niveles */}
                                <div className="flex gap-4 justify-between text-center lg:col-span-3 px-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Estratégico</p>
                                        <p className="text-2xl font-extrabold text-[#4c1d95]">{data.estAvg.toFixed(2)}</p>
                                    </div>
                                    <div className="w-px bg-gray-200 my-2"></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Táctico</p>
                                        <p className="text-2xl font-extrabold text-[#ca8a04]">{data.tacAvg.toFixed(2)}</p>
                                    </div>
                                    <div className="w-px bg-gray-200 my-2"></div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Operativo</p>
                                        <p className="text-2xl font-extrabold text-[#0f766e]">{data.opeAvg.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Brecha Neta */}
                                <div className="text-center lg:text-right border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-4">
                                    <p className="text-xs text-gray-500 font-medium">Brecha neta</p>
                                    <p className="text-3xl font-black text-gray-900">{data.gap.toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">puntos</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 2. BRECHAS INTER-DIMENSIONALES (Cualitativas consumidas de la hoja 3) */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">2. Brechas inter-dimensionales · Análisis de causas raíz</h2>
                    <p className="text-sm text-gray-500 mt-1 max-w-3xl">Cruce cualitativo que explica cómo la deficiencia en una de las áreas críticas afecta directamente a la otra, formando un cuello de botella.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {interDimensionalCards.length === 0 ? (
                        <div className="col-span-2 bg-[#f8fafc] border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                            No se encontraron hallazgos cualitativos cruzados en el archivo Excel para las dimensiones críticas.
                        </div>
                    ) : (
                        interDimensionalCards.map((card, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                <h4 className="font-bold text-gray-800 text-base mb-4">{card.title}</h4>

                                <blockquote className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-lg border border-gray-100 italic relative mb-4">
                                    <span className="text-3xl text-gray-200 absolute -top-1 -left-1">“</span>
                                    {card.text}
                                    <span className="text-3xl text-gray-200 absolute -bottom-4 -right-1">”</span>
                                </blockquote>

                                <div className="mt-auto pt-3 border-t border-gray-100 text-[10px] text-gray-500 flex justify-between items-center uppercase font-bold">
                                    <span>Extraído de la Matriz Cualitativa Institucional</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Brechas;