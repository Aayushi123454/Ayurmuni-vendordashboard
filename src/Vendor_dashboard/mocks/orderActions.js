export const ORDER_STATUS_FLOW = [
  { id: "new", label: "New Order", status: "complete" },
  { id: "packed", label: "Packed", status: "current" },
  { id: "ready", label: "Ready", status: "pending" },
  { id: "shipped", label: "Shipped", status: "pending" },
  { id: "delivered", label: "Delivered", status: "pending" },
  { id: "completed", label: "Completed", status: "pending" },
];

export const ORDER_ACTIONS = [
  { action: "packed", label: "Mark as Packed" },
  { action: "ready", label: "Mark as Ready" },
  { action: "shipped", label: "Mark as Shipped" },
  { action: "delivered", label: "Mark as Delivered" },
  { action: "cancelled", label: "Cancel Order", variant: "danger" },
];

export async function mockUpdateOrderStatus(orderId, action) {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, order_id: orderId, status: action };
}
