import API from "./api";
import { getMockCoupons } from "../Vendor_dashboard/mocks/coupons";

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS !== "false";

let mockStore = [...getMockCoupons().results];

export const couponService = {
  list: async (params = {}) => {
    if (USE_MOCKS) {
      return { data: { success: true, data: getMockCoupons(params) } };
    }
    return API.get("/vendors/coupons/", { params });
  },

  create: async (data) => {
    if (USE_MOCKS) {
      const item = { id: Date.now(), usage_count: 0, status: "active", ...data };
      mockStore.push(item);
      return { data: { success: true, data: item } };
    }
    return API.post("/vendors/coupons/", data);
  },

  update: async (id, data) => {
    if (USE_MOCKS) {
      mockStore = mockStore.map((c) => (c.id === id ? { ...c, ...data } : c));
      return { data: { success: true, data: mockStore.find((c) => c.id === id) } };
    }
    return API.patch(`/vendors/coupons/?id=${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCKS) {
      mockStore = mockStore.filter((c) => c.id !== id);
      return { data: { success: true } };
    }
    return API.delete(`/vendors/coupons/?id=${id}`);
  },
};
