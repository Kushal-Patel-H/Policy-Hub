import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
