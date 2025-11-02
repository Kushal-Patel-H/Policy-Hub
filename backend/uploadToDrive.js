// backend/uploadToDrive.js
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";

// ✅ Get proper __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Paths to credentials and token files
const credentialsPath = path.resolve(__dirname, "config", "googleConfig.json");
const tokenPath = path.resolve(__dirname, "token.json");

// ✅ Load credentials safely
if (!fs.existsSync(credentialsPath)) {
  throw new Error(`❌ googleConfig.json not found at: ${credentialsPath}`);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
const { client_id, client_secret, redirect_uris = [] } = credentials.web || {};
if (!client_id || !client_secret || redirect_uris.length === 0) {
  throw new Error("❌ Invalid googleConfig.json format — missing OAuth fields");
}

// ✅ Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// ✅ Try loading token.json — but don’t crash if it’s missing
if (fs.existsSync(tokenPath)) {
  const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  oAuth2Client.setCredentials(token);
  console.log("✅ Token loaded successfully from token.json");
} else {
  console.warn("⚠️ token.json not found. Please authenticate via /auth route first.");
}

// ✅ Initialize Google Drive API (client will still be valid after token set)
const drive = google.drive({ version: "v3", auth: oAuth2Client });

// ✅ Your Drive folder ID (update this if needed)
const FOLDER_ID = "1J4nm0mhDpfn7UmUL3VP75Socp97Ld3mk";

// ✅ Function: upload file to Google Drive
export async function uploadFileToDrive(filePath, fileName) {
  try {
    // Prevent upload if no token
    if (!fs.existsSync(tokenPath)) {
      throw new Error("⚠️ Missing token.json. Please authenticate via /auth first.");
    }

    console.log("📁 Uploading file to Google Drive...");

    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name, webViewLink, webContentLink",
    });

    // Make file public
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    console.log("✅ File uploaded successfully:", response.data);

    // Clean up temporary file
    try {
      fs.unlinkSync(filePath);
    } catch {
      console.warn("⚠️ Could not delete temp file:", filePath);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error uploading to Drive:", error.message);
    throw error;
  }
}
