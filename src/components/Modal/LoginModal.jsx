import { useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        <form onSubmit={handleLogin} className="space-y-4">
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#0A2A67] font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
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
