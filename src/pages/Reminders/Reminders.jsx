import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getReminders } from "../../api/policyApi";
import toast from "react-hot-toast";
import criticalIcon from "../../assets/alerts4.jpg";   // Critical
import moderateIcon from "../../assets/alerts3.jpg";   // Moderate
import upcomingIcon from "../../assets/reminder1.jpg"; // Upcoming
import totalIcon from "../../assets/reminder2.jpg";    // Total Requiring Action
import redAlertIcon from "../../assets/alerts4.jpg";   // Red alert
import filterIcon from "../../assets/alerts5.jpg";     // Filter icon image

export default function Reminders() {
  const { user } = useAuthContext();
  const [view, setView] = useState("list"); // default: list
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  // Fetch reminders from Firestore
  useEffect(() => {
    const fetchReminders = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getReminders(user.uid);
        if (response && response.success) {
          setReminders(response.reminders || []);
        } else {
          console.warn("Unexpected response format:", response);
          toast.error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
        const errorMessage = error.response?.data?.error || 
                           error.message || 
                           "Failed to load reminders. Make sure the backend server is running.";
        toast.error(errorMessage);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
    // Refresh every minute to update days left
    const interval = setInterval(fetchReminders, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Calculate summary counts
  const criticalCount = reminders.filter((r) => r.priority === "Critical").length;
  const moderateCount = reminders.filter((r) => r.priority === "Moderate").length;
  const upcomingCount = reminders.filter((r) => r.priority === "Upcoming").length;
  const totalCount = reminders.length;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // Format status text
  const formatStatus = (reminder) => {
    const days = reminder.daysUntilExpiry;
    if (days <= 7) {
      return `CRITICAL - ${days} day${days !== 1 ? "s" : ""} left`;
    } else if (days <= 30) {
      return `MODERATE - ${days} day${days !== 1 ? "s" : ""} left`;
    } else {
      return `UPCOMING - ${days} day${days !== 1 ? "s" : ""} left`;
    }
  };

  // Filter reminders by priority
  const filteredReminders = reminders.filter((reminder) => {
    if (priorityFilter === "All Priorities") return true;
    return reminder.priority === priorityFilter;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading reminders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Heading */}
      <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
        Track and manage upcoming policy expiries and renewals here
      </h2>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Critical */}
        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-0.5 bg-[#0A2A67]" />

          <div className="flex items-center justify-between w-full">
            <img src={criticalIcon} alt="Critical" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{criticalCount}</p>
          </div>
          <p className="text-gray-700 font-medium mt-1 text-sm">Critical (≤ 7 days)</p>
          <button className="mt-2 bg-red-200 text-red-700 px-5 py-1 rounded-full font-medium text-xs">
            Send Reminder
          </button>
        </div>

        {/* Moderate */}
        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-0.5 bg-[#0A2A67]" />

          <div className="flex items-center justify-between w-full">
            <img src={moderateIcon} alt="Moderate" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{moderateCount}</p>
          </div>
          <p className="text-gray-700 font-medium mt-1 text-sm">Moderate (8–30 days)</p>
          <button className="mt-2 bg-yellow-200 text-yellow-700 px-5 py-1 rounded-full font-medium text-xs">
            Send Reminder
          </button>
        </div>

        {/* Upcoming */}
        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-0.5 bg-[#0A2A67]" />

          <div className="flex items-center justify-between w-full">
            <img src={upcomingIcon} alt="Upcoming" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{upcomingCount}</p>
          </div>
          <p className="text-gray-700 font-medium mt-1 text-sm">Upcoming (31–90 days)</p>
          <button className="mt-2 bg-blue-200 text-blue-700 px-5 py-1 rounded-full font-medium text-xs">
            Send Reminder
          </button>
        </div>

        {/* Total */}
        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-0.5 bg-[#0A2A67]" />

          <div className="flex items-center justify-between w-full">
            <img src={totalIcon} alt="Total" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{totalCount}</p>
          </div>
          <p className="text-gray-700 font-medium mt-1 text-sm">Total Requiring Action</p>
          <button className="mt-2 bg-purple-200 text-purple-800 px-5 py-1 rounded-full font-medium text-xs">
            Send Reminder
          </button>
        </div>
      </div>




      {/* Filters & Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-3 rounded-lg shadow">
        {/* Left side - Filters */}
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <img src={filterIcon} alt="Filter" className="w-6 h-6" />
          <span className="font-semibold text-gray-800">Filters:</span>

          {/* Dropdown */}
          <div className="relative">
            <select
              className="border rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2A67]"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All Priorities</option>
              <option>Critical</option>
              <option>Moderate</option>
              <option>Upcoming</option>
            </select>
          </div>
        </div>

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

      {/* Policy Reminders - Conditional Rendering */}
      {filteredReminders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No reminders found</p>
          {reminders.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              No policies approaching expiry within the reminder period
            </p>
          )}
        </div>
      ) : view === "list" ? (
        <div className="space-y-4">
          {filteredReminders.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border"
            >
              <div className="flex items-center space-x-3">
                <img src={redAlertIcon} alt="Priority" className="w-6 h-6" />
                <div>
                  <p
                    className={`font-semibold ${
                      item.priority === "Critical"
                        ? "text-red-600"
                        : item.priority === "Moderate"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {formatStatus(item)}
                  </p>
                  <p className="font-medium text-gray-900">{item.customerName}</p>
                  <p className="text-sm text-gray-600">{item.customerEmail}</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-3 sm:mt-0 sm:flex sm:items-center sm:space-x-6">
                <p>
                  <span className="font-medium">Policy No:</span> {item.policyNumber}
                </p>
                <p>
                  <span className="font-medium">Expiry:</span> {item.expiryDateFormatted}
                </p>
                <p>
                  <span className="font-medium">Premium:</span>{" "}
                  {formatCurrency(item.premiumAmount)}
                </p>
                <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">
                  Send Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReminders.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg p-4 border flex flex-col space-y-2"
            >
              <div className="flex items-center gap-2">
                <img src={redAlertIcon} alt="Priority" className="w-6 h-6" />
                <p
                  className={`font-semibold ${
                    item.priority === "Critical"
                      ? "text-red-600"
                      : item.priority === "Moderate"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {formatStatus(item)}
                </p>
              </div>
              <p className="font-medium text-gray-900">{item.customerName}</p>
              <p className="text-sm text-gray-600">{item.customerEmail}</p>
              <p>
                <span className="font-medium">Policy No:</span> {item.policyNumber}
              </p>
              <p>
                <span className="font-medium">Expiry:</span> {item.expiryDateFormatted}
              </p>
              <p>
                <span className="font-medium">Premium:</span>{" "}
                {formatCurrency(item.premiumAmount)}
              </p>
              <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">
                Send Reminder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
