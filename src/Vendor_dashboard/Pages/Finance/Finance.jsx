import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowUpRight,
    Clock3,
    CreditCard,
    Download,
    IndianRupee,
    PiggyBank,
    Receipt,
    RefreshCw,
    RotateCcw,
    ShoppingBag,
    Target,
    TrendingUp,
    Wallet,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { vendorService } from "../../../services/vendorService";
import usePersistedState from "../../hooks/usePersistedState";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { EmptyState, PageEmpty, PageError, PaginationBar, TableCard } from "../../components/shared/PageState";
import { MetricSkeleton } from "../../components/shared/Skeleton";
import SetupNoticeBanner from "../../components/shared/SetupNoticeBanner";
import SearchToolbar, { SelectFilter } from "../../components/shared/SearchToolbar";
import Button from "../../components/shared/Button";
import StatusBadge from "../../components/shared/StatusBadge";
import DataTable, { TableCell, TableRow } from "../../components/shared/DataTable";
import { formatCurrency, formatPaymentLabel } from "../Order/orderHelpers";
import {
    CHART_RANGE_OPTIONS,
    EMPTY_FINANCE_METRICS,
    FINANCE_PAYMENT_FILTERS,
    FINANCE_STATUS_FILTERS,
    exportTransactionsToCsv,
    filterMonthlyRevenue,
    formatAvgOrderValue,
    formatCollectionRate,
    formatCount,
    formatFinanceDate,
    formatMetricValue,
    formatPaymentType,
    formatTrend,
    getFinanceStatusLabel,
    hasFinanceActivity,
    hasPaymentSplitData,
    parseFinanceMetricsResponse,
    parseFinanceTransactionsResponse,
    toRechartsMonthlyData,
} from "./financeHelpers";
import "../../components/shared/vendor-shared.css";

const BRAND = "#0D614E";
const BRAND_LIGHT = "#0D614E99";

