import express from "express";
import fs from "fs";
import { google } from "googleapis";

const router = express.Router();

// Load credentials
const credentials = JSON.parse(fs.readFileSync("./config/googleConfig.json"));
const { client_id, client_secret, redirect_uris = [] } = credentials.web;

// Set redirect URI - use the first one from config (usually /oauth2callback)
// The server.js handles redirecting /oauth2callback to /google/oauth2callback
const redirectUri = redirect_uris[0] || "http://localhost:3000/oauth2callback";

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

// --- ROUTES ---

// 1️⃣ Start OAuth flow
router.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", // Required to get refresh token
    prompt: "consent", // Force consent screen to get refresh token
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
    
    if (tokens.refresh_token) {
      console.log("✅ Refresh token obtained successfully");
    } else {
      console.warn("⚠️ No refresh token received. You may need to revoke access and re-authenticate.");
    }

    res.send(`
      <html>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h1 style="color: green;">✅ Google Authentication Successful!</h1>
          <p>Token has been saved. You can now close this window and try uploading photos again.</p>
          <p style="color: ${tokens.refresh_token ? 'green' : 'orange'};">
            ${tokens.refresh_token ? 'Refresh token obtained!' : 'Warning: No refresh token received. If uploads fail, try re-authenticating.'}
          </p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error retrieving access token:", error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h1 style="color: red;">❌ Authentication Failed</h1>
          <p>Error: ${error.message}</p>
          <p>Please try again by visiting <a href="/google/auth">/google/auth</a></p>
        </body>
      </html>
    `);
  }
});

export default router;
