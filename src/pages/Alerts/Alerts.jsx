import alertIcon from "../../assets/alerts1.jpg";   // Total Alerts
import successIcon from "../../assets/alerts2.jpg"; // Successfully Sent
import pendingIcon from "../../assets/alerts3.jpg"; // Pending
import failedIcon from "../../assets/alerts4.jpg";  // Failed
import filterIcon from "../../assets/alerts5.jpg";  // Filters

function Alerts() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page description */}
      <p className="text-center text-lg md:text-xl text-gray-700 font-medium">
        Monitor and manage email alerts sent to customers for policy renewals and expiries here
      </p>

    {/* Summary Cards */}
<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {[
    { icon: alertIcon, label: "Total Alerts" },
    { icon: successIcon, label: "Successfully Sent" },
    { icon: pendingIcon, label: "Pending" },
    { icon: failedIcon, label: "Failed" },
  ].map((item, i) => (
    <div
      key={i}
      className="relative flex flex-col bg-white shadow rounded-lg p-4 border overflow-hidden min-h-[120px]"
    >
      {/* left accent */}
      <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />

      {/* top row: icon + value */}
      <div className="flex items-center justify-between w-full">
        <img src={item.icon} alt={item.label} className="w-10 h-10" />
        <p className="text-xl font-bold text-gray-900">N</p>
      </div>

      {/* label */}
      <p className="mt-2 text-gray-700 font-medium text-sm">{item.label}</p>
    </div>
  ))}
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
            <select className="border rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2A67]">
              <option>All Statuses</option>
              <option>Sent</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            <select className="border rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2A67]">
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

        <div className="divide-y min-w-[600px]">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 text-sm gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">● Sent</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">Expiry Alert</span>
              </div>
              <div className="text-gray-800 font-semibold">Emily Davis</div>
              <div className="text-xs text-gray-500">Customer</div>
            </div>
            <div className="flex-1">
              <div className="text-gray-800">HO-004-2023</div>
              <div className="text-xs text-gray-500">Policy Number</div>
            </div>
            <div className="flex-1 text-gray-600 text-xs">
              Mar 15, 2024, 05:30 AM
              <div className="text-gray-400">Sent Date</div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 text-sm gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">● Sent</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Renewal Alert</span>
              </div>
              <div className="text-gray-800 font-semibold">John Smith</div>
              <div className="text-xs text-gray-500">Customer</div>
            </div>
            <div className="flex-1">
              <div className="text-gray-800">LI-001-2024</div>
              <div className="text-xs text-gray-500">Policy Number</div>
            </div>
            <div className="flex-1 text-gray-600 text-xs">
              Nov 15, 2024, 05:30 AM
              <div className="text-gray-400">Sent Date</div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 text-sm gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-medium">● Pending</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Renewal Alert</span>
              </div>
              <div className="text-gray-800 font-semibold">Sarah Johnson</div>
              <div className="text-xs text-gray-500">Customer</div>
            </div>
            <div className="flex-1">
              <div className="text-gray-800">AI-002-2024</div>
              <div className="text-xs text-gray-500">Policy Number</div>
            </div>
            <div className="flex-1 text-gray-600 text-xs">
              N/A
              <div className="text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alerts;
