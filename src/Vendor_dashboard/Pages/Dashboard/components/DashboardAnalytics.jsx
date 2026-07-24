import React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const BRAND = "#0D614E";

function ChartShell({ title, subtitle, children, emptyMessage, hasData, className = "" }) {
    return (
        <div className={`rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {hasData ? (
                <div className="h-[260px] sm:h-[280px]">{children}</div>
            ) : (
                <div className="h-[260px] sm:h-[280px] flex flex-col items-center justify-center text-center px-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                        <span className="text-gray-300 text-xl">—</span>
                    </div>
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
        <div className="rounded-xl border border-gray-100 bg-white/95 backdrop-blur px-3 py-2.5 shadow-lg text-sm animate-in fade-in duration-150">
            <p className="font-semibold text-gray-800">{item?.fullName || label || item?.name || item?.month}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-[#0D614E] font-medium mt-0.5">
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
    inventoryHealthData = [],
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                <ChartShell
                    className="col-span-12 xl:col-span-8"
                    title="Top Products by Stock"
                    subtitle="Highest quantity items in your inventory"
                    hasData={stockChartData.length > 0}
                    emptyMessage="Add inventory records to see stock levels."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stockChartData} margin={{ top: 8, right: 8, left: -12, bottom: 48 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} angle={-30} textAnchor="end" height={56} interval={0} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} cursor={{ fill: "rgba(13,97,78,0.04)" }} />
                            <Bar dataKey="quantity" name="Units" fill={BRAND} radius={[6, 6, 0, 0]} maxBarSize={40} animationDuration={500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    className="col-span-12 xl:col-span-4"
                    title="Inventory Health"
                    subtitle="Approval status breakdown"
                    hasData={approvalChartData.length > 0}
                    emptyMessage="Add variants to see health metrics."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={approvalChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius={52}
                                outerRadius={78}
                                paddingAngle={4}
                                animationDuration={600}
                            >
                                {approvalChartData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }} />
                            <Legend verticalAlign="bottom" iconType="circle" formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>

            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                <ChartShell
                    className="col-span-12 lg:col-span-6"
                    title="Sales Overview"
                    subtitle="Stock update activity over time"
                    hasData={stockActivityData.length > 0}
                    emptyMessage="Activity will appear as you update stock."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stockActivityData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <defs>
                                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Area type="monotone" dataKey="updates" name="Updates" stroke={BRAND} strokeWidth={2} fill="url(#salesGrad)" animationDuration={600} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    className="col-span-12 lg:col-span-6"
                    title="Recent Activity"
                    subtitle="Monthly inventory record changes"
                    hasData={stockActivityData.length > 0}
                    emptyMessage="No recent activity yet."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stockActivityData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Line type="monotone" dataKey="updates" name="Updates" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3 }} activeDot={{ r: 5 }} animationDuration={600} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>

            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                <ChartShell
                    className="col-span-12 lg:col-span-7"
                    title="Products by Category"
                    subtitle="Catalog distribution"
                    hasData={categoryChartData.length > 0}
                    emptyMessage="Add products to see categories."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Bar dataKey="count" name="Products" fill="#10B981" radius={[0, 6, 6, 0]} maxBarSize={24} animationDuration={500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>

                <ChartShell
                    className="col-span-12 lg:col-span-5"
                    title="Top Products"
                    subtitle="By catalog presence"
                    hasData={topProductsData.length > 0}
                    emptyMessage="Your top products will appear here."
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProductsData} margin={{ top: 8, right: 8, left: -12, bottom: 32 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={0} angle={-25} textAnchor="end" height={48} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Bar dataKey="stock" name="Stock" fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={500} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartShell>
            </div>
        </div>
    );
}
