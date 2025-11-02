import React, { useState, useEffect } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { getPolicies } from "../../api/policyApi";
import toast from "react-hot-toast";

export default function Policies() {
  const { user } = useAuthContext();
  const [view, setView] = useState("grid"); // grid or list
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");

  // Fetch policies from Firestore
  useEffect(() => {
    const fetchPolicies = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getPolicies(user.uid);
        if (response && response.success) {
          setPolicies(response.policies || []);
        } else {
          console.warn("Unexpected response format:", response);
          toast.error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
        const errorMessage = error.response?.data?.error || 
                           error.message || 
                           "Failed to load policies. Make sure the backend server is running.";
        toast.error(errorMessage);
        // Set empty array on error so UI doesn't break
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format timestamp helper
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      let date;
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp._seconds) {
        date = new Date(timestamp._seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // Filter policies
  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || policy.status === statusFilter;

    const matchesType =
      typeFilter === "All Types" || policy.policyType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle document view/download
  const handleViewDocument = (policy) => {
    const documents = policy.documents || [];
    if (documents.length > 0 && documents[0].url) {
      window.open(documents[0].url, "_blank");
    } else {
      toast.error("No document available for this policy");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading policies...</div>
        </div>
      </div>
    );
  }

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <select
          className="border rounded-md px-3 py-2 w-full md:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>Expired</option>
          <option>Lapsed</option>
          <option>Pending</option>
        </select>
        <select
          className="border rounded-md px-3 py-2 w-full md:w-40"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Life Insurance</option>
          <option>Health Insurance</option>
          <option>Motor Insurance</option>
          <option>Home Insurance</option>
          <option>Travel Insurance</option>
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
      {filteredPolicies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No policies found</p>
          {policies.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Create your first policy to get started
            </p>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white shadow-md border rounded-lg p-4 relative"
            >
              {/* Status */}
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded ${
                  policy.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : policy.status === "Expired"
                    ? "bg-red-100 text-red-600"
                    : policy.status === "Lapsed"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {policy.status}
              </span>

              <h2 className="font-semibold text-lg pr-20">
                {policy.customer?.name || "N/A"}
              </h2>
              <p className="text-sm text-gray-600">{policy.policyNumber}</p>

              <div className="mt-3 space-y-1 text-sm">
                <p>{policy.policyType}</p>
                <p>
                  {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                </p>
                <p>{formatCurrency(policy.premiumAmount)}</p>
                <p>{policy.customer?.email || "N/A"}</p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  Created: {formatTimestamp(policy.createdAt)} |{" "}
                  {policy.documents?.length || 0} document(s)
                </p>
                {policy.documents && policy.documents.length > 0 && (
                  <button
                    onClick={() => handleViewDocument(policy)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    title="View Document"
                  >
                    <FaEye /> View Doc
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white shadow-md border rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {policy.customer?.name || "N/A"}
                </h2>
                <p className="text-sm text-gray-600">{policy.policyNumber}</p>
                <p className="text-sm">{policy.policyType}</p>
                <p className="text-sm">
                  {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                </p>
                <p className="text-sm">{formatCurrency(policy.premiumAmount)}</p>
                <p className="text-sm">{policy.customer?.email || "N/A"}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {formatTimestamp(policy.createdAt)} |{" "}
                  {policy.documents?.length || 0} document(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                {policy.documents && policy.documents.length > 0 && (
                  <button
                    onClick={() => handleViewDocument(policy)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    title="View Document"
                  >
                    <FaEye /> View
                  </button>
                )}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    policy.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : policy.status === "Expired"
                      ? "bg-red-100 text-red-600"
                      : policy.status === "Lapsed"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {policy.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
