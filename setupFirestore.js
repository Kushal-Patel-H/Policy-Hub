import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCLVUXWVRpBhhiiSWACwvBXcRRUeMpZOlA",
    authDomain: "policy-hub-b7d3c.firebaseapp.com",
  projectId: "policy-hub-b7d3c",
  storageBucket: "policy-hub-b7d3c.appspot.com",
  messagingSenderId: "83752002512",
  appId: "1:83752002512:web:98c1fbeb97957ff0f9cfd5",
};


// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupFirestore() {
  console.log("🚀 Creating Firestore structure...");

  // --- Collection Structure Setup ---
  // These are "empty shells" just to initialize your structure

  // 1️⃣ Agents / Users
  await setDoc(doc(db, "users", "schemaGuide"), {
    fullName: "",
    email: "",
    phone: "",
    role: "Insurance Agent",
    memberSince: "",
    profilePhoto: "",
    stats: {
      totalPolicies: 0,
      activeClients: 0,
      thisMonth: 0
    }
  });

  // 2️⃣ Policies
  await setDoc(doc(db, "policies", "schemaGuide"), {
    agentId: "",
    customer: {
      name: "",
      email: "",
      phone: "",
    },
    policyNumber: "",
    policyType: "",
    company: "",
    startDate: "",
    endDate: "",
    premiumAmount: 0,
    status: "",
    createdAt: "",
    documents: []
  });

  // 3️⃣ Alerts
  await setDoc(doc(db, "alerts", "schemaGuide"), {
    agentId: "",
    policyId: "",
    customerName: "",
    alertType: "",
    status: "",
    sentDate: ""
  });

  // 4️⃣ Reminders
  await setDoc(doc(db, "reminders", "schemaGuide"), {
    agentId: "",
    policyId: "",
    customerEmail: "",
    policyNumber: "",
    expiryDate: "",
    daysLeft: 0,
    priority: "",
    reminderStatus: "",
    createdAt: ""
  });

  // 5️⃣ Renewals (New collection for policy renewal tracking)
  await setDoc(doc(db, "renewals", "schemaGuide"), {
    agentId: "",
    oldPolicyId: "",
    newPolicyId: "",
    customerEmail: "",
    renewedOn: "",
    paymentStatus: "",
    remarks: ""
  });

  console.log("✅ Firestore structure initialized successfully (no sample data).");
}

setupFirestore();
