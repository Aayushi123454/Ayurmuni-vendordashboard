import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  RefreshCw,
  BarChart3,
  Package,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";
import { parseFinanceMetricsResponse } from "../Finance/financeHelpers";
import { exportToCsv } from "../../utils/exportHelpers";

const COLORS = ["#0D614E", "#10B981", "#8B5CF6", "#F59E0B", "#F43F5E", "#3B82F6"];

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [financeRes, productsRes, ordersRes] = await Promise.all([
        vendorService.getFinanceMetrics({ details_limit: 20 }),
        vendorService.getProducts({ page: 1, page_size: 100 }),
        vendorService.getOrders({ page: 1, page_size: 100 }).catch(() => null),
      ]);
      setMetrics(parseFinanceMetricsResponse(financeRes));
      setProducts(productsRes.data?.data?.results || []);
      setOrders(ordersRes?.data?.data?.results || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const revenueData = useMemo(
    () =>
      (metrics?.monthly_revenue || []).map((m) => ({
        month: m.label || m.month,
        revenue: m.value || m.revenue || 0,
      })),
    [metrics]
  );

  const topProducts = useMemo(
    () =>
      products.slice(0, 8).map((p) => ({
        name: (p.name || "Product").slice(0, 12),
        count: p.variants?.length || 1,
      })),
    [products]
  );

  const categoryData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const key = p.product_subcategory_name || "Other";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.slice(0, 14),
      value,
    }));
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
          <p className="text-gray-500 mt-4 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Analytics</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Revenue, orders, and product performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() =>
                exportToCsv("analytics-revenue.csv", revenueData, [
                  { key: "month", label: "Month" },
                  { key: "revenue", label: "Revenue" },
                ])
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] rounded-xl p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100">Revenue</p>
                <p className="text-2xl font-bold mt-1">
                  ₹{Number(metrics?.total_revenue?.value || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <IndianRupee size={28} className="opacity-80" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <ShoppingCart size={24} className="text-[#0D614E]" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
              </div>
              <Package size={24} className="text-[#0D614E]" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categoryData.length}</p>
              </div>
              <BarChart3 size={24} className="text-[#0D614E]" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0D614E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Top Products</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0D614E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
