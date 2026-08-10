import {
    formatCount,
    formatCurrencyStat,
    formatRateStat,
    hasFinanceActivity,
} from "../../components/shared/statFormatters";

// Re-export shared formatters used by Finance.jsx
export { formatCount, formatCurrencyStat, hasFinanceActivity };

export const FINANCE_STATUS_FILTERS = [
    { key: "all", label: "All Statuses" },
    { key: "delivered", label: "Delivered" },
    { key: "pending", label: "In Fulfillment" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returned", label: "Returned" },
];

export const FINANCE_PAYMENT_FILTERS = [
    { key: "", label: "All Methods" },
    { key: "prepaid", label: "Prepaid" },
    { key: "cod", label: "COD" },
];

export const CHART_RANGE_OPTIONS = [
    { key: "6", label: "6 months" },
    { key: "12", label: "12 months" },
    { key: "custom", label: "Custom range" },
];

const MONTH_INDEX = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export const EMPTY_FINANCE_METRICS = {
    total_revenue: { value: 0, currency: "INR" },
    this_month_revenue: { value: 0, currency: "INR" },
    available_balance: { value: 0, currency: "INR" },
    pending_balance: { value: 0, currency: "INR" },
    pending_payments: { value: 0, currency: "INR" },
    avg_order_value: { value: 0, currency: "INR" },
    total_orders: { value: 0 },
    pipeline_orders: { value: 0 },
    collection_rate: { value: null },
    payment_split: {},
    monthly_revenue: [],
    details: [],
    total_settlements: { value: null },
    tax_collected: { value: null, currency: "INR" },
    vendor_payout: { value: null, currency: "INR" },
    refunds_chargebacks: { value: 0, currency: "INR" },
    wallet_configured: false,
};

export function parseFinanceMetricsResponse(response) {
    const data = response?.data?.data || response?.data || {};
    return {
        ...EMPTY_FINANCE_METRICS,
        ...data,
        details: data.details || [],
        monthly_revenue: data.monthly_revenue || [],
        payment_split: data.payment_split || {},
        tax_collected: data.tax_collected || data.gst_collected || EMPTY_FINANCE_METRICS.tax_collected,
        vendor_payout: data.vendor_payout || data.net_payout || EMPTY_FINANCE_METRICS.vendor_payout,
        refunds_chargebacks: data.refunds_chargebacks || data.refunds_total || EMPTY_FINANCE_METRICS.refunds_chargebacks,
        total_settlements: data.total_settlements ?? EMPTY_FINANCE_METRICS.total_settlements,
    };
}

export function parseFinanceTransactionsResponse(response) {
    const data = response?.data?.data || response?.data || {};
    return {
        results: data.results || [],
        count: Number(data.count) || 0,
    };
}

export function formatMetricValue(metric, { prefix = "₹", hasActivity = true } = {}) {
    if (!metric || metric.value == null) return hasActivity ? `${prefix}0` : "—";
    if (metric.unavailable_reason) return "—";
    const amount = Number(metric.value);
    if (Number.isNaN(amount)) return "—";
    if (!hasActivity && amount === 0) return "—";
    if (prefix) {
        return `${prefix}${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}`;
    }
    return amount.toLocaleString("en-IN");
}

export function formatCollectionRate(metric, metrics) {
    const active = hasFinanceActivity(metrics);
    if (!active || metric?.value == null || metric?.unavailable_reason) return "—";
    return formatRateStat(metric.value, { hasData: true });
}

export function formatAvgOrderValue(metric, metrics) {
    const orders = Number(metrics?.total_orders?.value) || 0;
    return formatMetricValue(metric, { hasActivity: orders > 0 });
}

export function formatTrend(metric) {
    if (metric?.trend_percent == null) return null;
    const sign = metric.trend_percent > 0 ? "+" : "";
    return `${sign}${metric.trend_percent}% vs last month`;
}

export function formatFinanceDate(value) {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatPaymentType(value) {
    if (!value) return "—";
    return String(value).toUpperCase();
}

export function getFinanceStatusLabel(status) {
    const map = {
        success: "Delivered",
        pending: "In fulfillment",
        cancelled: "Cancelled",
        returned: "Returned",
    };
    return map[status] || status || "—";
}

export function getMaxMonthlyRevenue(monthlyRevenue = []) {
    return Math.max(...monthlyRevenue.map((m) => Number(m.revenue) || 0), 1);
}

export function toChartMonthKey(item) {
    const idx = MONTH_INDEX[item.month];
    const year = Number(item.year) || new Date().getFullYear();
    if (idx == null) return `${item.month} ${year}`;
    return new Date(year, idx, 1);
}

export function filterMonthlyRevenue(monthlyRevenue = [], range = "6", customFrom = "", customTo = "") {
    if (!monthlyRevenue.length) return [];

    const sorted = [...monthlyRevenue].sort(
        (a, b) => toChartMonthKey(a).getTime() - toChartMonthKey(b).getTime()
    );

    if (range === "12") return sorted.slice(-12);
    if (range === "custom" && customFrom && customTo) {
        const from = new Date(customFrom);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return sorted.filter((item) => {
            const d = toChartMonthKey(item);
            return d >= from && d <= to;
        });
    }
    return sorted.slice(-6);
}

export function isCurrentMonthBar(item) {
    const now = new Date();
    const monthLabel = now.toLocaleString("en-US", { month: "short" });
    return Number(item.year) === now.getFullYear() && item.month === monthLabel;
}

export function toRechartsMonthlyData(monthlyRevenue = []) {
    return monthlyRevenue.map((item) => ({
        ...item,
        label: `${item.month} ${String(item.year || "").slice(-2)}`.trim(),
        revenue: Number(item.revenue) || 0,
        isCurrent: isCurrentMonthBar(item),
    }));
}

export function hasPaymentSplitData(metrics) {
    const entries = Object.entries(metrics?.payment_split || {});
    if (entries.length > 0) return true;
    const orders = Number(metrics?.total_orders?.value) || 0;
    return orders > 0;
}

export function exportTransactionsToCsv(transactions, filename = "finance-transactions.csv") {
    const headers = ["Order Code", "Product", "Variant", "Amount (INR)", "Payment Method", "Status", "Date"];
    const rows = transactions.map((tx) => [
        tx.order_code || "",
        tx.name || "",
        tx.variant_title || "",
        tx.amount ?? "",
        tx.payment_method || tx.type || "",
        getFinanceStatusLabel(tx.status),
        tx.date || "",
    ]);

    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
