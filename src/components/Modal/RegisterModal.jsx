import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // ✅ added db import
import { doc, setDoc } from "firebase/firestore"; // ✅ import for Firestore
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function RegisterModal({ open, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  if (!open) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Store username + email in Firestore under users collection
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      });

      toast.success(`Welcome, ${username || "Agent"}!`);
      if (onRegisterSuccess) onRegisterSuccess(user);
      onClose();
    } catch (error) {
      toast.error(error.message || "Registration failed");
      console.error("Firebase Register Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[92%] max-w-md rounded-2xl bg-[#133B8A] p-8 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Register Account</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-center bg-[#1f4ba5] rounded-full px-4 py-2">
            <FaUser className="mr-3 text-gray-300" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              placeholder="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-white text-[#0A2A67] font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
          >
            Register
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-300 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin?.();
            }}
            className="text-white font-semibold underline hover:text-gray-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
