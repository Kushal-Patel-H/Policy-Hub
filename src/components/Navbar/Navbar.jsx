import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-indigo-700 text-white">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-lg">PolicyHub</Link>
        <div className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/policies">Policies</Link>
          <Link to="/add-policy">Add Policy</Link>
          <Link to="/alerts">Alerts</Link>
          <Link to="/reminders">Reminders</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </header>
  );
}
