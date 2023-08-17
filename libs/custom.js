import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";
import { doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  ref,
  deleteObject,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
const moment = require("moment-timezone");

const storage = getStorage();

export function useUserData() {
  const [userAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userAuth?.email) {
      console.log("Searching for user data...");
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
        console.error("Error getting document:", error);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [userAuth]); // The effect hook depends on userAuth
  return userData;
}

export const estTimeStamp = (timeStamp) => {
  let dateStr = timeStamp;
  let dateInEST = moment(dateStr)
    .tz("America/New_York")
    .format("MMMM Do YYYY, hh:mm A");

  return dateInEST + " EST";
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

export const timeStamper = () => {
  return moment().format("MMDDYYHHmmss");
};

export const dateFormat = (dateString) => {
  return moment(dateString).format("MMMM D, YYYY");
};

export const daysBefore = (dateString) => {
  return moment(dateString, "MMMM D, YYYY")
    .startOf("day")
    .diff(moment().startOf("day"), "days")
    .toString();
};

export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const addEllipsis = (string, num) => {
  if (string && string.length > num) {
    return string.substring(0, num) + "...";
  } else {
    return string;
  }
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

export const deleteImageFromStorage = (imageName, tripId, user) => {
  const filePath = `images/${user.email}/${tripId}/${imageName}`;
  const storageRef = ref(storage, filePath);
  deleteObject(storageRef)
    .then(() => {
      console.log("Image deleted from Storage");
    })
    .catch((error) => {
      console.error("Failed to delete image from Storage:", error);
    });
};

export const removeImageByName = (images, imageName, page, tripId, user) => {
  if (page.hasOwnProperty("title"))
    deleteImageFromStorage(imageName, tripId, user);
  return images.filter((image) => image.name !== imageName);
};

export const fileNameString = (string) => {
  const lastPeriodIndex = string.lastIndexOf(".");
  return lastPeriodIndex !== -1 ? string.substring(0, lastPeriodIndex) : string;
};

export const extractFileName = (url) => {
  console.log("URL: ", url);
  const pngIndex = url.lastIndexOf(".png?alt");
  if (pngIndex === -1) return null;
  const partBeforePngAlt = url.substring(0, pngIndex);
  const lastSlashIndex = partBeforePngAlt.lastIndexOf("%2F");
  if (lastSlashIndex === -1) return null;
  const filename = partBeforePngAlt.substring(lastSlashIndex + 3) + ".png";
  return filename;
};

export const createImageObjects = (imageURLs) => {
  console.log("imageURLs: ", imageURLs);
  console.log(typeof imageURLs);
  return imageURLs.map((imageURL) => {
    if (typeof imageURL === "object") {
      return imageURL;
    }
    return {
      name: extractFileName(imageURL),
      file: imageURL,
    };
  });
};

export const saveToDB = async (
  tripTitle,
  images,
  tripDesc,
  startLocale,
  travelers,
  travel_date,
  roundTrip,
  costsObj,
  createdId,
  costsSum,
  destinations,
  user
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUploadPromises = images.map(async (imageDataUrl) => {
        if (imageDataUrl.file.startsWith("data:")) {
          const fileName = fileNameString(imageDataUrl.name);
          const storageRef = ref(
            storage,
            `images/${user}/${createdId}/${fileName}.png`
          );
          const snapshot = await uploadString(
            storageRef,
            imageDataUrl.file,
            "data_url",
            {
              contentType: "image/png",
              name: fileName,
            }
          );
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL;
        }
      });

      const imageURLs = await Promise.all(imageUploadPromises);

      const imageObjects = createImageObjects(imageURLs);

      await setDoc(doc(firestore, "users", user, "trips", createdId), {
        creationTime: estTimeStamp(new Date()),
        tripTitle: tripTitle,
        images: imageObjects,
        tripDesc: tripDesc,
        startLocale: startLocale,
        travelers: travelers,
        travelDate: travel_date,
        roundTrip: roundTrip,
        costsObj: costsObj,
        costsSum: costsSum,
        destinations: destinations,
        tripId: createdId,
        user: user,
      });
      sessionStorage.removeItem("placeDataState");
      sessionStorage.removeItem("places");
      sessionStorage.removeItem("images");
      sessionStorage.removeItem("tripDesc");
      sessionStorage.removeItem("totalCost");
      sessionStorage.removeItem("renderState");

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateEditedTrip = async (
  user,
  tripId,
  images,
  newDesc,
  travelDate
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUploadPromises = images.map(async (imageDataUrl) => {
        if (imageDataUrl.file.includes("firebasestorage")) return imageDataUrl;
        if (imageDataUrl.file.startsWith("data:")) {
          const fileName = fileNameString(imageDataUrl.name);
          const storageRef = ref(
            storage,
            `images/${user}/${tripId}/${fileName}.png`
          );
          const snapshot = await uploadString(
            storageRef,
            imageDataUrl.file,
            "data_url",
            {
              contentType: "image/png",
              name: fileName,
            }
          );
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL;
        }
      });

      const imageURLs = await Promise.all(imageUploadPromises);

      const imageObjects = createImageObjects(imageURLs);

      console.log("imageObjects: ", imageObjects);
      console.log("imageURLs: ", imageURLs);

      const tripRef = doc(firestore, "users", user, "trips", tripId);
      updateDoc(tripRef, {
        images: imageObjects,
        travelDate: dateFormat(travelDate),
        tripDesc: newDesc,
      });
      resolve(imageObjects);
    } catch (error) {
      reject(error);
    }
  });
};
