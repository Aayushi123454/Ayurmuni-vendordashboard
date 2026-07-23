import React from "react";

/** KPI stat card — matches Doctor Dashboard StatCard pattern. */
export default function StatCard({ title, value, icon: Icon, iconBg = "bg-emerald-50", iconColor = "text-[#0D614E]", trend }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                    {trend && (
                        <p className="text-xs text-gray-500 mt-2">{trend}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} className={iconColor} />
                    </div>
                )}
            </div>
        </div>
    );
}
