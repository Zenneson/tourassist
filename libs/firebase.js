import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_LeZwAqankwio7WIUYQx7UUhloVuNq7Y",
  // TODO: Update authDomain
  authDomain: "tourassist-836db.firebaseapp.com",
  projectId: "tourassist-836db",
  storageBucket: "tourassist-836db.appspot.com",
  messagingSenderId: "841923423421",
  appId: "1:841923423421:web:7e4ca185006d776d409bd4",
  measurementId: "G-W3T7NY210E",
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
