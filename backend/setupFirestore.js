// setupFirestore.js - Uses Firebase Admin SDK
import { db } from "./firebaseAdmin.js";
import { Timestamp } from "firebase-admin/firestore";

async function setupFirestore() {
  try {
    // 👤 Example agent record
    await db.collection("users").doc("demoAgent01").set({
      fullName: "Demo Agent",
      email: "agent@example.com",
      phone: "+91 99999 99999",
      role: "Insurance Agent",
      memberSince: Timestamp.now(),
      profilePhoto: "",
      totalPolicies: 0,
      activeClients: 0,
      thisMonth: 0,
    });

    // 🧾 Example policy record
    await db.collection("policies").doc("LI-001-2024").set({
      agentId: "demoAgent01",
      customer: {
        name: "John Smith",
        email: "john@example.com",
        phone: "+91 88888 88888",
      },
      policyNumber: "LI-001-2024",
      policyType: "Life Insurance",
      startDate: Timestamp.fromDate(new Date("2024-01-01")),
      endDate: Timestamp.fromDate(new Date("2024-12-31")),
      premiumAmount: 2500,
      status: "Active",
      createdAt: Timestamp.now(),
      documents: [],
    });

    // 🔔 Example alert
    await db.collection("alerts").doc("alert001").set({
      agentId: "demoAgent01",
      policyId: "LI-001-2024",
      customerName: "John Smith",
      alertType: "Renewal Alert",
      status: "Sent",
      sentDate: Timestamp.now(),
    });

    // ⏰ Example reminder
    await db.collection("reminders").doc("rem001").set({
      agentId: "demoAgent01",
      policyId: "LI-001-2024",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      policyNumber: "LI-001-2024",
      premiumAmount: 2500,
      expiryDate: Timestamp.fromDate(new Date("2024-12-31")),
      daysLeft: 30,
      priority: "Moderate",
      reminderStatus: "Pending",
      createdAt: Timestamp.now(),
    });

    console.log("✅ Firestore structure created successfully!");
  } catch (error) {
    console.error("❌ Error setting up Firestore:", error);
    process.exit(1);
  }
}

setupFirestore();
