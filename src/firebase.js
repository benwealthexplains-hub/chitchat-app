import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your ChitChat Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDLedXiukgTTcoSK5nFzRgUBkkMzKyCFLE",
  authDomain: "chitchat-app-cd93a.firebaseapp.com",
  projectId: "chitchat-app-cd93a",
  storageBucket: "chitchat-app-cd93a.firebasestorage.app",
  messagingSenderId: "991868035435",
  appId: "1:991868035435:web:7a460628f0c61819d2ac2e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
