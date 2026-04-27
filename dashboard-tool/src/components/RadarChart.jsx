import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const RadarChartComponent = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full flex flex-col items-center">
            <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#d1d5db" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }}
                        />
                        {/* Domain fija la escala de 0 a 5 */}
                        <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                        <Tooltip />
                        <Radar name="Estratégico" dataKey="Estratégico" stroke="#4c1d95" fill="none" strokeWidth={2} />
                        <Radar name="Táctico" dataKey="Táctico" stroke="#ea580c" fill="none" strokeWidth={2} />
                        <Radar name="Operativo" dataKey="Operativo" stroke="#0f766e" fill="none" strokeWidth={2} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Leyenda */}
            <div className="flex gap-8 mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#4c1d95] rounded-sm"></div>
                    <span className="text-sm">Estratégico</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#ea580c] rounded-sm"></div>
                    <span className="text-sm">Táctico</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#0f766e] rounded-sm"></div>
                    <span className="text-sm">Operativo</span>
                </div>
            </div>
        </div>
    );
};

export default RadarChartComponent;