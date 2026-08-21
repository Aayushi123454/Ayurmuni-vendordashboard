import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import { customerService } from "../../../services/customerService";
import {
  customerStatusClassName,
  formatCustomerStatusLabel,
  formatDeliveryAddress,
  parseCustomerDetailResponse,
} from "./customerHelpers";
import {
  formatCurrency,
  formatOrderDate,
  formatPaymentLabel,
  formatStatusLabel,
} from "../Order/orderHelpers";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Order History" },
  { id: "addresses", label: "Delivery Addresses" },
  { id: "notes", label: "Notes" },
];

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchCustomer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await customerService.get(id);
      setCustomer(parseCustomerDetailResponse(response));
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md mx-auto">
          <p className="text-gray-600 mb-4">Customer not found</p>
          <button
            type="button"
            onClick={() => navigate("/vendor/orders?view=customers")}
            className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderHistory = customer.order_history || [];
  const addresses = customer.addresses || [];
  const latestDeliveryAddress = orderHistory[0]?.delivery_address || addresses[0] || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-800">{customer.name || "Customer"}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customerStatusClassName(customer.status)}`}
              >
                {formatCustomerStatusLabel(customer.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{customer.email || customer.phone || "—"}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/vendor/orders?view=customers")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#0D614E] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-800 mt-1">{customer.phone || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-800 mt-1">{customer.email || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="font-medium text-gray-800 mt-1">{customer.orders_count ?? 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Lifetime Value</p>
                <p className="font-medium text-gray-800 mt-1">
                  {formatCurrency(customer.lifetime_value)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Order</p>
                <p className="font-medium text-gray-800 mt-1">
                  {customer.last_order_at || "—"}
                </p>
              </div>
            </div>

            {latestDeliveryAddress ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#0D614E]/10 text-[#0D614E]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Latest delivery address</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDeliveryAddress(latestDeliveryAddress)}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {orderHistory.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">Recent orders</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-sm text-[#0D614E] hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {orderHistory.slice(0, 3).map((order) => {
                    const { date } = formatOrderDate(order.date);
                    return (
                      <div
                        key={order.order_id}
                        className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/vendor/orders/${order.order_id}`)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-gray-800">
                            {order.order_display_code || order.order_code}
                          </span>
                          <span className="text-xs capitalize text-gray-500">
                            {formatStatusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{date}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orderHistory.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500 shadow-sm">
                No orders found for this customer.
              </div>
            ) : (
              orderHistory.map((order) => {
                const { date, time } = formatOrderDate(order.date);
                return (
                  <div
                    key={order.order_id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/vendor/orders/${order.order_id}`)}
                          className="text-sm font-semibold text-[#0D614E] hover:underline"
                        >
                          {order.order_display_code || order.order_code}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          {date}
                          {time ? ` · ${time}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          {formatStatusLabel(order.status)} ·{" "}
                          {formatPaymentLabel(order.payment_type, order.payment_method)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {formatCurrency(
                          order.items?.reduce((sum, item) => sum + (item.total_amount || 0), 0)
                        )}
                      </p>
                    </div>

                    <div className="px-5 py-4 bg-[#0D614E]/[0.03] border-b border-gray-100">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-[#0D614E] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Deliver to
                          </p>
                          <p className="text-sm text-gray-800 mt-1">
                            {formatDeliveryAddress(order.delivery_address)}
                          </p>
                          {order.delivery_address?.address_type_name ? (
                            <p className="text-xs text-gray-500 mt-1">
                              {order.delivery_address.address_type_name}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {(order.items || []).map((item) => (
                        <div
                          key={item.order_item_id}
                          className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {item.product_image || item.cover_image ? (
                              <img
                                src={item.cover_image || item.product_image}
                                alt={item.product_name || "Product"}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                <img
                                  src={Ayurvedaimage}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {item.product_name || item.variant_title || "Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty {item.quantity}
                                {item.sku_code ? ` · ${item.sku_code}` : ""}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            {formatCurrency(item.total_amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-sm text-gray-500 text-center">
                No delivery addresses on file from orders yet.
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#0D614E]/10 text-[#0D614E]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase font-semibold text-gray-500">
                          {address.address_type_name || address.type || "Address"}
                        </span>
                        {address.is_default ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="text-gray-800 mt-2 font-medium">
                        {formatDeliveryAddress(address)}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs text-gray-500">
                        {address.address_line_1 ? <p>Line 1: {address.address_line_1}</p> : null}
                        {address.address_line_2 ? <p>Line 2: {address.address_line_2}</p> : null}
                        {address.city ? <p>City: {address.city}</p> : null}
                        {address.state ? <p>State: {address.state}</p> : null}
                        {address.zipcode ? <p>PIN: {address.zipcode}</p> : null}
                        {address.country ? <p>Country: {address.country}</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-sm text-gray-700">
            {customer.notes || "No notes available."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
