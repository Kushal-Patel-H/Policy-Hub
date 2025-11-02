import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getUserProfile,
  updateUserProfile,
  initializeUserProfile,
  uploadProfilePhoto,
} from "../controllers/userController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer setup for photo upload
const upload = multer({
  dest: path.join(__dirname, "..", "uploads"),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      req.fileValidationError = "Only image files are allowed";
      cb(null, false);
    }
  },
});

router.post("/initialize", async (req, res) => {
  try {
    const { uid, email, username } = req.body;
    const result = await initializeUserProfile(uid, email, username);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to initialize user" });
  }
});

// Test route to verify routing works
router.get("/test-upload-route", (req, res) => {
  res.json({ message: "Upload route is accessible", path: "/api/users/upload-photo" });
});

// Photo upload route with error handling (must be before /:uid route)
router.post("/upload-photo", upload.single("photo"), async (req, res, next) => {
  console.log("📸 Upload-photo route hit!");
  console.log("Request file:", req.file ? req.file.originalname : "No file");
  
  // Handle multer errors
  if (req.fileValidationError) {
    return res.status(400).json({
      success: false,
      error: req.fileValidationError,
    });
  }
  next();
}, uploadProfilePhoto);

router.get("/:uid", getUserProfile);
router.put("/:uid", updateUserProfile);

export default router;
