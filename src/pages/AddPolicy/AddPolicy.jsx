import React, { useState } from "react";
import { FaUser, FaUpload, FaFileAlt, FaClipboardList } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { addPolicy } from "../../api/policyApi";

export default function AddPolicy() {
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 🔹 Dropdown Lists
  const policyTypes = [
    "Life Insurance",
    "Health Insurance",
    "Vehicle Insurance",
    "Cargo Insurance",
    "Home Insurance",
    "Travel Insurance",
    "Others",
  ];
  const premiumTypes = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Single"];
  const policyStatuses = ["Active", "Expired", "Lapsed", "Pending"];
  const documentTypes = ["Policy Copy", "ID Proof", "Claim Form", "Others"];

  // 🔹 Initial Form State
  const [formData, setFormData] = useState({
    policyNumber: "",
    policyType: "",
    insuranceCompany: "",
    customerName: "",
    customerContact: "",
    customerEmail: "",
    nomineeName: "",
    issueDate: "",
    expiryDate: "",
    premiumAmount: "",
    premiumType: "",
    sumAssured: "",
    policyStatus: "",
    reminderDaysBefore: 15,
    notes: "",
    documentType: "",
    policyDocument: null,
  });

  // 🔹 Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        e.target.value = ""; // Clear the input
        return;
      }
      setFormData({ ...formData, policyDocument: file });
      toast.success(`File selected: ${file.name}`);
    } else {
      setFormData({ ...formData, policyDocument: null });
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, policyDocument: null });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
    toast.success("File removed");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user || !user.uid) {
      toast.error("Please log in to create a policy");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare policy data for backend
      const policyData = {
        agentId: user.uid, // Use Firebase Auth UID as agentId
        policyNumber: formData.policyNumber,
        policyType: formData.policyType,
        company: formData.insuranceCompany,
        status: formData.policyStatus,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerContact,
        startDate: formData.issueDate,
        endDate: formData.expiryDate,
        premiumAmount: formData.premiumAmount,
        documentType: formData.documentType,
        // Additional fields that might be useful
        nomineeName: formData.nomineeName || "",
        premiumType: formData.premiumType || "",
        sumAssured: formData.sumAssured || "",
        reminderDaysBefore: formData.reminderDaysBefore || 15,
        notes: formData.notes || "",
      };

      // Call API to add policy
      const response = await addPolicy(policyData, formData.policyDocument);

      if (response.success) {
        toast.success(response.message || "✅ Policy Created Successfully!");
        
        // 🔹 Reset Form
        setFormData({
          policyNumber: "",
          policyType: "",
          insuranceCompany: "",
          customerName: "",
          customerContact: "",
          customerEmail: "",
          nomineeName: "",
          issueDate: "",
          expiryDate: "",
          premiumAmount: "",
          premiumType: "",
          sumAssured: "",
          policyStatus: "",
          reminderDaysBefore: 15,
          notes: "",
          documentType: "",
          policyDocument: null,
        });

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }

        // Optionally redirect to policies page after successful creation
        // navigate("/policies");
      } else {
        toast.error(response.error || "Failed to create policy");
      }
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to create policy. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
        Fill out the form below to create a new insurance policy.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Policy Information */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaClipboardList className="text-blue-600" />
            Policy Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Policy Number *</label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="Enter unique policy number"
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Policy Type *</label>
              <select
                name="policyType"
                value={formData.policyType}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {policyTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Insurance Company *</label>
              <input
                type="text"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleChange}
                placeholder="Enter company name"
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Policy Status *</label>
              <select
                name="policyStatus"
                value={formData.policyStatus}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                {policyStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Customer Details */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaUser className="text-blue-600" />
            Customer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer's full name"
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <input
                type="tel"
                name="customerContact"
                value={formData.customerContact}
                onChange={handleChange}
                placeholder="Enter phone number"
                pattern="[0-9]{10}"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nominee Name</label>
              <input
                type="text"
                name="nomineeName"
                value={formData.nomineeName}
                onChange={handleChange}
                placeholder="Enter nominee's name"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Policy Dates & Payment */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaFileAlt className="text-blue-600" />
            Policy Dates & Payment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date *</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Premium Amount *</label>
              <input
                type="number"
                name="premiumAmount"
                value={formData.premiumAmount}
                onChange={handleChange}
                placeholder="Enter amount (₹)"
                required
                min="0"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Premium Type *</label>
              <select
                name="premiumType"
                value={formData.premiumType}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select frequency</option>
                {premiumTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sum Assured</label>
              <input
                type="number"
                name="sumAssured"
                value={formData.sumAssured}
                onChange={handleChange}
                placeholder="Enter total coverage (₹)"
                min="0"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reminder Days Before Expiry
              </label>
              <input
                type="number"
                name="reminderDaysBefore"
                value={formData.reminderDaysBefore}
                onChange={handleChange}
                min="1"
                max="90"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Attachments */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaUpload className="text-purple-500" />
            Attachments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Type</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select document type</option>
                {documentTypes.map((doc) => (
                  <option key={doc}>{doc}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Upload Document</label>
              <input
                type="file"
                id="policy-document-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              {!formData.policyDocument ? (
                <label
                  htmlFor="policy-document-upload"
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50 transition"
                >
                  <FaUpload className="text-3xl text-gray-500 mb-2" />
                  <span className="text-gray-500 text-sm text-center">
                    <span className="text-blue-600 font-medium cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop PDF, DOC, DOCX, JPG, JPEG, PNG up to 10MB
                  </span>
                </label>
              ) : (
                <div className="w-full border-2 border-green-300 bg-green-50 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FaFileAlt className="text-2xl text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {formData.policyDocument.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(formData.policyDocument.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                    >
                      Remove
                    </button>
                  </div>
                  <label
                    htmlFor="policy-document-upload"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Change file
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Notes */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FaFileAlt className="text-blue-600" />
            Additional Notes
          </h2>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any special remarks or details (optional)"
            maxLength="500"
            rows="4"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
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
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Policy"}
          </button>
        </div>
      </form>
    </div>
  );
}
 