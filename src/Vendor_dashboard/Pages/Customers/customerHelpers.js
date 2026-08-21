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
