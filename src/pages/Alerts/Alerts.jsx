import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getAlerts } from "../../api/policyApi";
import toast from "react-hot-toast";
import alertIcon from "../../assets/alerts1.jpg";   // Total Alerts
import successIcon from "../../assets/alerts2.jpg"; // Successfully Sent
import pendingIcon from "../../assets/alerts3.jpg"; // Pending
import failedIcon from "../../assets/alerts4.jpg";  // Failed
import filterIcon from "../../assets/alerts5.jpg";  // Filters

function Alerts() {
  const { user } = useAuthContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");

  // Fetch alerts from Firestore
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAlerts(user.uid);
        if (response && response.success) {
          setAlerts(response.alerts || []);
        } else {
          console.warn("Unexpected response format:", response);
          toast.error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
        const errorMessage = error.response?.data?.error || 
                           error.message || 
                           "Failed to load alerts. Make sure the backend server is running.";
        toast.error(errorMessage);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user]);

  // Calculate summary counts
  const totalCount = alerts.length;
  const sentCount = alerts.filter((a) => a.status === "Sent").length;
  const pendingCount = alerts.filter((a) => a.status === "Pending").length;
  const failedCount = alerts.filter((a) => a.status === "Failed").length;

  // Format timestamp
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
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus =
      statusFilter === "All Statuses" || alert.status === statusFilter;

    const matchesType =
      typeFilter === "All Types" || alert.alertType === typeFilter;

    return matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading alerts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page description */}
      <p className="text-center text-lg md:text-xl text-gray-700 font-medium">
        Monitor and  alerts of customers for policy renewals and expiries here.
      </p>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden min-h-[120px]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
          <div className="flex items-center justify-between w-full">
            <img src={alertIcon} alt="Total Alerts" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{totalCount}</p>
          </div>
          <p className="mt-2 text-gray-700 font-medium text-sm">Total Alerts</p>
        </div>

        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden min-h-[120px]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
          <div className="flex items-center justify-between w-full">
            <img src={successIcon} alt="Successfully Sent" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{sentCount}</p>
          </div>
          <p className="mt-2 text-gray-700 font-medium text-sm">Successfully Sent</p>
        </div>

        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden min-h-[120px]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
          <div className="flex items-center justify-between w-full">
            <img src={pendingIcon} alt="Pending" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          <p className="mt-2 text-gray-700 font-medium text-sm">Pending</p>
        </div>

        <div className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden min-h-[120px]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
          <div className="flex items-center justify-between w-full">
            <img src={failedIcon} alt="Failed" className="w-10 h-10" />
            <p className="text-xl font-bold text-gray-900">{failedCount}</p>
          </div>
          <p className="mt-2 text-gray-700 font-medium text-sm">Failed</p>
        </div>
      </div>


      {/* Filters */}
      <div className="mt-8 bg-white shadow rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Filters label */}
          <div className="flex items-center gap-2">
            <img src={filterIcon} alt="Filter Icon" className="h-5 w-5" />
            <span className="text-gray-700 font-semibold">Filters:</span>
          </div>

          {/* Right: Dropdowns */}
          <div className="flex gap-4">
            <select
              className="border rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2A67]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Sent</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            <select
              className="border rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2A67]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>Expiry Alert</option>
              <option>Renewal Alert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert History */}
      <div className="mt-6 bg-white shadow rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl font-semibold text-gray-800">
          Alert History
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-gray-500 text-lg">No alerts found</p>
            {alerts.length === 0 && (
              <p className="text-gray-400 text-sm mt-2">
                No alerts have been sent yet
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y min-w-[600px]">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center px-4 py-3 text-sm gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        alert.status === "Sent"
                          ? "text-green-600"
                          : alert.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-600"
                      }`}
                    >
                      ● {alert.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        alert.alertType === "Renewal Alert"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {alert.alertType || "Alert"}
                    </span>
                  </div>
                  <div className="text-gray-800 font-semibold">
                    {alert.customerName || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Customer</div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-800">
                    {alert.policyId || alert.policyNumber || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Policy Number</div>
                </div>
                <div className="flex-1 text-gray-600 text-xs">
                  {alert.sentDate ? (
                    <>
                      {formatTimestamp(alert.sentDate)}
                      <div className="text-gray-400">Sent Date</div>
                    </>
                  ) : alert.daysUntilExpiry !== undefined ? (
                    <>
                      {alert.daysUntilExpiry < 0
                        ? `${Math.abs(alert.daysUntilExpiry)} days expired`
                        : `${alert.daysUntilExpiry} days until expiry`}
                      <div className="text-gray-400">
                        {alert.status === "Pending" ? "Pending" : "Status"}
                      </div>
                    </>
                  ) : (
                    <>
                      {alert.status === "Pending" ? "Scheduled" : "N/A"}
                      <div className="text-gray-400">
                        {alert.status === "Pending" ? "Status" : "Sent Date"}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Alerts;
