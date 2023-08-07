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
  if (string && string.length > num) {
    return string.substring(0, num) + "...";
  } else {
    return string;
  }
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

export function calculateFontSize(text) {
  const containerWidthPx = 700;
  const stringLength = text.length;
  let fontSizePx = containerWidthPx / stringLength;
  let fontSizeEm = fontSizePx / 16;

  fontSizeEm = Math.max(fontSizeEm, 1.7);
  fontSizeEm = Math.min(fontSizeEm, 6);

  return fontSizeEm;
}

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

export const useCountdown = (initialValue = 2000, interval = 100) => {
  const [countdownValue, setCountdownValue] = useState(initialValue);

  useEffect(() => {
    const countdown = setInterval(() => {
      setCountdownValue((prevValue) => {
        const newValue = prevValue - interval;
        if (newValue <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return newValue;
      });
    }, interval);

    // Clear interval on unmount
    return () => clearInterval(countdown);
  }, [interval]);

  return countdownValue;
};

export const arraysAreEqual = (arr1, arr2) => {
  if (arr1?.length !== arr2?.length) return false;

  return arr1.every((value, index) => value === arr2[index]);
};

export const parseDate = (dateString) => {
  return moment(dateString, "ddd MMM D YYYY").toString();
};

export const dateId = (dateString) => {
  return moment(dateString).format("MMDDYY");
};

export const daysBefore = (dateString) => {
  return moment(dateString, "ddd MMM D YYYY").diff(moment(), "days");
};
