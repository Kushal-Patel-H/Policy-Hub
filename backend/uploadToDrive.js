// backend/uploadToDrive.js
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";

// ✅ Get proper __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct relative path to config and token files
const credentialsPath = path.resolve(__dirname, "config", "googleConfig.json");
const tokenPath = path.resolve(__dirname, "token.json");

// ✅ Load credentials safely
if (!fs.existsSync(credentialsPath)) {
  throw new Error(`❌ googleConfig.json not found at: ${credentialsPath}`);
}
if (!fs.existsSync(tokenPath)) {
  throw new Error(`❌ token.json not found at: ${tokenPath}`);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));

// ✅ Extract OAuth client details safely
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
oAuth2Client.setCredentials(token);

// ✅ Initialize Google Drive API
const drive = google.drive({ version: "v3", auth: oAuth2Client });

// ✅ Replace with your Drive folder ID
const FOLDER_ID = "1J4nm0mhDpfn7UmUL3VP75Socp97Ld3mk";

// ✅ Function: upload file to Google Drive
export async function uploadFileToDrive(filePath, fileName) {
  try {
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
