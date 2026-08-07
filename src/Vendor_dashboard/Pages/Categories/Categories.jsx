import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";

const TABS = [
  { id: "categories", label: "Categories" },
  { id: "subcategories", label: "Subcategories" },
];

export default function Categories() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("categories");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await vendorService.getFieldInfo("product-category");
      setCategories(response.data?.data || []);
    } catch {
      /* optional filter source */
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        activeTab === "categories"
          ? await vendorService.getFieldInfo("product-category")
          : await vendorService.getFieldInfo("product-subcategory", {
              product_category_id: selectedCategory || undefined,
            });

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
      toast.error(err?.response?.data?.message || err.message || "Failed to load categories");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse product categories and subcategories (read-only lookup)
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
              placeholder="Search by name or code..."
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
          {activeTab === "subcategories" && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name || c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No categories found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                  {activeTab === "subcategories" && (
                    <>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">HSN</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Tax Class
                      </th>
                    </>
                  )}
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id || item.code} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm text-gray-800">{item.name || item.title || "—"}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{item.code || "—"}</td>
                    {activeTab === "subcategories" && (
                      <>
                        <td className="px-5 py-3 text-sm text-gray-600">{item.hsn_code || item.hsn || "—"}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{item.tax_class || item.tax || "—"}</td>
                      </>
                    )}
                    <td className="px-5 py-3 text-sm capitalize">
                      {item.is_active === false ? "inactive" : "active"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        className="text-sm text-[#0D614E] hover:underline"
                        onClick={() =>
                          navigate(
                            `/vendor/products?${
                              activeTab === "subcategories" ? "subcategory" : "category"
                            }=${item.id}`
                          )
                        }
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
