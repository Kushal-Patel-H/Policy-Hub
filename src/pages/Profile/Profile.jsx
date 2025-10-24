import { useState } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Agent Name",
    email: "Agent Email",
    phone: "Agent Phone Number",
    role: "Insurance Agent",
    memberSince: "Date",
    userId: "ID of user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // 🔗 Here you can connect Firestore update logic
    console.log("Updated Data:", formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <p className="text-gray-600 mt-1">
        Manage your account information and security settings.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full border-4 border-[#0A2A67] flex items-center justify-center text-4xl text-[#0A2A67] font-bold">
              👤
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {formData.fullName}
            </h2>
            <p className="text-gray-500 text-sm">
              {formData.role} <br />
              Member since {formData.memberSince}
            </p>
            <button className="mt-4 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium shadow">
              Change Photo
            </button>
          </div>

          {/* Account Stats */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Account Stats
            </h3>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Total Policies</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span>Active Clients</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="text-green-600 font-semibold">+5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-[#0A2A67] font-semibold "
                >
                  ✏️ Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="text-sm text-green-600 font-semibold hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-sm text-red-600 font-semibold hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    readOnly={
                      !isEditing || key === "memberSince" || key === "userId"
                    } // keep these two locked
                    onChange={handleChange}
                    className={`mt-1 w-full border rounded-md px-3 py-2 ${
                      !isEditing || key === "memberSince" || key === "userId"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🔒 Security Settings
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-700">Password</div>
                  <div className="text-gray-500 text-xs">
                    Last updated 30 days ago
                  </div>
                </div>
                <button className="text-sm text-[#0A2A67] font-semibold hover:underline">
                  Change Password
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-700">
                    Two-Factor Authentication
                  </div>
                  <div className="text-gray-500 text-xs">
                    Add an extra layer of security
                  </div>
                </div>
                <button className="text-sm text-[#0A2A67] font-semibold hover:underline">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
