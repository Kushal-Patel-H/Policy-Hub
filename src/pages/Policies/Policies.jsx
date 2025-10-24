import React, { useState } from "react";
import { FaSearch, FaThLarge, FaList } from "react-icons/fa";

export default function Policies() {
  const [view, setView] = useState("grid"); // grid or list

  // Dummy data for now (replace with Firebase later)
  const policies = [
    {
      id: "LI-001-2024",
      customer: "John Smith",
      type: "Life Insurance",
      from: "Jan 1, 2024",
      to: "Dec 31, 2024",
      premium: "$2,500",
      email: "john@example.com",
      status: "Active",
      created: "Jan 1, 2024",
      documents: 1,
    },
    {
      id: "LI-002-2024",
      customer: "Jane Doe",
      type: "Health Insurance",
      from: "Feb 1, 2024",
      to: "Jan 31, 2025",
      premium: "$1,800",
      email: "jane@example.com",
      status: "Expired",
      created: "Feb 1, 2024",
      documents: 2,
    },
  ];

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
        Track and manage upcoming policy expiries and renewals here
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded-md px-1 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by customer name or policy number..."
            className="flex-1 outline-none"
          />
        </div>

        {/* Dropdowns */}
        <select className="border rounded-md px-3 py-2 w-full md:w-40">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Expired</option>
        </select>
        <select className="border rounded-md px-3 py-2 w-full md:w-40">
          <option>All Types</option>
          <option>Life Insurance</option>
          <option>Health Insurance</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setView("grid")}
            className={`bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-md text-sm ${
              view === "grid" ? "bg-blue-900 text-white" : ""
            }`}
          >
             Grid View
          </button>
          <button
            onClick={() => setView("list")}
            className={`bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-md text-sm ${
              view === "list" ? "bg-blue-900 text-white" : ""
            }`}
          >
           List View
          </button>
        </div>
      </div>

      {/* Policies Display */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md border rounded-lg p-4 relative"
            >
              {/* Status */}
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded ${
                  p.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {p.status}
              </span>

              <h2 className="font-semibold text-lg">{p.customer}</h2>
              <p className="text-sm text-gray-600">{p.id}</p>

              <div className="mt-3 space-y-1 text-sm">
                <p>{p.type}</p>
                <p>
                  {p.from} - {p.to}
                </p>
                <p>{p.premium}</p>
                <p>{p.email}</p>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Created: {p.created} | {p.documents} document(s)
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{p.customer}</h2>
                <p className="text-sm text-gray-600">{p.id}</p>
                <p className="text-sm">{p.type}</p>
                <p className="text-sm">
                  {p.from} - {p.to}
                </p>
                <p className="text-sm">{p.premium}</p>
                <p className="text-sm">{p.email}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {p.created} | {p.documents} document(s)
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  p.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
