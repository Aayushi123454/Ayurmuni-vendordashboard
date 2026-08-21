import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} className="text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized</h1>
        <p className="text-sm text-gray-500 mb-8">
          Your account does not have the required permissions. Contact support if you believe this is an
          error.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => navigate(role === "doctor" ? "/doctor/dashboard" : "/vendor/dashboard")}
            className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
