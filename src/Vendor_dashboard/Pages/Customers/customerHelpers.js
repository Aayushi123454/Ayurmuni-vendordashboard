export function parseCustomersListResponse(response) {
  const data = response?.data?.data;
  return {
    results: data?.results || [],
    count: data?.count || 0,
  };
}

export function parseCustomerDetailResponse(response) {
  return response?.data?.data || null;
}

export function formatCustomerStatusLabel(status) {
  return status === "active" ? "Active" : "Inactive";
}

export function customerStatusClassName(status) {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-gray-100 text-gray-600";
}

export function formatDeliveryAddress(address) {
  if (!address) return "—";
  if (address.line) return address.line;
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.state,
    address.zipcode,
    address.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

export function customerInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Formats API date-only values like "2026-08-21" without timezone shift. */
export function formatDateOnly(value) {
  if (!value) return "—";
  const match = String(value)
    .slice(0, 10)
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "—";
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getOrderTotal(order) {
  const billed = Number(order?.order_total_amount);
  if (!Number.isNaN(billed) && order?.order_total_amount != null) return billed;
  return (order?.items || []).reduce(
    (sum, item) => sum + (Number(item.total_amount) || 0),
    0
  );
}

export function getOrderItemCount(order) {
  const items = order?.items || [];
  return {
    lines: items.length,
    quantity: items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
  };
}

export function summarizeOrderStatuses(orders = []) {
  return orders.reduce((counts, order) => {
    const key = String(order?.status || "unknown").toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

export function sortAddresses(addresses = []) {
  return [...addresses].sort((a, b) => Number(Boolean(b.is_default)) - Number(Boolean(a.is_default)));
}

export function filterCustomerOrders(orders = [], { status = "all", search = "" } = {}) {
  const query = search.trim().toLowerCase();
  return orders.filter((order) => {
    if (status !== "all" && String(order.status || "").toLowerCase() !== status) {
      return false;
    }
    if (!query) return true;
    const haystack = [
      order.order_code,
      order.order_display_code,
      order.status,
      order.payment_type,
      order.payment_method,
      formatDeliveryAddress(order.delivery_address),
      ...(order.items || []).flatMap((item) => [
        item.product_name,
        item.variant_title,
        item.sku_code,
      ]),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}
