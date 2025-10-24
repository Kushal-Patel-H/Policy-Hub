// setupFirestore.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCLVUXWVRpBhhiiSWACwvBXcRRUeMpZOlA",
    authDomain: "policy-hub-b7d3c.firebaseapp.com",
  projectId: "policy-hub-b7d3c",
  storageBucket: "policy-hub-b7d3c.appspot.com",
  messagingSenderId: "83752002512",
  appId: "1:83752002512:web:98c1fbeb97957ff0f9cfd5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupFirestore() {
  // 👤 Example agent record
  await setDoc(doc(db, "users", "demoAgent01"), {
    fullName: "Demo Agent",
    email: "agent@example.com",
    phone: "+91 99999 99999",
    role: "Insurance Agent",
    memberSince: new Date(),
    profilePhoto: "",
    totalPolicies: 0,
    activeClients: 0,
    thisMonth: 0
  });

  // 🧾 Example policy record
  await setDoc(doc(db, "policies", "LI-001-2024"), {
    agentId: "demoAgent01",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+91 88888 88888",
    policyNumber: "LI-001-2024",
    policyType: "Life Insurance",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    premiumAmount: 2500,
    status: "Active",
    createdAt: new Date(),
    documents: []
  });

  // 🔔 Example alert
  await setDoc(doc(db, "alerts", "alert001"), {
    agentId: "demoAgent01",
    policyId: "LI-001-2024",
    customerName: "John Smith",
    alertType: "Renewal Alert",
    status: "Sent",
    sentDate: new Date()
  });

  // ⏰ Example reminder
  await setDoc(doc(db, "reminders", "rem001"), {
    agentId: "demoAgent01",
    policyId: "LI-001-2024",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    policyNumber: "LI-001-2024",
    premiumAmount: 2500,
    expiryDate: new Date("2024-12-31"),
    daysLeft: 30,
    priority: "Moderate",
    reminderStatus: "Pending",
    createdAt: new Date()
  });

  console.log("✅ Firestore structure created successfully!");
}

setupFirestore();
