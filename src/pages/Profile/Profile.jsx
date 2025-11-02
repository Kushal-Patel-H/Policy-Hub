import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../../api/userApi";

export default function Profile() {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Insurance Agent",
    memberSince: "",
    userId: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  // ✅ Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await getUserProfile(user.uid);
        
        // Format createdAt date for display
        let memberSince = "";
        if (userData.createdAt) {
          // Handle Firestore Timestamp (can be serialized or object)
          let date;
          if (userData.createdAt.toDate && typeof userData.createdAt.toDate === "function") {
            // Firestore Timestamp object with toDate method
            date = userData.createdAt.toDate();
          } else if (userData.createdAt.seconds && typeof userData.createdAt.seconds === "number") {
            // Firestore Timestamp with seconds property
            date = new Date(userData.createdAt.seconds * 1000);
          } else if (userData.createdAt._seconds) {
            // Firestore Timestamp serialized format
            date = new Date(userData.createdAt._seconds * 1000);
          } else if (typeof userData.createdAt === "string") {
            // ISO date string
            date = new Date(userData.createdAt);
          } else {
            // Try to parse as date
            date = new Date(userData.createdAt);
          }
          
          // Check if date is valid
          if (!isNaN(date.getTime())) {
            memberSince = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          }
        }

        // Map backend data to form fields (photoURL is stored separately, not in formData)
        setFormData({
          fullName: userData.username || userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: "Insurance Agent", // Static role
          memberSince: memberSince,
          userId: userData.uid || user.uid,
          city: userData.city || "",
          state: userData.state || "",
          pincode: userData.pincode || "",
        });
        
        // Set photo preview if photoURL exists (photoURL is stored in DB, not formData)
        if (userData.photoURL) {
          setPhotoPreview(userData.photoURL);
        } else {
          setPhotoPreview(""); // Clear preview if no photo
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Fixed PUT logic here
  const handleSave = async () => {
    if (!user || !user.uid) {
      toast.error("User ID missing! Please log in again.");
      return;
    }

    setIsEditing(false);
    try {
      // Prepare data to send (exclude read-only fields)
      const updateData = {
        username: formData.fullName, // Map fullName back to username
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        // Don't send email, role, memberSince, or userId as they are read-only
      };
      
      // If photo file is selected, upload it first
      if (photoFile) {
        try {
          const photoFormData = new FormData();
          photoFormData.append("photo", photoFile);
          photoFormData.append("uid", user.uid);
          
          console.log("📤 Starting photo upload...");
          const uploadResponse = await fetch("http://localhost:3000/api/users/upload-photo", {
            method: "POST",
            body: photoFormData,
          });
          
          console.log("📥 Upload response status:", uploadResponse.status);
          
          // Try to get response text first
          const responseText = await uploadResponse.text();
          console.log("📄 Response text:", responseText);
          
          let uploadData;
          try {
            uploadData = JSON.parse(responseText);
          } catch (parseError) {
            console.error("Failed to parse response:", parseError);
            throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
          }
          
          if (!uploadResponse.ok) {
            const errorMessage = uploadData.error || uploadData.message || `Server error (${uploadResponse.status})`;
            console.error("❌ Upload failed:", errorMessage);
            throw new Error(errorMessage);
          }
          
          if (uploadData.success && uploadData.photoURL) {
            // photoURL is automatically saved to DB by the upload endpoint
            // No need to include it in updateData - it's already in the database
            console.log("✅ Photo uploaded successfully:", uploadData.photoURL);
            toast.success("Photo uploaded successfully!");
          } else {
            const errorMessage = uploadData.error || uploadData.message || "Photo upload failed - no URL returned";
            console.error("❌ Upload incomplete:", errorMessage);
            throw new Error(errorMessage);
          }
        } catch (uploadError) {
          console.error("❌ Photo upload error:", uploadError);
          const errorMessage = uploadError.message || "Failed to upload photo. Please check your connection and try again.";
          toast.error(`Failed to upload photo: ${errorMessage}`);
          setIsEditing(true); // Re-enable editing so user can try again
          return; // Don't proceed with profile update if photo upload fails
        }
      }

      // Only update profile if there are changes or no photo was uploaded
      if (Object.keys(updateData).length > 0 || !photoFile) {
        console.log("💾 Updating profile data:", updateData);
        await updateUserProfile(user.uid, updateData);
        toast.success("Profile updated successfully!");
      }
      
      // Refresh the data after update (to get latest photoURL if photo was uploaded)
      try {
        console.log("🔄 Refreshing profile data...");
        const userData = await getUserProfile(user.uid);
        if (userData && userData.createdAt) {
        // Format date for refresh
        let memberSince = "";
        let date;
        if (userData.createdAt.toDate && typeof userData.createdAt.toDate === "function") {
          date = userData.createdAt.toDate();
        } else if (userData.createdAt.seconds) {
          date = new Date(userData.createdAt.seconds * 1000);
        } else if (userData.createdAt._seconds) {
          date = new Date(userData.createdAt._seconds * 1000);
        } else {
          date = new Date(userData.createdAt);
        }
        if (!isNaN(date.getTime())) {
          memberSince = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        
        setFormData(prev => ({
          ...prev,
          fullName: userData.username || userData.fullName || prev.fullName,
          phone: userData.phone || prev.phone,
          city: userData.city || prev.city,
          state: userData.state || prev.state,
          pincode: userData.pincode || prev.pincode,
          memberSince: memberSince || prev.memberSince,
        }));
        
        // Update photo preview from database (photoURL is stored in DB)
        if (userData.photoURL) {
          setPhotoPreview(userData.photoURL);
        } else {
          setPhotoPreview(""); // Clear preview if no photo in DB
        }
        setPhotoFile(null); // Clear photo file after successful upload
        }
      } catch (refreshError) {
        console.warn("⚠️ Failed to refresh profile data after update:", refreshError);
        // Don't show error toast - the update was successful, just the refresh failed
        // The data will refresh on next page load or manual refresh
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to update profile. Please try again.";
      toast.error(`Failed to save: ${errorMessage}`);
      setIsEditing(true); // Re-enable editing on error
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <p className="text-gray-600 mt-1">
        Manage your account information and security settings.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center text-center">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-[#0A2A67] object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full border-4 border-[#0A2A67] flex items-center justify-center text-4xl text-[#0A2A67] font-bold bg-gray-100">
                  👤
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#0A2A67] text-white rounded-full p-2 cursor-pointer hover:bg-[#0a3a87] transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              )}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {formData.fullName || "User Name"}
            </h2>
            <p className="text-gray-500 text-sm">
              {formData.role} <br />
              Member since {formData.memberSince || "N/A"}
            </p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium shadow"
              >
              Change Photo
            </button>
            )}
          </div>

          {/* Account Stats */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800">Account Stats</h3>
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
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-[#0A2A67] font-semibold"
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
              {Object.entries(formData).map(([key, value]) => {
                // Fields that should always be read-only (static)
                const readOnlyFields = ["memberSince", "userId", "role", "email"];
                const isReadOnly = !isEditing || readOnlyFields.includes(key);
                
                return (
                <div key={key}>
                  <label className="block text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                      type={key === "email" ? "email" : "text"}
                    name={key}
                    value={value}
                      readOnly={isReadOnly}
                    onChange={handleChange}
                    className={`mt-1 w-full border rounded-md px-3 py-2 ${
                        isReadOnly
                          ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300"
                    }`}
                      disabled={isReadOnly}
                  />
                </div>
                );
              })}
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
