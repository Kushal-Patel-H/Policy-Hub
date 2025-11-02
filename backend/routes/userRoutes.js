import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/:uid", getUserProfile);
router.put("/:uid", updateUserProfile);

export default router;
