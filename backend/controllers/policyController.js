import fs from "fs";
import path from "path";

export const addPolicy = async (req, res) => {
  try {
    const { policyNumber, customerName, expiryDate } = req.body;
    const file = req.file;

    if (!policyNumber || !customerName || !expiryDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Temporary — save to local JSON for testing
    const policiesFile = path.join(process.cwd(), "data", "policies.json");
    const existingData = fs.existsSync(policiesFile)
      ? JSON.parse(fs.readFileSync(policiesFile, "utf-8"))
      : [];

    const newPolicy = {
      id: existingData.length + 1,
      policyNumber,
      customerName,
      expiryDate,
      document: file ? file.path : null,
      createdAt: new Date(),
    };

    existingData.push(newPolicy);
    fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
    fs.writeFileSync(policiesFile, JSON.stringify(existingData, null, 2));

    res.status(201).json({
      message: "✅ Policy added successfully!",
      policy: newPolicy,
    });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
