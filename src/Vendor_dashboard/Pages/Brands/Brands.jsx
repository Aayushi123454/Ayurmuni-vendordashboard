import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";

export default function Brands() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vendorService.getFieldInfo("brand-name");
      let data = response.data?.data || [];
      if (search) {
        const term = search.toLowerCase();
        data = data.filter(
          (item) =>
            (item.name || item.title || "").toLowerCase().includes(term) ||
            (item.code || "").toLowerCase().includes(term)
        );
      }
      setItems(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to load brands");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse brands available for your products (read-only lookup)
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
              placeholder="Search brands..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0D614E]/20 focus:border-[#0D614E]"
            />
          </div>
          <button
            type="button"
            onClick={() => setSearch(searchInput)}
            className="px-4 py-2.5 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No brands found. Try adjusting your search.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Brand Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id || item.code} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm text-gray-800">{item.name || item.title || "—"}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{item.code || "—"}</td>
                    <td className="px-5 py-3 text-sm capitalize">
                      {item.is_active === false ? "inactive" : "active"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        className="text-sm text-[#0D614E] hover:underline"
                        onClick={() => navigate(`/vendor/products?brand=${item.id}`)}
                      >
                        View products
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
