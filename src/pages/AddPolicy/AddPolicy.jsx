import React, { useState } from "react";
import { FaUser, FaUpload } from "react-icons/fa";

export default function AddPolicy() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    document: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Policy Created:", formData);
    // 🔹 Later connect to Firebase Firestore + Storage
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="text-sm text-gray-600 mb-4 flex items-center gap-1"
      >
        ← Back to Policies
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-2">Add New Policy</h1>
      <p className="text-gray-600 mb-6">
        Create a new insurance policy for your customer.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaUser className="text-blue-600" />
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter customer’s full name"
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter customer’s email"
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter customer’s phone number"
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaUpload className="text-purple-500" />
            Document Upload
          </h2>

          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <FaUpload className="text-3xl text-gray-500 mb-2" />
            <span className="text-gray-500 text-sm mt-1 text-center">
  <span className="text-blue-600 font-medium cursor-pointer">Click to upload</span> or drag and drop PDF, DOC, DOCX, JPG, JPEG, PNG up to 10MB each
</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Policy
          </button>
        </div>
      </form>
    </div>
  );
}
