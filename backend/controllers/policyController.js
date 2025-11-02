import path from "path";
import { fileURLToPath } from "url";
import { db, admin } from "../firebaseAdmin.js";
import { Timestamp } from "firebase-admin/firestore";
import { uploadFileToDrive } from "../uploadToDrive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Get all policies for a specific agent
export const getPolicies = async (req, res) => {
  try {
    const { agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ error: "Missing agentId parameter" });
    }

    const policiesRef = db.collection("policies");
    const snapshot = await policiesRef.where("agentId", "==", agentId).get();

    const policies = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      policies.push({
        id: doc.id,
        ...data,
      });
    });

    // Sort by createdAt descending (newest first)
    policies.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const aTime = a.createdAt.seconds || a.createdAt._seconds || 0;
        const bTime = b.createdAt.seconds || b.createdAt._seconds || 0;
        return bTime - aTime;
      }
      return 0;
    });

    res.json({ success: true, policies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get reminders based on expiry dates
export const getReminders = async (req, res) => {
  try {
    const { agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ error: "Missing agentId parameter" });
    }

    const policiesRef = db.collection("policies");
    const snapshot = await policiesRef
      .where("agentId", "==", agentId)
      .where("status", "==", "Active")
      .get();

    const reminders = [];
    const now = new Date();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const endDate = data.endDate || data.expiryDate;

      if (endDate) {
        let expiryDate;
        
        // Handle Firestore Timestamp
        if (endDate.toDate && typeof endDate.toDate === "function") {
          expiryDate = endDate.toDate();
        } else if (endDate.seconds) {
          expiryDate = new Date(endDate.seconds * 1000);
        } else if (endDate._seconds) {
          expiryDate = new Date(endDate._seconds * 1000);
        } else if (endDate instanceof Date) {
          expiryDate = endDate;
        } else if (typeof endDate === "string") {
          expiryDate = new Date(endDate);
        } else {
          return; // Skip if date is invalid
        }

        // Check if date is valid
        if (isNaN(expiryDate.getTime())) {
          return; // Skip invalid dates
        }

        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Only include policies that haven't expired yet (or expired recently for reminder)
        if (daysUntilExpiry >= -30) {
          const reminderDaysBefore = data.reminderDaysBefore || 15;

          // Create reminder if within reminder window OR if expired (for renewal)
          if (daysUntilExpiry <= reminderDaysBefore || daysUntilExpiry < 0) {
            let priority = "Upcoming";
            if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
              priority = "Critical";
            } else if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
              priority = "Moderate";
            } else if (daysUntilExpiry < 0) {
              priority = "Expired"; // Show expired policies too
            }

            reminders.push({
              id: doc.id,
              policyId: doc.id,
              policyNumber: data.policyNumber,
              customerName: data.customer?.name || "",
              customerEmail: data.customer?.email || "",
              expiryDate: expiryDate.toISOString(),
              expiryDateFormatted: expiryDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              daysUntilExpiry,
              priority,
              premiumAmount: data.premiumAmount || 0,
              policyType: data.policyType || "",
            });
          }
        }
      }
    });

    // Sort by days until expiry (most urgent first)
    reminders.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    res.json({ success: true, reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get alerts from Firestore
export const getAlerts = async (req, res) => {
  try {
    const { agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ error: "Missing agentId parameter" });
    }

    const alertsRef = db.collection("alerts");
    const snapshot = await alertsRef.where("agentId", "==", agentId).get();

    const alerts = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      alerts.push({
        id: doc.id,
        ...data,
      });
    });

    // Sort by sentDate descending (newest first)
    alerts.sort((a, b) => {
      if (a.sentDate && b.sentDate) {
        const aTime = a.sentDate.seconds || a.sentDate._seconds || 0;
        const bTime = b.sentDate.seconds || b.sentDate._seconds || 0;
        return bTime - aTime;
      }
      return 0;
    });

    res.json({ success: true, alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addPolicy = async (req, res) => {
  try {
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
      expiryDate,
      premiumAmount,
      documentType,
      nomineeName,
      premiumType,
      sumAssured,
      reminderDaysBefore,
      notes,
    } = req.body;
    const file = req.file;

    // Validate required fields
    if (!agentId) {
      return res.status(400).json({ error: "Missing agentId in policy data" });
    }
    if (!policyNumber) {
      return res.status(400).json({ error: "Policy number is required" });
    }

    // ✅ Upload file to Google Drive (if attached)
    let driveFile = null;
    if (file) {
      const filePath = path.join(__dirname, "..", "uploads", file.filename);
      driveFile = await uploadFileToDrive(filePath, file.originalname);
    }

    // ✅ Prepare policy data object for Firestore
    const policyData = {
      agentId,
      company: company || "",
      policyNumber: policyNumber || "",
      policyType: policyType || "",
      status: status || "Active",
      startDate: startDate || "",
      endDate: endDate || expiryDate || "",
      premiumAmount: premiumAmount ? Number(premiumAmount) : 0,
      premiumType: premiumType || "",
      sumAssured: sumAssured ? Number(sumAssured) : 0,
      reminderDaysBefore: reminderDaysBefore ? Number(reminderDaysBefore) : 15,
      notes: notes || "",
      customer: {
        name: customerName || "",
        email: customerEmail || "",
        phone: customerPhone || "",
        nomineeName: nomineeName || "",
      },
      documents: driveFile
        ? [
            {
              type: documentType || "Policy Document",
              name: file?.originalname || "",
              url:
                driveFile.webViewLink ||
                driveFile.webContentLink ||
                `https://drive.google.com/file/d/${driveFile.id}/view`,
              uploadedAt: Timestamp.now(), // Use Timestamp.now() instead of serverTimestamp() for nested fields
            },
          ]
        : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // ✅ Save policy in Firestore
    const docRef = await db.collection("policies").add(policyData);

    res.status(201).json({
      success: true,
      message: "✅ Policy saved successfully!",
      policyId: docRef.id,
      fileLink:
        driveFile?.webViewLink ||
        driveFile?.webContentLink ||
        (driveFile ? `https://drive.google.com/file/d/${driveFile.id}/view` : null),
    });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
};
