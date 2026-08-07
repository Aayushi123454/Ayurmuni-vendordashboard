import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const Withdrawals = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val < 100) {
      toast.error("Minimum withdrawal is ₹100");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Withdrawal request submitted (pending backend API)");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Withdrawals</h1>
            <p className="text-sm text-gray-500 mt-0.5">Request payout to your bank account</p>
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
        <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          Withdrawal API is not available yet. This form is a UI placeholder.
        </div>

        <form
          onSubmit={handleWithdraw}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-md space-y-4"
        >
          <input
            type="number"
            placeholder="Withdrawal amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-[#0D614E] text-white rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Request Withdrawal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Withdrawals;
