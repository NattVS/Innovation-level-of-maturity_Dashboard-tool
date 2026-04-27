import React from 'react';

const KPIcard = ({ title, value, subtitle, valueColor = "text-gray-700" }) => {
    return (
        <div className="bg-white rounded-xl p-4 border-[1px] border-gray-100 flex flex-col items-center justify-center text-center h-full">
            <h4 className="text-sm font-bold text-gray-800 mb-2">{title}</h4>
            <p className={`text-5xl font-extrabold mb-2 ${valueColor}`}>{value}</p>
            <p className="text-xs text-gray-600 font-medium">{subtitle}</p>
        </div>
    );
};

export default KPIcard;