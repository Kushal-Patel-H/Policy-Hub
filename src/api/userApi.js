import axios from "axios";

const API_URL = "http://localhost:3000/api/users"; // backend base URL

// Called after registration
export const initializeUserProfile = async (uid, email, username) => {
  const response = await axios.post(`${API_URL}/initialize`, {
    uid,
    email,
    username,
  });
  return response.data;
};

// For fetching user profile later
export const getUserProfile = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/${uid}`);
    return response.data;
  } catch (error) {
    console.error("getUserProfile error:", error);
    throw {
      message: error.response?.data?.error || error.message || "Failed to fetch profile",
      response: error.response,
    };
  }
};

// For updating profile data later
export const updateUserProfile = async (uid, data) => {
  try {
    const response = await axios.put(`${API_URL}/${uid}`, data);
    return response.data;
  } catch (error) {
    console.error("updateUserProfile error:", error);
    // Re-throw with better error message
    throw {
      message: error.response?.data?.error || error.message || "Failed to update profile",
      response: error.response,
    };
  }
};
