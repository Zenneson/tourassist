import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
const moment = require("moment-timezone");

export const estTimeStamp = (timeStamp) => {
  let dateStr = timeStamp;
  let dateInEST = moment(dateStr)
    .tz("America/New_York")
    .format("MMMM Do YYYY, hh:mm A");

  return dateInEST + " EST";
};

export const addEllipsis = (string, num) => {
  if (string.length > num) {
    return string.substring(0, num) + "...";
  } else {
    return string;
  }
};

export const daysBefore = (dateString) => {
  const format = "MMDDYYYY";
  const inputDate = moment(dateString, format);
  inputDate.subtract(1, "days");
  const today = moment();
  const days = inputDate.diff(today, "days");
  return days;
};

export const convertDateString = (dateString) => {
  const date = moment.tz(dateString, "UTC");
  if (!date.isValid()) {
    console.error("Invalid date string");
    return;
  }
  const formattedDate = date.format("MMDDYYYY");
  return formattedDate;
};

export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};

export const addAtSymbol = (inputStr, symbol) => {
  if (!inputStr) return;

  if (typeof inputStr === "string") {
    if (!inputStr.startsWith(symbol)) {
      return symbol + inputStr;
    }
    return inputStr;
  } else {
    throw new Error("Input must be a string");
  }
};

export function useUserData() {
  const [userAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userAuth?.email) {
      console.log("User email not found");
      return;
    }

    const docRef = doc(firestore, "users", userAuth.email);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.log("Error getting document:", error);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [userAuth]); // The effect hook depends on userAuth
  return userData;
}
