export const ORDER_STATUS_FILTERS = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returned", label: "Returned" },
];

export const PAYMENT_TYPE_FILTERS = [
    { key: "cod", label: "COD" },
    { key: "prepaid", label: "Prepaid" },
];

export const EMPTY_ORDER_SUMMARY = {
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
};

export function parseOrdersListResponse(response) {
    const data = response?.data?.data;
    return {
        results: data?.results || [],
        count: data?.count || 0,
    };
}

export function parseOrdersSummaryResponse(response) {
    const data = response?.data?.data || {};
    return {
        ...EMPTY_ORDER_SUMMARY,
        ...data,
        total: Number(data.total) || 0,
    };
}

export function formatOrderDate(value) {
    if (!value) return { date: "—", time: "" };
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return { date: "—", time: "" };
    return {
        date: parsed.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        time: parsed.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
}

export function formatCurrency(value) {
    const amount = Number(value);
    if (Number.isNaN(amount)) return "—";
    return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

export function formatPaymentLabel(paymentType, paymentMethod) {
    const type = (paymentType || "").toUpperCase();
    const method = (paymentMethod || "").replace(/_/g, " ");
    if (type && method) return `${type} · ${method}`;
    return type || method || "—";
}

export function formatStatusLabel(status) {
    if (!status) return "—";
    return String(status).replace(/_/g, " ");
}
