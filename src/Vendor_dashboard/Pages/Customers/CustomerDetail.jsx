import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { customerService } from "../../../services/customerService";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Order History" },
  { id: "addresses", label: "Addresses" },
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
      const res = await customerService.get(id);
      setCustomer(res.data?.data || null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load customer");
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
            onClick={() => navigate("/vendor/customers")}
            className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{customer.email}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/vendor/customers")}
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-800 mt-1">{customer.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="font-medium text-gray-800 mt-1">{customer.orders_count}</p>
            </div>
            <div>
              <p className="text-gray-500">Lifetime Value</p>
              <p className="font-medium text-gray-800 mt-1">
                ₹{customer.lifetime_value?.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Last Order</p>
              <p className="font-medium text-gray-800 mt-1">{customer.last_order_at}</p>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-sm text-gray-500">
            Order history will link to orders when customer_id is available from the API.
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-3">
            {(customer.addresses || []).map((a, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-sm">
                <span className="text-xs uppercase text-gray-500">{a.type}</span>
                <p className="text-gray-800 mt-1">{a.line}</p>
                <p className="text-gray-500">{a.pincode}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-sm text-gray-700">
            {customer.notes || "No notes"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
