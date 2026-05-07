import React, { useState } from 'react';
import KPIcard from '../components/KPIcard';
import RadarChartComponent from '../components/RadarChart';
import DetalleJerarquia from '../components/DetalleJerarquia';
import Brechas from '../components/DetalleBrechas';
import Dimensiones from '../components/DetalleDim';

const ResumenGen = ({ surveyData }) => {
    const [activeTab, setActiveTab] = useState('Resumen General');

    if (!surveyData || !surveyData.dimensions) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
                <p>Esperando datos del archivo Excel...</p>
            </div>
        );
    }

    //dimensiones fuerte y débil
    const dimEntries = Object.entries(surveyData.dimensions).sort((a, b) => b[1] - a[1]);
    const strongestDim = dimEntries[0];
    const weakestDim = dimEntries[dimEntries.length - 1];

    //brechas Críticas
    const criticalGapsCount = surveyData.gapsPerDimension.filter(g => g.gap >= 1).length;
    const topGaps = surveyData.gapsPerDimension.filter(g => g.gap > 0).slice(0, 2);

    const tabs = ['Resumen General', 'Brechas', 'Nivel Estratégico', 'Nivel Táctico', 'Nivel Operativo', 'Dimensiones', 'Análisis'];

    return (
        <div className="space-y-6">
            {/* tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab
                            ? 'bg-gray-800 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {activeTab === 'Resumen General' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPIcard
                            title="Promedio Global"
                            value={surveyData.globalAvg?.toFixed(2) || "0.00"}
                            subtitle={`Nivel de madurez: ${surveyData.globalAvg <= 0.71 ? 'Reactivo' : surveyData.globalAvg <= 1.43 ? 'Incipiente' : surveyData.globalAvg <= 2.14 ? 'Emergente' : surveyData.globalAvg <= 2.86 ? 'Establecido' : surveyData.globalAvg <= 3.57 ? 'Avanzado' : surveyData.globalAvg <= 4.29 ? 'Sistémico' : 'Transformador'}`}
                            valueColor="text-[#ca8a04]"
                        />
                        <KPIcard
                            title="Brecha Jerárquica"
                            value={surveyData.gap?.toFixed(2) || "0.00"}
                            subtitle="Estratégica vs Operativo"
                            valueColor="text-[#dc2626]"
                        />
                        <KPIcard
                            title="Encuestados"
                            value={surveyData.raw?.length || "0"}
                            subtitle="Total respuestas"
                            valueColor="text-gray-500"
                        />
                        <KPIcard
                            title="Dim. con Brecha Crítica"
                            value={`${criticalGapsCount}/${Object.keys(surveyData.dimensions).length}`}
                            subtitle="Brecha > 1.0 pts"
                            valueColor="text-[#dc2626]"
                        />
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-medium text-gray-800 mb-6">Comparación por dimensión y nivel jerárquico</h3>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-w-3xl mx-auto">
                            <RadarChartComponent data={surveyData.radarData} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Dimensiones</h3>
                            <div className="space-y-4">
                                <div className="bg-[#fef2f2] border border-[#fca5a5] p-5 rounded-lg">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                        Dimensión más débil — {weakestDim[0]} ({weakestDim[1].toFixed(2)})
                                        <span className="w-4 h-4 bg-[#ca8a04] rounded-sm inline-block"></span>
                                    </h4>
                                    <p className="text-sm text-gray-700">Dimensión con el puntaje más bajo a nivel institucional. Requiere prioridad inmediata en el plan de acción.</p>
                                </div>
                                <div className="bg-[#f0fdf4] border border-[#86efac] p-5 rounded-lg">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                        Dimensión más fuerte — {strongestDim[0]} ({strongestDim[1].toFixed(2)})
                                        <span className="w-4 h-4 bg-[#1e3a8a] rounded-sm inline-block"></span>
                                    </h4>
                                    <p className="text-sm text-gray-700">Principal fortaleza institucional detectada en la enseñanza de la innovación.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Brechas</h3>
                            <div className="space-y-4">
                                {topGaps.map((gapObj, idx) => (
                                    <div key={idx} className="bg-[#fefce8] border border-[#fde047] p-5 rounded-lg">
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                            {gapObj.dim} ({surveyData.dimensions[gapObj.dim].toFixed(2)}) — Brecha {gapObj.gap >= 1 ? 'Alta' : 'Media'}
                                            <span className="w-4 h-4 bg-[#dc2626] rounded-sm inline-block"></span>
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            Nivel Operativo: {gapObj.opeAvg.toFixed(2)}/5. Existe una desconexión importante respecto a la visión estratégica ({gapObj.estAvg.toFixed(2)}/5).
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/*JERARQUIA */}
            {['Nivel Estratégico', 'Nivel Táctico', 'Nivel Operativo'].includes(activeTab) && (
                <DetalleJerarquia
                    nivel={activeTab.replace('Nivel ', '')}
                    surveyData={surveyData}
                />
            )}
            {/*Detalle breshcas */}
            {activeTab === 'Brechas' && (
                <Brechas surveyData={surveyData} />
            )}

            {/*Detalle dimensiones*/}
            {activeTab === 'Dimensiones' && (
                <Dimensiones surveyData={surveyData} />
            )}

        </div>

    );
};

export default ResumenGen;