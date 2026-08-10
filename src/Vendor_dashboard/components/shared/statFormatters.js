/** Counts that can genuinely be zero */
export function formatCount(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString("en-IN");
}

/** Currency — ₹0 is valid when there is activity context */
export function formatCurrencyStat(metric, { hasActivity = true } = {}) {
    if (!metric || metric.value == null) return hasActivity ? "₹0" : "—";
    if (metric.unavailable_reason) return "—";
    const amount = Number(metric.value);
    if (Number.isNaN(amount)) return "—";
    if (!hasActivity && amount === 0) return "—";
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Percentages / rates — use "—" when no meaningful data */
export function formatRateStat(value, { hasData = true } = {}) {
    if (!hasData || value == null || Number.isNaN(Number(value))) return "—";
    return `${Math.round(Number(value))}%`;
}

export function formatAverageRating(rating, totalReviews) {
    if (!totalReviews || totalReviews <= 0) return "—";
    const n = Number(rating);
    if (Number.isNaN(n)) return "—";
    return n.toFixed(1);
}

export function hasFinanceActivity(metrics) {
    const rev = Number(metrics?.total_revenue?.value) || 0;
    const orders = Number(metrics?.total_orders?.value) || 0;
    return rev > 0 || orders > 0 || (metrics?.monthly_revenue?.length > 0);
}
