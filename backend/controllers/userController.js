import { db } from "../firebaseAdmin.js";

import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// ✅ Called after registration (from RegisterModal)
export const initializeUserProfile = async (uid, email, username) => {
  const userRef = doc(db, "users", uid);
  const userData = {
    uid,
    email,
    username,
    profileCompleted: false,
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    photoURL: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, userData, { merge: true });
  return userData;
};

// ✅ For GET /api/users/:uid
export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return res.status(404).json({ error: "User not found" });
    res.json(snap.data());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

// ✅ For PUT /api/users/:uid
export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = req.body;
    const docRef = doc(db, "users", uid);

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};
