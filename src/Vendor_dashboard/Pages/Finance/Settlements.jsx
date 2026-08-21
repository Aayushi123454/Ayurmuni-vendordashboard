import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MOCK_SETTLEMENTS = [
  { id: 1, period: "Jul 1–15, 2026", amount: 45200, status: "completed", paid_at: "2026-07-18" },
  { id: 2, period: "Jul 16–31, 2026", amount: 38900, status: "pending", paid_at: null },
  { id: 3, period: "Aug 1–15, 2026", amount: 52100, status: "scheduled", paid_at: null },
];

const Settlements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settlements</h1>
            <p className="text-sm text-gray-500 mt-0.5">Settlement history for your store payouts</p>
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
          Settlement tracking is not configured yet. Bank details in your profile will be used when payouts go live.
        </div>

        <div className="space-y-3">
          {MOCK_SETTLEMENTS.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-gray-800">{s.period}</p>
                <p className="text-sm text-gray-500">₹{s.amount.toLocaleString("en-IN")}</p>
              </div>
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  s.status === "completed"
                    ? "bg-emerald-50 text-emerald-700"
                    : s.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-blue-50 text-blue-700"
                }`}
              >
                {s.status}
              </span>
              {s.paid_at && <span className="text-xs text-gray-500">Paid {s.paid_at}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settlements;
