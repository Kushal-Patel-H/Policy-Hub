import express from "express";
import fs from "fs";
import { google } from "googleapis";

const router = express.Router();

// Load credentials
const credentials = JSON.parse(fs.readFileSync("./config/googleConfig.json"));
const { client_id, client_secret, redirect_uris = [] } = credentials.web;

// Set redirect URI
const redirectUri = redirect_uris[0] || "http://localhost:3000/oauth2callback";

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

// --- ROUTES ---

// 1️⃣ Start OAuth flow
router.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/drive.file", // Google Drive
      "https://www.googleapis.com/auth/gmail.send", // Gmail send permission (for reminders)
    ],
  });
  res.redirect(authUrl);
});

// 2️⃣ Handle OAuth callback
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing authorization code.");

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // ✅ Save token to file
    fs.writeFileSync("token.json", JSON.stringify(tokens, null, 2));
    console.log("✅ Token saved to token.json");

    res.send("✅ Google Authentication Successful! Token has been saved.");
  } catch (error) {
    console.error("❌ Error retrieving access token:", error);
    res.status(500).send("Error retrieving access token.");
  }
});

export default router;
