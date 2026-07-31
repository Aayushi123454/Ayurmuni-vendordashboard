import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { couponService } from "../../../services/couponService";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order: 500,
    usage_limit: 100,
    expires_at: "",
  });

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await couponService.list({ search, status: statusFilter || undefined });
      setCoupons(res.data?.data?.results || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreate = async () => {
    if (!form.code.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    try {
      await couponService.create(form);
      toast.success("Coupon created");
      setShowModal(false);
      setForm({
        code: "",
        discount_type: "percentage",
        discount_value: 10,
        min_order: 500,
        usage_limit: 100,
        expires_at: "",
      });
      fetchCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await couponService.delete(id);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create and manage discount codes</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
          >
            <Plus size={16} />
            Create Coupon
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          Coupon APIs are not available yet. Showing mock data until backend is ready.
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search coupon code..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/30"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-[#0D614E] text-white rounded-lg text-sm">
              Search
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Tag size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No coupons</h3>
            <p className="text-sm text-gray-500 mt-1">Create your first coupon.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Discount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Usage</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Min Order</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{c.code}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        {c.usage_count}/{c.usage_limit}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">₹{c.min_order}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{c.expires_at}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            c.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Coupon</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
              <input
                type="number"
                placeholder="Discount value"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="Min order"
                value={form.min_order}
                onChange={(e) => setForm({ ...form, min_order: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
