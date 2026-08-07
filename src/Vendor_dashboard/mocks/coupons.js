export const MOCK_COUPONS = [
  {
    id: 1,
    code: "AYUR10",
    discount_type: "percentage",
    discount_value: 10,
    min_order: 500,
    usage_count: 45,
    usage_limit: 100,
    status: "active",
    expires_at: "2026-12-31",
  },
  {
    id: 2,
    code: "FLAT100",
    discount_type: "fixed",
    discount_value: 100,
    min_order: 999,
    usage_count: 12,
    usage_limit: 50,
    status: "active",
    expires_at: "2026-08-31",
  },
  {
    id: 3,
    code: "SUMMER25",
    discount_type: "percentage",
    discount_value: 25,
    min_order: 1500,
    usage_count: 100,
    usage_limit: 100,
    status: "expired",
    expires_at: "2026-06-30",
  },
];

export function getMockCoupons(params = {}) {
  let list = [...MOCK_COUPONS];
  if (params.status) list = list.filter((c) => c.status === params.status);
  if (params.search) {
    const term = params.search.toLowerCase();
    list = list.filter((c) => c.code.toLowerCase().includes(term));
  }
  return { results: list, count: list.length };
}
