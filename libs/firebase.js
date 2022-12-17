import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_LeZwAqankwio7WIUYQx7UUhloVuNq7Y",
  authDomain: "tourassist-836db.firebaseapp.com",
  projectId: "tourassist-836db",
  storageBucket: "tourassist-836db.appspot.com",
  messagingSenderId: "841923423421",
  appId: "1:841923423421:web:7e4ca185006d776d409bd4",
  measurementId: "G-W3T7NY210E",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
