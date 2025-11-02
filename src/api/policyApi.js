import axios from "axios";

const API_URL = "http://localhost:3000/api/policies"; // backend base URL

// Add new policy with file upload
export const addPolicy = async (policyData, file) => {
  try {
    const formData = new FormData();

    // Add all policy fields to FormData
    Object.keys(policyData).forEach((key) => {
      if (policyData[key] !== null && policyData[key] !== undefined) {
        formData.append(key, policyData[key]);
      }
    });

    // Add file if provided
    if (file) {
      formData.append("document", file);
    }

    const response = await axios.post(`${API_URL}/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding policy:", error);
    throw error;
  }
};

// Get all policies for an agent
export const getPolicies = async (agentId) => {
  try {
    const response = await axios.get(`${API_URL}?agentId=${agentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    // Add more context to error
    if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
      error.message = "Cannot connect to backend server. Please ensure it's running on port 3000.";
    }
    throw error;
  }
};

// Get reminders based on expiry dates
export const getReminders = async (agentId) => {
  try {
    const response = await axios.get(`${API_URL}/reminders?agentId=${agentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reminders:", error);
    if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
      error.message = "Cannot connect to backend server. Please ensure it's running on port 3000.";
    }
    throw error;
  }
};

// Get alerts
export const getAlerts = async (agentId) => {
  try {
    const response = await axios.get(`${API_URL}/alerts?agentId=${agentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    if (error.code === "ECONNREFUSED" || error.message.includes("Network Error")) {
      error.message = "Cannot connect to backend server. Please ensure it's running on port 3000.";
    }
    throw error;
  }
};

