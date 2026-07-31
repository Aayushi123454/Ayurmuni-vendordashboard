import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }
    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password</h1>
        <p className="text-sm text-gray-500 mb-6">We&apos;ll send a reset link to your email</p>

        {sent ? (
          <div className="text-center py-2">
            <p className="text-gray-600 mb-6 text-sm">Check your inbox for password reset instructions.</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full px-4 py-2.5 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/20 focus:border-[#0D614E]"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-[#0D614E] hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
