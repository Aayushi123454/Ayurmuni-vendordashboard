import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";
import { formatCurrency } from "../Order/orderHelpers";

const Wallet = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 15;

  const fetchWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await vendorService.getWalletTransactions({ page, page_size: pageSize });
      const data = res.data?.data || {};
      setTransactions(data.results || []);
      setCount(data.count || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load wallet transactions");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Wallet Transactions</h1>
            <p className="text-sm text-gray-500 mt-0.5">Wallet credit and debit history</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/vendor/finance")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to Finance
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-600">No wallet transactions</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3.5 text-sm text-gray-700">{tx.id || tx.transaction_id || "—"}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{tx.type || tx.transaction_type || "—"}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-800 font-medium">
                          {formatCurrency(tx.amount || tx.value || 0)}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{tx.status || "completed"}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">
                          {tx.created_at ? new Date(tx.created_at).toLocaleDateString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 bg-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 bg-white"
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

export default Wallet;
