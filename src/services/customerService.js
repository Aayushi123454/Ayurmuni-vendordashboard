import API from "./api";
import { getMockCustomers, getMockCustomer } from "../Vendor_dashboard/mocks/customers";

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS !== "false";

export const customerService = {
  list: async (params = {}) => {
    if (USE_MOCKS) {
      return { data: { success: true, data: getMockCustomers(params) } };
    }
    return API.get("/vendors/customers/", { params });
  },

  get: async (id) => {
    if (USE_MOCKS) {
      const customer = getMockCustomer(id);
      return { data: { success: true, data: customer } };
    }
    return API.get(`/vendors/customers/?id=${id}`);
  },
};
