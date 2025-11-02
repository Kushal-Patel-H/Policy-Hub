import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { db } from "../firebaseAdmin.js";
import path from "path";
import { fileURLToPath } from "url";
import { uploadFileToDrive } from "../uploadToDrive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Called after registration (from RegisterModal)
export const initializeUserProfile = async (uid, email, username) => {
  try {
    const userRef = db.collection("users").doc(uid);

    const userData = {
      uid,
      email,
      username,
      profileCompleted: false,
      phone: "",
      city: "",
      state: "",
      pincode: "",
      photoURL: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // 🟢 Create or merge the user profile
    await userRef.set(userData, { merge: true });

    // 🟢 Return full data (used by frontend immediately after register)
    return userData;
  } catch (err) {
    console.error("Error initializing user profile:", err);
    throw new Error("Failed to initialize user profile");
  }
};

// ✅ For GET /api/users/:uid
export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const docRef = db.collection("users").doc(uid);
    const snap = await docRef.get();

    if (!snap.exists)
      return res.status(404).json({ error: "User not found" });

    // 🟢 Get user data and convert Timestamps to serializable format
    const userData = snap.data();
    
    // Convert Firestore Timestamps to seconds format for frontend
    if (userData.createdAt && userData.createdAt.seconds) {
      userData.createdAt = {
        seconds: userData.createdAt.seconds,
        nanoseconds: userData.createdAt.nanoseconds || 0,
      };
    }
    
    if (userData.updatedAt && userData.updatedAt.seconds) {
      userData.updatedAt = {
        seconds: userData.updatedAt.seconds,
        nanoseconds: userData.updatedAt.nanoseconds || 0,
      };
    }

    res.json(userData);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

// ✅ For PUT /api/users/:uid
export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = req.body;
    const docRef = db.collection("users").doc(uid);

    await docRef.update({
      ...data,
      updatedAt: Timestamp.now(),
    });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

// ✅ For POST /api/users/upload-photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    const { uid } = req.body;
    const file = req.file;

    console.log("📸 Profile photo upload request received");
    console.log("UID:", uid);
    console.log("File:", file ? file.originalname : "No file");

    if (!uid) {
      return res.status(400).json({ 
        success: false,
        error: "Missing uid in request" 
      });
    }

    if (!file) {
      return res.status(400).json({ 
        success: false,
        error: "No file uploaded. Please select an image file." 
      });
    }

    // Validate file type
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid file type. Please upload an image file (jpg, png, gif, etc.)" 
      });
    }

    // Upload file to Google Drive
    console.log("📤 Uploading to Google Drive...");
    const filePath = path.join(__dirname, "..", "uploads", file.filename);
    console.log("File path:", filePath);
    
    let driveFile;
    try {
      driveFile = await uploadFileToDrive(filePath, file.originalname);
      console.log("✅ Uploaded to Drive:", driveFile.id);
    } catch (driveError) {
      console.error("❌ Google Drive upload error:", driveError);
      return res.status(500).json({ 
        success: false,
        error: `Google Drive upload failed: ${driveError.message}` 
      });
    }

    // Get photo URL
    const photoURL =
      driveFile.webViewLink ||
      driveFile.webContentLink ||
      `https://drive.google.com/file/d/${driveFile.id}/view`;

    console.log("💾 Saving photoURL to database:", photoURL);

    // Update user profile with photo URL in database
    const docRef = db.collection("users").doc(uid);
    await docRef.update({
      photoURL: photoURL,
      updatedAt: Timestamp.now(),
    });

    console.log("✅ Photo URL saved to database successfully");

    res.json({
      success: true,
      message: "Photo uploaded successfully",
      photoURL: photoURL,
    });
  } catch (err) {
    console.error("❌ Error uploading profile photo:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to upload photo. Please try again." 
    });
  }
};
