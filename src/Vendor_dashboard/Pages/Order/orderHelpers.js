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
    const payload = response?.data?.data ?? response?.data ?? {};
    const results = Array.isArray(payload?.results)
        ? payload.results
        : Array.isArray(payload)
          ? payload
          : [];
    return {
        results,
        count: Number(payload?.count) || results.length,
        next: payload?.next ?? null,
        previous: payload?.previous ?? null,
    };
}

export function parseOrdersSummaryResponse(response) {
    const data = response?.data?.data || response?.data || {};
    return {
        ...EMPTY_ORDER_SUMMARY,
        ...data,
        total: Number(data.total) || 0,
        pending: Number(data.pending) || 0,
        confirmed: Number(data.confirmed) || 0,
        processing: Number(data.processing) || 0,
        shipped: Number(data.shipped) || 0,
        delivered: Number(data.delivered) || 0,
        cancelled: Number(data.cancelled) || 0,
        returned: Number(data.returned) || 0,
    };
}

/**
 * API returns flat line items; group by order_id for order-centric UI.
 * Preserves API sort order (first occurrence of each order).
 */
export function groupOrderLineItems(lineItems = []) {
    const orderMap = new Map();

    lineItems.forEach((item) => {
        const orderId = item?.order_id;
        if (!orderId) return;

        if (!orderMap.has(orderId)) {
            orderMap.set(orderId, {
                order_id: orderId,
                order_code: item.order_code || "",
                order_display_code: item.order_display_code || "",
                date: item.date || null,
                status: item.status || "",
                payment_type: item.payment_type || "",
                payment_method: item.payment_method || "",
                address: item.address || "",
                order_total_amount:
                    item.order_total_amount != null
                        ? Number(item.order_total_amount)
                        : null,
                items: [],
            });
        }

        const order = orderMap.get(orderId);
        order.items.push(item);

        if (item.order_total_amount != null) {
            order.order_total_amount = Number(item.order_total_amount);
        }
        if (!order.date && item.date) order.date = item.date;
        if (!order.status && item.status) order.status = item.status;
        if (!order.payment_type && item.payment_type) {
            order.payment_type = item.payment_type;
        }
        if (!order.payment_method && item.payment_method) {
            order.payment_method = item.payment_method;
        }
        if (!order.address && item.address) order.address = item.address;
    });

    return Array.from(orderMap.values()).map((order) => {
        const quantity = order.items.reduce(
            (sum, item) => sum + (Number(item.quantity) || 0),
            0
        );
        const lineTotal = order.items.reduce(
            (sum, item) => sum + (Number(item.total_amount) || 0),
            0
        );
        return {
            ...order,
            item_count: order.items.length,
            quantity,
            amount:
                order.order_total_amount != null && !Number.isNaN(order.order_total_amount)
                    ? order.order_total_amount
                    : lineTotal,
        };
    });
}

export function formatOrderDate(value) {
    if (!value) return { date: "—", time: "" };
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return { date: "—", time: "" };
    return {
        date: parsed.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        time: parsed.toLocaleTimeString("en-IN", {
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

function titleCaseWords(value) {
    return String(value)
        .replace(/_/g, " ")
        .trim()
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function formatPaymentLabel(paymentType, paymentMethod) {
    const type = paymentType ? String(paymentType).toUpperCase() : "";
    const method = paymentMethod ? titleCaseWords(paymentMethod) : "";
    if (type && method) return `${type} · ${method}`;
    return type || method || "—";
}

export function formatStatusLabel(status) {
    if (!status) return "—";
    return titleCaseWords(status);
}

export function truncateAddress(address, max = 48) {
    if (!address) return "";
    const text = String(address).trim();
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1)}…`;
}
