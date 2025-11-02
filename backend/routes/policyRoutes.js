import express from "express";
import multer from "multer";
import { addPolicy } from "../controllers/policyController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Add new policy
router.post("/add", upload.single("document"), addPolicy);

export default router;
