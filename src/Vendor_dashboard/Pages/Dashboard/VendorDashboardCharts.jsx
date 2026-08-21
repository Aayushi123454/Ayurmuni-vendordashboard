import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
} from "recharts";

const BRAND = "#0D614E";
const PIE_COLORS = ["#0D614E", "#10B981", "#8B5CF6", "#F59E0B", "#F43F5E", "#3B82F6"];

function ChartCard({ title, subtitle, children, emptyMessage, hasData }) {
    return (
        <div className="ds-card ds-card-interactive p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {hasData ? (
                <div className="h-72">{children}</div>
            ) : (
                <div className="h-72 flex items-center justify-center text-sm text-gray-400">
                    {emptyMessage}
                </div>
            )}
        </div>
    );
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md text-sm">
            <p className="font-medium text-gray-800">{item?.fullName || label || item?.name}</p>
            <p className="text-[#0D614E] font-semibold mt-0.5">
                {payload[0].name}: {payload[0].value?.toLocaleString?.() ?? payload[0].value}
            </p>
        </div>
    );
}

export default function VendorDashboardCharts({
    stockChartData = [],
    categoryChartData = [],
    approvalChartData = [],
    stockActivityData = [],
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
                title="Stock by Product"
                subtitle="Top items by quantity on hand"
                hasData={stockChartData.length > 0}
                emptyMessage="Add inventory records to see stock levels."
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockChartData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="quantity" name="Units" fill={BRAND} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                title="Variant Approval Status"
                subtitle="Breakdown across your product variants"
                hasData={approvalChartData.length > 0}
                emptyMessage="Add products with variants to see approval status."
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={approvalChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={3}
                        >
                            {approvalChartData.map((entry, index) => (
                                <Cell key={entry.name} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [value, name]}
                            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                title="Products by Category"
                subtitle="Distribution of your catalog"
                hasData={categoryChartData.length > 0}
                emptyMessage="Add products to see category distribution."
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={100}
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="count" name="Products" fill="#10B981" radius={[0, 6, 6, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                title="Stock Update Activity"
                subtitle="Inventory records updated by month"
                hasData={stockActivityData.length > 0}
                emptyMessage="Stock updates will appear here over time."
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stockActivityData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
                            formatter={(value) => [value, "Updates"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="updates"
                            name="Updates"
                            stroke={BRAND}
                            strokeWidth={2.5}
                            dot={{ fill: BRAND, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}
