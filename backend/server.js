// ✅ server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { uploadFileToDrive } from "./uploadToDrive.js";
import googleAuth from "./googleAuth.js";
import policyRoutes from "./routes/policyRoutes.js";
import { db as adminDb, admin } from "./firebaseAdmin.js"; // from firebaseAdmin.js
import userRoutes from "./routes/userRoutes.js";

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", googleAuth);
app.use("/api/users", userRoutes);
app.use("/google", googleAuth); 

// ✅ Multer setup (temporary local folder for uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Policy Hub backend is running!");
});

// ✅ Mount the policy routes (important)
app.use("/api/policies", policyRoutes);

// ✅ (Optional) simple upload test route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadFileToDrive(req.file.path, req.file.originalname);

    return res.status(200).json({
      message: "✅ File uploaded successfully to Google Drive",
      fileId: result.id,
      fileLink:
        result.webViewLink ||
        result.webContentLink ||
        `https://drive.google.com/file/d/${result.id}/view`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ MAIN: Upload file + save policy data in Firestore
app.post("/upload-and-save", upload.single("policyDocument"), async (req, res) => {
  try {
    // Extract policy fields from frontend form
    const {
      agentId,
      policyNumber,
      policyType,
      company,
      status,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      premiumAmount,
      documentType,
    } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: "Missing agentId in policy data" });
    }

    // ✅ Upload file to Google Drive (if attached)
    let driveFile = null;
    if (req.file) {
      const filePath = path.join(__dirname, "uploads", req.file.filename);
      driveFile = await uploadFileToDrive(filePath, req.file.originalname);
    }

    // ✅ Prepare policy data object for Firestore
    const policyData = {
      agentId,
      company: company || "",
      policyNumber: policyNumber || "",
      policyType: policyType || "",
      status: status || "Active",
      startDate: startDate || "",
      endDate: endDate || "",
      premiumAmount: premiumAmount ? Number(premiumAmount) : 0,
      customer: {
        name: customerName || "",
        email: customerEmail || "",
        phone: customerPhone || "",
      },
      documents: driveFile
        ? [
            {
              type: documentType || "Policy Document",
              name: req.file?.originalname || "",
              url:
                driveFile.webViewLink ||
                driveFile.webContentLink ||
                `https://drive.google.com/file/d/${driveFile.id}/view`,
            },
          ]
        : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // ✅ Save policy in Firestore
    const docRef = await adminDb.collection("policies").add(policyData);

    res.status(200).json({
      success: true,
      message: "✅ Policy saved successfully!",
      policyId: docRef.id,
      fileLink:
        driveFile?.webViewLink ||
        driveFile?.webContentLink ||
        (driveFile ? `https://drive.google.com/file/d/${driveFile.id}/view` : null),
    });
  } catch (err) {
    console.error("upload-and-save error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Start backend
app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
