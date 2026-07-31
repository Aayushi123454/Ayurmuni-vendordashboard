import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { customerService } from "../../../services/customerService";
import {
  customerStatusClassName,
  formatCustomerStatusLabel,
  parseCustomersListResponse,
} from "./customerHelpers";

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await customerService.list({
        page,
        page_size: pageSize,
        search: search || undefined,
      });
      const parsed = parseCustomersListResponse(response);
      setCustomers(parsed.results);
      setCount(parsed.count);
    } catch {
      setCustomers([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Customers who ordered your products
            </p>
          </div>
          <button
            type="button"
            onClick={fetchCustomers}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearch(searchInput.trim());
            }}
          >
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/30"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
            >
              Search
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No customers found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {search
                ? "Try a different search term."
                : "Customers will appear here once orders are placed."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Lifetime Value</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => navigate(`/vendor/customers/${c.id}`)}
                        className="hover:bg-[#0D614E]/[0.03] cursor-pointer transition"
                      >
                        <td className="px-5 py-3.5 text-sm font-medium text-gray-800">
                          {c.name || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{c.email || "—"}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{c.orders_count ?? 0}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">
                          ₹{(c.lifetime_value ?? 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customerStatusClassName(c.status)}`}
                          >
                            {formatCustomerStatusLabel(c.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Page {page} of {totalPages} · {count} customer{count === 1 ? "" : "s"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white bg-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white bg-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;
