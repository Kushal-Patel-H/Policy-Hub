import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLVUXWVRpBhhiiSWACwvBXcRRUeMpZOlA",
  authDomain: "policy-hub-b7d3c.firebaseapp.com",
  projectId: "policy-hub-b7d3c",
  storageBucket: "policy-hub-b7d3c.appspot.com",
  messagingSenderId: "83752002512",
  appId: "1:83752002512:web:98c1fbeb97957ff0f9cfd5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
