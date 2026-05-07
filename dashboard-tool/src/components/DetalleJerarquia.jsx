import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';


//FIX-ME:Análiss del promedio al lado de la card,borrar el de abajo analisis cuanti (se cambia arriba y el de arriba original(por persona) se borra)
const getMaturityLevel = (avg) => {
    if (avg <= 0.71) return { level: 1, name: "Reactivo" };
    if (avg <= 1.43) return { level: 2, name: "Incipiente" };
    if (avg <= 2.14) return { level: 3, name: "Emergente" };
    if (avg <= 2.86) return { level: 4, name: "Establecido" };
    if (avg <= 3.57) return { level: 5, name: "Avanzado" };
    if (avg <= 4.29) return { level: 6, name: "Sistémico" };
    return { level: 7, name: "Transformador" };
};

const DetalleJerarquia = ({ nivel, surveyData }) => {
    const levelColors = {
        'Estratégico': '#4E007F',
        'Táctico': '#F37324',
        'Operativo': '#19857d'
    };

    const primaryColor = levelColors[nivel] || '#475569';

    //DATOS
    const levelData = useMemo(() => {
        //filtro x lvl
        const respondents = surveyData.raw.filter(r => r.JERARQUÍA?.toLowerCase() === nivel.toLowerCase());

        const processed = respondents.map(r => {
            const role = r['¿Cuál es su cargo o rol?'] || 'Encuestado anónimo';
            let sum = 0, count = 0;
            let weakDims = [];

            ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'].forEach(dim => {
                const keys = Object.keys(r).filter(k => k.startsWith(`${dim}.`));
                let dimSum = 0, dimCount = 0;

                keys.forEach(k => {
                    const val = Number(r[k]);
                    if (!isNaN(val)) {
                        dimSum += val;
                        dimCount++;
                        sum += val;
                        count++;
                    }
                });

                const dimAvg = dimCount > 0 ? dimSum / dimCount : 0;
                if (dimAvg > 0 && dimAvg < 3) {
                    weakDims.push(dim);
                }
            });

            const avg = count > 0 ? sum / count : 0;
            const maturity = getMaturityLevel(avg);

            return {
                id: role,
                role: role,
                avg: Number(avg.toFixed(2)),
                maturity: maturity,
                weakDims: weakDims
            };
        }).sort((a, b) => b.avg - a.avg);

        return processed;
    }, [nivel, surveyData]);

    //Calculos
    const groupAvg = surveyData.hierarchy[nivel.toLowerCase()] || 0;
    const groupMaturity = getMaturityLevel(groupAvg);

    //variables
    const topScorer = levelData[0];
    const bottomScorer = levelData[levelData.length - 1];
    const variance = topScorer && bottomScorer ? (topScorer.avg - bottomScorer.avg).toFixed(2) : 0;

    if (levelData.length === 0) {
        return <div className="p-8 text-center text-gray-500">No hay datos para el nivel {nivel} en este archivo.</div>;
    }

    return (
        <div className="space-y-8 animate-fadeIn">

            {/*HEADER*/}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                {/*promedio y nivel*/}
                <div
                    className="flex-shrink-0 w-48 rounded-xl border p-4 flex flex-col items-center justify-center text-center bg-white shadow-sm"
                    style={{ borderColor: `${primaryColor}40` }}
                >
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>Promedio jerarquía</p>
                    <p className="text-5xl font-extrabold my-2" style={{ color: primaryColor }}>{groupAvg.toFixed(2)}</p>
                    <p className="text-xs font-semibold" style={{ color: primaryColor }}>
                        Nivel {groupMaturity.level} · {groupMaturity.name}
                    </p>
                </div>

                {/*1er análisis*/}
                <div className="flex-1 text-gray-700 text-sm leading-relaxed content-center">
                    El nivel {nivel} lidera la institución con {groupAvg.toFixed(2)}.
                    <b> Alta varianza interna:</b> {topScorer.role} (IRL {topScorer.maturity.level} · {topScorer.maturity.name}, {topScorer.avg}) representa el techo de excelencia, mientras {bottomScorer.role} (IRL {bottomScorer.maturity.level} · {bottomScorer.maturity.name}, {bottomScorer.avg}) arrastra el promedio y concentra brechas críticas. La brecha interna entre el mejor y el peor perfil es de <b>{variance} puntos</b>.
                </div>
            </div>

            {/*gráfico */}
            <div className="h-64 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={levelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="id"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickFormatter={(value) => value.split('·')[0]}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar
                            dataKey="avg"
                            radius={[4, 4, 0, 0]}
                            barSize={60}
                        >
                            {levelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth={1.5} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levelData.map((person, idx) => (
                    <div
                        key={idx}
                        className="bg-[#f8fafc] border border-gray-200 p-4 rounded-xl flex flex-col justify-between"
                        style={{ borderLeftWidth: '4px', borderLeftColor: primaryColor }}
                    >
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{person.role}</h4>
                            <p className="text-xs text-gray-500 mb-3">{nivel}</p>

                            <span
                                className="text-[10px] px-2 py-1 rounded-md font-semibold inline-block"
                                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                            >
                                IRL {person.maturity.level} · {person.maturity.name}
                            </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600 flex items-center gap-2">
                            <span className="font-bold">{person.avg} / 5</span>
                            <span>·</span>
                            {person.weakDims.length === 0 ? (
                                <span className="text-gray-500">Sin brechas críticas</span>
                            ) : (
                                <span>
                                    Brechas: <span className="text-red-600 font-bold">{person.weakDims.join(', ')}</span>
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DetalleJerarquia;