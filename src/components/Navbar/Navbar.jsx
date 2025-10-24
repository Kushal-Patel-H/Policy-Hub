import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/Logo.png";
import { useAuthContext } from "../../context/AuthContext";


const NAV_BG = "#0A2A67";

export default function AppNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuthContext();
  // click-outside for profile dropdown
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // link styles
  const linkCls = (to) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === to
        ? "text-white" // active link
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  const handleLogout = async () => {
  setOpen(false);
  await logout(); // ✅ from AuthContext
  navigate("/"); // ✅ redirect to Welcome page
};


  return (
    <header
      className="sticky top-0 z-40 w-full shadow-sm"
      style={{ backgroundColor: NAV_BG }}
    >
      <nav className="w-full h-14 flex items-center justify-between px-6">
        {/* logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="PolicyHub Logo"
            className="h-9 w-auto rounded-full"
          />
        </div>

        {/* right: links + profile */}
        <div className="flex items-center gap-10">
          {/* links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className={linkCls("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/policies" className={linkCls("/policies")}>
              Policies
            </Link>
            <Link to="/add-policy" className={linkCls("/add-policy")}>
              Add Policy
            </Link>
            <Link to="/alerts" className={linkCls("/alerts")}>
              Alerts
            </Link>
            <Link to="/reminders" className={linkCls("/reminders")}>
              Reminders
            </Link>
          </div>

          {/* profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/95 text-[#0A2A67] font-semibold shadow-sm hover:bg-white"
              aria-label="Open profile menu"
              title="Profile"
            >
              {/* simple avatar circle – replace with user image if needed */}
              <span className="select-none">👤</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
