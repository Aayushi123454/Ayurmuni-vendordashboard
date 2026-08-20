import React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const BRAND = "#0D614E";

function ChartShell({ title, subtitle, children, emptyMessage, hasData, className = "", tall = false }) {
    return (
        <div className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}>
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {hasData ? (
                <div className={tall ? "h-[220px]" : "h-[200px]"}>{children}</div>
            ) : (
                <div className={`${tall ? "h-[220px]" : "h-[200px]"} flex flex-col items-center justify-center text-center px-4`}>
                    <p className="text-sm text-gray-400">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
}

function PremiumTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
        <div className="rounded-lg border border-gray-100 bg-white/95 backdrop-blur px-3 py-2 shadow-lg text-sm">
            <p className="font-semibold text-gray-800 text-xs">{item?.fullName || label || item?.name || item?.month}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-[#0D614E] font-medium mt-0.5 text-xs">
                    {entry.name}: {entry.value?.toLocaleString?.() ?? entry.value}
                </p>
            ))}
        </div>
    );
}

export default function DashboardAnalytics({
    stockChartData = [],
    categoryChartData = [],
    approvalChartData = [],
    stockActivityData = [],
    topProductsData = [],
}) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3">
                <ChartShell
                    className="col-span-12 xl:col-span-8"
                    title="Top Products by Stock"
                    subtitle="Highest quantity items"
                    hasData={stockChartData.length > 0}
                    emptyMessage="Add inventory to see stock levels."
                    tall
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stockChartData} margin={{ top: 4, right: 4, left: -16, bottom: 36 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} angle={-30} textAnchor="end" height={48} interval={0} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} cursor={{ fill: "rgba(13,97,78,0.04)" }} />
                            <Bar dataKey="quantity" name="Units" fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={36} animationDuration={500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    className="col-span-12 xl:col-span-4"
                    title="Inventory Health"
                    subtitle="Approval breakdown"
                    hasData={approvalChartData.length > 0}
                    emptyMessage="Add variants to see health."
                    tall
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={approvalChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius={44}
                                outerRadius={68}
                                paddingAngle={3}
                                animationDuration={600}
                            >
                                {approvalChartData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #f3f4f6", fontSize: 11 }} />
                            <Legend verticalAlign="bottom" iconType="circle" formatter={(v) => <span className="text-[11px] text-gray-600">{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>

            <div className="grid grid-cols-12 gap-3">
                <ChartShell
                    className="col-span-12 lg:col-span-5"
                    title="Stock Activity"
                    subtitle="Updates over time"
                    hasData={stockActivityData.length > 0}
                    emptyMessage="Activity appears as you update stock."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stockActivityData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Area type="monotone" dataKey="updates" name="Updates" stroke={BRAND} strokeWidth={2} fill="url(#salesGrad)" animationDuration={600} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    className="col-span-12 lg:col-span-4"
                    title="By Category"
                    subtitle="Catalog mix"
                    hasData={categoryChartData.length > 0}
                    emptyMessage="Add products to see categories."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Bar dataKey="count" name="Products" fill="#10B981" radius={[0, 4, 4, 0]} maxBarSize={18} animationDuration={500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    className="col-span-12 lg:col-span-3"
                    title="Top Products"
                    subtitle="By stock"
                    hasData={topProductsData.length > 0}
                    emptyMessage="Products appear here."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProductsData} margin={{ top: 4, right: 4, left: -16, bottom: 28 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} interval={0} angle={-25} textAnchor="end" height={40} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Bar dataKey="stock" name="Stock" fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={28} animationDuration={500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>
        </div>
    );
}
