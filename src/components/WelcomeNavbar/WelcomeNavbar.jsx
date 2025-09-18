import { useState } from "react";
import LoginModal from "../Modal/LoginModal";
import RegisterModal from "../Modal/RegisterModal";
import logo from "../../assets/Logo.png";

export default function WelcomeNavbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2A67]/100 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="PolicyHub Logo" className="h-9 w-auto rounded-full" />
          </div>

          {/* right side buttons */}
          <div className="flex items-center gap-3">
            {/* About Us button with scrollBy */}
            <button
              onClick={() => window.scrollBy({ top: 600, behavior: "smooth" })}
              className="rounded-full text-[#ffffff] px-5 py-2 font-semibold hover:bg-white/10"
            >
              About Us
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full bg-white text-[#0A2A67] px-5 py-2 font-semibold shadow hover:shadow-md transition"
            >
              Login
            </button>

            <button
              onClick={() => setShowRegister(true)}
              className="rounded-full bg-white text-[#0A2A67] px-5 py-2 font-semibold shadow hover:shadow-md transition"
            >
              Register
            </button>
          </div>
        </nav>
      </header>

      {/* Modals */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} />
    </>
  );
}
