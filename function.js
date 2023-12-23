import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseApiKey =
  "projects/841923423421/secrets/NEXT_PUBLIC_FIREBASE_API_KEY/versions/latest" ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  secrets.NEXT_PUBLIC_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "tourassist-836db.firebaseapp.com",
  projectId: "tourassist-836db",
  storageBucket: "tourassist-836db.appspot.com",
  messagingSenderId: "841923423421",
  appId: "1:841923423421:web:7e4ca185006d776d409bd4",
  measurementId: "G-W3T7NY210E",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

export const tourassistDev = functions.https.onRequest((req, res) => {
  res.send("Tourassist Development Environment is Ready!");
});
