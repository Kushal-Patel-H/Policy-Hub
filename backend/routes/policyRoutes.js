import express from "express";
import multer from "multer";
import {
  addPolicy,
  getPolicies,
  getReminders,
  getAlerts,
} from "../controllers/policyController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Get all policies for an agent
router.get("/", getPolicies);

// ✅ Get reminders based on expiry dates
router.get("/reminders", getReminders);

// ✅ Get alerts
router.get("/alerts", getAlerts);

// ✅ Add new policy
router.post("/add", upload.single("document"), addPolicy);

export default router;
