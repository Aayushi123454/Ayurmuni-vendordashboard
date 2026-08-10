import { mockUpdateOrderStatus } from "../Vendor_dashboard/mocks/orderActions";

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS !== "false";

export const orderService = {
  updateStatus: async (orderId, action) => {
    if (USE_MOCKS) {
      return mockUpdateOrderStatus(orderId, action);
    }
    return Promise.reject(new Error("Order status update API not available"));
  },
};
