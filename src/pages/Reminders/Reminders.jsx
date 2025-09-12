import criticalIcon from "../../assets/alerts4.jpg";   // Critical
import moderateIcon from "../../assets/alerts3.jpg";   // Moderate
import upcomingIcon from "../../assets/reminder1.jpg";   // Upcoming
import totalIcon from "../../assets/reminder2.jpg";      // Total Requiring Action
import redAlertIcon from "../../assets/alerts4.jpg";   // Red alert
import filterIcon from "../../assets/alerts5.jpg";  // your filter icon image

export default function Reminders() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Heading */}
      <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
        Track and manage upcoming policy expiries and renewals here
      </h2>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Critical */}
        <div className="flex flex-col items-center bg-white shadow rounded-lg p-4 border">
          <img src={criticalIcon} alt="Critical" className="w-12 h-12 mb-2" />
          <p className="text-gray-700 font-semibold">Critical (≤ 7 days)</p>
          <p className="text-2xl font-bold text-gray-900">N</p>
          <button className="mt-2 bg-red-200 text-red-700 px-6 py-1 rounded-full font-semibold text-sm">
            Send Reminder
          </button>
        </div>

        {/* Moderate */}
        <div className="flex flex-col items-center bg-white shadow rounded-lg p-4 border">
          <img src={moderateIcon} alt="Moderate" className="w-12 h-12 mb-2" />
          <p className="text-gray-700 font-semibold">Moderate (8–30 days)</p>
          <p className="text-2xl font-bold text-gray-900">N</p>
          <button className="mt-2 bg-yellow-200 text-yellow-700 px-6 py-1 rounded-full font-semibold text-sm">

            Send Reminder
          </button>
        </div>

        {/* Upcoming */}
        <div className="flex flex-col items-center bg-white shadow rounded-lg p-4 border">
          <img src={upcomingIcon} alt="Upcoming" className="w-12 h-12 mb-2" />
          <p className="text-gray-700 font-semibold">Upcoming (31–90 days)</p>
          <p className="text-2xl font-bold text-gray-900">N</p>
          <button className="mt-2 bg-blue-200 text-blue-700 px-6 py-1 rounded-full font-semibold text-sm">
            Send Reminder
          </button>
        </div>

        {/* Total */}
        <div className="flex flex-col items-center bg-white shadow rounded-lg p-4 border">
          <img src={totalIcon} alt="Total" className="w-12 h-12 mb-2" />
          <p className="text-gray-700 font-semibold">Total Requiring Action</p>
          <p className="text-2xl font-bold text-gray-900">N</p>
          <button className="mt-2 bg-purple-200 text-purple-700 px-6 py-1 rounded-full font-semibold text-sm">
            Send Reminder
          </button>
        </div>
      </div>

      {/* Filters & Buttons */}
      {/* Filters & Buttons Row */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-3 rounded-lg shadow">
  {/* Left side - Filters */}
  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
    {/* Filter icon */}
    <img src={filterIcon} alt="Filter" className="w-6 h-6" />
    <span className="font-semibold text-gray-800">Filters:</span>

    {/* Dropdown */}
    <div className="relative">
  <select
    className="appearance-none border-2 border-gray-400 rounded-md px-4 pr-8 py-1 shadow-sm focus:outline-none"
  >
    <option>All Priorities</option>
    <option>Critical</option>
    <option>Moderate</option>
    <option>Upcoming</option>
  </select>

  {/* Custom arrow */}
  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
    ▼
  </span>
</div>
  </div>

  {/* Right side - View buttons */}
  <div className="flex space-x-3">
    <button className="bg-blue-100 text-blue-800 font-semibold px-4 py-1 rounded-full text-sm">
      Grid View
    </button>
    <button className="bg-blue-100 text-blue-800 font-semibold px-4 py-1 rounded-full text-sm">
      List View
    </button>
  </div>
</div>


      {/* Policy Reminders List */}
      <div className="space-y-4">
        {/* Single Reminder Item */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border">
          <div className="flex items-center space-x-3">
            <img src={redAlertIcon} alt="Critical" className="w-6 h-6" />
            <div>
              <p className="text-red-600 font-semibold">CRITICAL -226 days left</p>
              <p className="font-medium text-gray-900">John Smith</p>
              <p className="text-sm text-gray-600">john@example.com</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-3 sm:mt-0 sm:flex sm:items-center sm:space-x-6">
            <p><span className="font-medium">Policy No:</span> LI-001-2024</p>
            <p><span className="font-medium">Expiry:</span> Dec 31, 2024</p>
            <p><span className="font-medium">Premium:</span> $2,500</p>
            <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
              Send Reminder
            </button>
          </div>
        </div>

        {/* Second Item */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border">
          <div className="flex items-center space-x-3">
            <img src={redAlertIcon} alt="Critical" className="w-6 h-6" />
            <div>
              <p className="text-red-600 font-semibold">CRITICAL -195 days left</p>
              <p className="font-medium text-gray-900">Sarah Johnson</p>
              <p className="text-sm text-gray-600">sarah@example.com</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-3 sm:mt-0 sm:flex sm:items-center sm:space-x-6">
            <p><span className="font-medium">Policy No:</span> AI-002-2024</p>
            <p><span className="font-medium">Expiry:</span> Jan 31, 2025</p>
            <p><span className="font-medium">Premium:</span> $1,800</p>
            <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
              Send Reminder
            </button>
          </div>
        </div>

        {/* Third Item */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border">
          <div className="flex items-center space-x-3">
            <img src={redAlertIcon} alt="Critical" className="w-6 h-6" />
            <div>
              <p className="text-red-600 font-semibold">CRITICAL -167 days left</p>
              <p className="font-medium text-gray-900">Michael Brown</p>
              <p className="text-sm text-gray-600">michael@example.com</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-3 sm:mt-0 sm:flex sm:items-center sm:space-x-6">
            <p><span className="font-medium">Policy No:</span> HI-003-2024</p>
            <p><span className="font-medium">Expiry:</span> Feb 28, 2025</p>
            <p><span className="font-medium">Premium:</span> $3,200</p>
            <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