const TX_COLUMNS = [
    { key: "order", label: "Order" },
    { key: "product", label: "Product" },
    { key: "amount", label: "Amount" },
    { key: "payment", label: "Payment" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
];

function SectionLabel({ children }) {
    return (
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{children}</p>
    );
}

function KpiCard({ label, value, hint, trend, icon: Icon, iconBg, iconColor, hero }) {
    if (hero) {
        return (
            <div className="rounded-xl bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] p-5 text-white shadow-lg shadow-[#0D614E]/15">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm text-emerald-100">{label}</p>
                        <p className="mt-1 text-2xl font-bold">{value}</p>
                        {trend && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-100">
                                <TrendingUp size={14} />
                                <span>{trend}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                        <Icon size={22} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                    {(hint || trend) && (
                        <p className="mt-2 text-xs text-gray-400">{trend || hint}</p>
                    )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon size={20} className={iconColor} />
                </div>
            </div>
        </div>
    );
}

function RevenueTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-lg text-sm">
            <p className="font-semibold text-gray-800">{item?.label}</p>
            <p className="text-[#0D614E] font-medium mt-0.5">{formatCurrency(item?.revenue)}</p>
            {item?.isCurrent && (
                <p className="text-xs text-amber-600 mt-1">Current month</p>
            )}
        </div>
    );
}

export default function Finance() {
    const navigate = useNavigate();
    const hasLoadedMetrics = useRef(false);

    const [metrics, setMetrics] = useState(EMPTY_FINANCE_METRICS);
    const [transactions, setTransactions] = useState([]);
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [txLoading, setTxLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = usePersistedState("vendor:finance:pageSize", 10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [chartRange, setChartRange] = useState("6");
    const [chartFrom, setChartFrom] = useState("");
    const [chartTo, setChartTo] = useState("");

    const activity = useMemo(() => hasFinanceActivity(metrics), [metrics]);

    const fetchMetrics = useCallback(async () => {
        const response = await vendorService.getFinanceMetrics({ details_limit: 5 });
        return parseFinanceMetricsResponse(response);
    }, []);

    const buildTxParams = useCallback((overrides = {}) => ({
        page: overrides.page ?? page,
        page_size: overrides.page_size ?? pageSize,
        status: statusFilter,
        payment_type: paymentFilter || undefined,
        search: search || undefined,
        from_date: dateFrom || undefined,
        to_date: dateTo || undefined,
        ...overrides,
    }), [page, pageSize, statusFilter, paymentFilter, search, dateFrom, dateTo]);

    const fetchTransactions = useCallback(async (overrides = {}) => {
        const response = await vendorService.getFinanceTransactions(buildTxParams(overrides));
        return parseFinanceTransactionsResponse(response);
    }, [buildTxParams]);

    const loadMetrics = useCallback(async (isRefresh = false) => {
        if (!isRefresh && !hasLoadedMetrics.current) setMetricsLoading(true);
        try {
            const metricsData = await fetchMetrics();
            setMetrics(metricsData);
            hasLoadedMetrics.current = true;
        } catch (err) {
            if (!hasLoadedMetrics.current) {
                setError(
                    err?.response?.data?.message
                        || err?.response?.data?.error?.message
                        || err.message
                        || "Failed to load finance data"
                );
            } else {
                toast.error("Could not refresh finance metrics");
            }
        } finally {
            setMetricsLoading(false);
        }
    }, [fetchMetrics]);

    const loadTransactions = useCallback(async () => {
        setTxLoading(true);
        try {
            const txData = await fetchTransactions();
            setTransactions(txData.results);
            setTotalCount(txData.count);
            setError("");
        } catch (err) {
            setError(
                err?.response?.data?.message
                    || err?.response?.data?.error?.message
                    || err.message
                    || "Failed to load transactions"
            );
        } finally {
            setTxLoading(false);
        }
    }, [fetchTransactions]);

    const reloadAll = useCallback(async (isRefresh = false) => {
        setError("");
        if (isRefresh) setRefreshing(true);
        await Promise.all([loadMetrics(isRefresh), loadTransactions()]);
        setRefreshing(false);
    }, [loadMetrics, loadTransactions]);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const chartData = useMemo(() => {
        const filtered = filterMonthlyRevenue(
            metrics.monthly_revenue,
            chartRange,
            chartFrom,
            chartTo
        );
        return toRechartsMonthlyData(filtered);
    }, [metrics.monthly_revenue, chartRange, chartFrom, chartTo]);

    const paymentSplitEntries = useMemo(
        () => Object.entries(metrics.payment_split || {}),
        [metrics.payment_split]
    );

    const showPaymentSplit = hasPaymentSplitData(metrics);
    const settlementUnavailable = Boolean(metrics.total_settlements?.unavailable_reason);

    const hasActiveQuery = Boolean(
        search || statusFilter !== "all" || paymentFilter || dateFrom || dateTo
    );

    const handleSearchSubmit = () => {
        setPage(1);
        setSearch(searchInput.trim());
    };

    const handleClearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatusFilter("all");
        setPaymentFilter("");
        setDateFrom("");
        setDateTo("");
        setPage(1);
    };

    const handleExportCsv = async () => {
        setExporting(true);
        try {
            const txData = await fetchTransactions({ page: 1, page_size: 5000 });
            if (!txData.results.length) {
                toast.error("No transactions to export");
                return;
            }
            exportTransactionsToCsv(txData.results);
            toast.success(`Exported ${txData.results.length} transaction${txData.results.length === 1 ? "" : "s"}`);
        } catch {
            toast.error("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const showMetricsSkeleton = metricsLoading && !hasLoadedMetrics.current;

    return (
        <DashboardPageShell
            compact
            hidePageHeader
            contentClassName="p-4 md:p-5 bg-gray-50 min-h-full"
            actions={
                <>
                    <Button variant="secondary" onClick={() => navigate("/vendor/profile")}>
                        Bank Details
                    </Button>
                    <Button variant="secondary" onClick={() => reloadAll(true)} loading={refreshing} disabled={metricsLoading && !hasLoadedMetrics.current}>
                        {!refreshing && <RefreshCw size={16} />}
                        Refresh
                    </Button>
                </>
            }
        >
            {showMetricsSkeleton ? (
                <>
                    <SectionLabel>Revenue &amp; Balance</SectionLabel>
                    <MetricSkeleton count={4} />
                    <SectionLabel>Operations</SectionLabel>
                    <MetricSkeleton count={4} />
                </>
            ) : error && !hasLoadedMetrics.current ? (
                <PageError message={error} onRetry={() => reloadAll()} />
            ) : (
                <>
                    <SectionLabel>Revenue &amp; Balance</SectionLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                        <KpiCard
                            hero
                            label="Total Revenue"
                            value={formatMetricValue(metrics.total_revenue, { hasActivity: activity })}
                            trend={formatTrend(metrics.total_revenue)}
                            icon={IndianRupee}
                        />
                        <KpiCard
                            label="Available Balance"
                            value={formatMetricValue(metrics.available_balance, { hasActivity: activity })}
                            hint={metrics.wallet_configured ? "Wallet balance" : "From delivered orders"}
                            icon={Wallet}
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-600"
                        />
                        <KpiCard
                            label="Pending Balance"
                            value={formatMetricValue(metrics.pending_balance, { hasActivity: activity })}
                            hint="Orders in fulfillment"
                            icon={PiggyBank}
                            iconBg="bg-emerald-50"
                            iconColor="text-emerald-600"
                        />
                        <KpiCard
                            label="This Month"
                            value={formatMetricValue(metrics.this_month_revenue, { hasActivity: activity })}
                            icon={TrendingUp}
                            iconBg="bg-amber-50"
                            iconColor="text-amber-600"
                        />
                    </div>

                    <SectionLabel>Operations</SectionLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <KpiCard
                            label="Collection Rate"
                            value={formatCollectionRate(metrics.collection_rate, metrics)}
                            icon={Target}
                            iconBg="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                        <KpiCard
                            label="In Fulfillment"
                            value={formatCount(metrics.pipeline_orders?.value)}
                            icon={Clock3}
                            iconBg="bg-yellow-100"
                            iconColor="text-yellow-600"
                        />
                        <KpiCard
                            label="Pending Payments"
                            value={formatMetricValue(metrics.pending_payments, { hasActivity: activity })}
                            icon={Wallet}
                            iconBg="bg-emerald-100"
                            iconColor="text-emerald-600"
                        />
                        <KpiCard
                            label="Avg Order Value"
                            value={formatAvgOrderValue(metrics.avg_order_value, metrics)}
                            icon={IndianRupee}
                            iconBg="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                    </div>

                    <div className="rounded-xl border border-red-100 bg-red-50/40 p-4 mb-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-red-800">Refunds &amp; Chargebacks</p>
                                <p className="mt-1 text-2xl font-bold text-red-900">
                                    {formatMetricValue(metrics.refunds_chargebacks, { hasActivity: activity })}
                                </p>
                                <p className="mt-1 text-xs text-red-700/80">
                                    Kept separate from gross revenue for accounting clarity
                                </p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                                <RotateCcw size={20} className="text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm mb-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0D614E]/10">
                                <Receipt size={20} className="text-[#0D614E]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-800">GST &amp; Tax Summary</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Tax collected from customers vs your net payout</p>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                        <p className="text-xs text-gray-500">GST / Tax Collected</p>
                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                            {formatMetricValue(metrics.tax_collected, { hasActivity: activity })}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-[#0D614E]/10 bg-[#0D614E]/5 px-4 py-3">
                                        <p className="text-xs text-gray-500">Vendor Payout (Net)</p>
                                        <p className="mt-1 text-lg font-bold text-[#0D614E]">
                                            {formatMetricValue(metrics.vendor_payout, { hasActivity: activity })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">Monthly Revenue</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Delivered order revenue by month</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {CHART_RANGE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => setChartRange(opt.key)}
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                                                chartRange === opt.key
                                                    ? "bg-[#0D614E] text-white border-[#0D614E]"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {chartRange === "custom" && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <input
                                        type="date"
                                        value={chartFrom}
                                        onChange={(e) => setChartFrom(e.target.value)}
                                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                                        aria-label="Chart from date"
                                    />
                                    <input
                                        type="date"
                                        value={chartTo}
                                        onChange={(e) => setChartTo(e.target.value)}
                                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                                        aria-label="Chart to date"
                                    />
                                </div>
                            )}

                            {chartData.length > 0 ? (
                                <div className="mt-4 h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                            <XAxis
                                                dataKey="label"
                                                tick={{ fontSize: 11, fill: "#6b7280" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: "#6b7280" }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                            />
                                            <Tooltip content={<RevenueTooltip />} cursor={{ fill: "#f9fafb" }} />
                                            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                                {chartData.map((entry) => (
                                                    <Cell
                                                        key={entry.label}
                                                        fill={entry.isCurrent ? BRAND : BRAND_LIGHT}
                                                        stroke={entry.isCurrent ? BRAND : "none"}
                                                        strokeWidth={entry.isCurrent ? 2 : 0}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-gray-500">No delivered order revenue yet.</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-gray-800">Payment Split</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Breakdown by payment method</p>

                            {!showPaymentSplit ? (
                                <div className="mt-4">
                                    <EmptyState
                                        icon={CreditCard}
                                        title="No payment data yet"
                                        subtitle="Payment breakdown appears once you receive orders with prepaid or COD payments."
                                        className="!py-10 !shadow-none !border-0"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="mt-4 space-y-2">
                                        {paymentSplitEntries.map(([type, info]) => (
                                            <div
                                                key={type}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{formatPaymentType(type)}</p>
                                                    <p className="text-xs text-gray-500">{info.count} orders</p>
                                                </div>
                                                <p className="text-sm font-bold text-[#0D614E]">{formatCurrency(info.amount)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="rounded-lg bg-[#0D614E]/5 border border-[#0D614E]/10 p-3">
                                            <p className="text-xs text-gray-500">Delivered Orders</p>
                                            <p className="text-lg font-bold text-[#0D614E]">{formatCount(metrics.total_orders?.value)}</p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                                            <p className="text-xs text-gray-500">Settlements</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {formatMetricValue(metrics.total_settlements, { hasActivity: activity })}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {settlementUnavailable && (
                                <SetupNoticeBanner
                                    className="mt-3"
                                    message="Payout settlement tracking is not configured yet. Bank details in your profile will be used when payouts go live."
                                />
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Order line items with payment and fulfillment status</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" className="!text-sm" onClick={handleExportCsv} loading={exporting} disabled={txLoading}>
                            {!exporting && <Download size={14} />}
                            Export CSV
                        </Button>
                        <Button variant="ghost" className="!text-sm" onClick={() => navigate("/vendor/orders")}>
                            View Orders
                            <ArrowUpRight size={14} />
                        </Button>
                    </div>
                </div>

                <div className="px-5 py-3 border-b border-gray-100">
                    <SearchToolbar
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onSubmit={handleSearchSubmit}
                        onClear={hasActiveQuery ? handleClearFilters : undefined}
                        placeholder="Search by order code or product…"
                        className="!mb-0 !p-0 !shadow-none !ring-0"
                    >
                        <SelectFilter
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            options={FINANCE_STATUS_FILTERS.map((f) => ({ value: f.key, label: f.label }))}
                            placeholder="Status"
                            aria-label="Filter by status"
                            className="w-40 shrink-0"
                        />
                        <SelectFilter
                            value={paymentFilter}
                            onChange={(e) => {
                                setPaymentFilter(e.target.value);
                                setPage(1);
                            }}
                            options={FINANCE_PAYMENT_FILTERS.map((f) => ({ value: f.key, label: f.label }))}
                            placeholder="Payment Method"
                            aria-label="Filter by payment method"
                            className="w-40 shrink-0"
                        />
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                            className="px-2 py-2 border border-gray-300 rounded-lg text-sm w-36 shrink-0"
                            aria-label="From date"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                            className="px-2 py-2 border border-gray-300 rounded-lg text-sm w-36 shrink-0"
                            aria-label="To date"
                        />
                    </SearchToolbar>
                </div>

                {txLoading && !transactions.length ? (
                    <div className="p-5"><MetricSkeleton count={3} /></div>
                ) : transactions.length === 0 ? (
                    <div className="p-5">
                        <PageEmpty
                            icon={ShoppingBag}
                            title={hasActiveQuery ? "No transactions match your filters" : "No transactions yet"}
                            subtitle={
                                hasActiveQuery
                                    ? "Try adjusting your search or filter criteria."
                                    : "Revenue from customer orders will appear here once you start receiving orders."
                            }
                            action={
                                hasActiveQuery ? (
                                    <Button variant="secondary" onClick={handleClearFilters}>
                                        Clear filters
                                    </Button>
                                ) : null
                            }
                        />
                    </div>
                ) : (
                    <TableCard className="!rounded-none !border-0 !shadow-none">
                        <DataTable columns={TX_COLUMNS}>
                            {transactions.map((tx) => (
                                <TableRow
                                    key={tx.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/vendor/orders/${tx.order_id}`)}
                                >
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{tx.order_code || "—"}</p>
                                            <p className="text-xs text-gray-400">#{String(tx.id).slice(0, 8)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-gray-900">{tx.name || "Product"}</p>
                                            {tx.variant_title && (
                                                <p className="text-xs text-gray-400">{tx.variant_title}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-gray-900">{formatCurrency(tx.amount)}</span>
                                    </TableCell>
                                    <TableCell>{formatPaymentLabel(tx.type, tx.payment_method)}</TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={tx.order_status || tx.status}
                                            label={getFinanceStatusLabel(tx.status)}
                                        />
                                    </TableCell>
                                    <TableCell>{formatFinanceDate(tx.date)}</TableCell>
                                </TableRow>
                            ))}
                        </DataTable>

                        <PaginationBar
                            page={page}
                            pageSize={pageSize}
                            totalCount={totalCount}
                            onPageChange={setPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setPage(1);
                            }}
                            itemLabel="transactions"
                            storageKey="vendor:finance"
                        />
                    </TableCard>
                )}
            </div>
        </DashboardPageShell>
    );
}
