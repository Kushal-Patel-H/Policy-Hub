import { useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  if (!open) return null; // ✅ keep connection logic

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success(`Welcome back, ${user.email}`);
      setLoading(false);
      onClose();
      navigate("/dashboard"); // ✅ redirect to dashboard
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email address");
      } else {
        toast.error(error.message || "Failed to send password reset email");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[92%] max-w-md rounded-2xl bg-[#133B8A] p-8 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Sign In</h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={showForgotPassword ? handleForgotPassword : handleLogin} className="space-y-4">
          {/* Email */}
          <div className="flex items-center bg-[#1f4ba5] rounded-full px-4 py-2">
            <FaEnvelope className="mr-3 text-gray-300" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-[#1f4ba5] rounded-full px-4 py-2">
            <FaLock className="mr-3 text-gray-300" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              placeholder="Password"
              type="password"
              required={!showForgotPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={showForgotPassword}
            />
          </div>

          {/* Forgot Password Link */}
          {!showForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-white/80 hover:text-white underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          {showForgotPassword ? (
            <>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-white text-[#0A2A67] font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
              >
                {resetLoading ? "Sending..." : "Send Reset Email"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setPassword("");
                }}
                className="w-full bg-gray-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition mt-2"
              >
                Back to Login
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0A2A67] font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          )}
        </form>

        {/* Footer link */}
        <p className="text-center text-gray-300 mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister?.();
            }}
            className="text-white font-semibold underline hover:text-gray-200"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
