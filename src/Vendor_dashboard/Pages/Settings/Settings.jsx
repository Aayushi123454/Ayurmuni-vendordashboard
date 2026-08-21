import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../../services/api";

const TABS = [
  { id: "store", label: "Store" },
  // { id: "business", label: "Business" },
  // { id: "notifications", label: "Notifications" },
  // { id: "security", label: "Security" },
];

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("store");
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm: "",
  });
  const [notifPrefs, setNotifPrefs] = useState({
    orders: true,
    products: true,
    finance: true,
    marketing: false,
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/change-password/", {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      toast.success("Password updated");
      setPasswordForm({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage store preferences, notifications, and security
          </p>
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

        {activeTab === "store" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-lg space-y-4">
            <p className="text-sm text-gray-500">Store settings are managed in your profile.</p>
            <button
              type="button"
              onClick={() => navigate("/vendor/profile")}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              Edit Store Profile
            </button>
          </div>
        )}

        {activeTab === "business" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-lg text-sm text-gray-600">
            Business and tax settings are configured during onboarding and via Unicommerce tax classes in Catalog.
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-lg space-y-4">
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Notification preferences are not persisted yet (backend API required).
            </div>
            {Object.entries(notifPrefs).map(([key, val]) => (
              <label key={key} className="flex items-center justify-between capitalize text-sm">
                <span>{key} notifications</span>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, [key]: e.target.checked })}
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => toast.success("Preferences saved locally")}
              className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm"
            >
              Save Preferences
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <form
            onSubmit={handlePasswordChange}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-lg space-y-4"
          >
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
