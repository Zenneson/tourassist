import { useEffect, useState } from "react";
import { firestore } from "./firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { usePrevious } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import {
  ref,
  deleteObject,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import moment from "moment-timezone";

// Fetches data from a given URL using the Fetch API and custom options.
export const fetcher = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Updates a specified field in the Firestore database for a given user.
export const updateField = async (update, user) => {
  const optimisticData = {
    ...user,
    ...update,
  };
  mutate(user?.email, optimisticData, false);
  try {
    await updateDoc(doc(firestore, "users", user.email), update);
    mutate(user?.email);
  } catch (error) {
    mutate(user?.email, user);
    console.error("Failed to update field:", error);
  }
};

// Returns a string representing a date range ending today and extending back 'n' days.
export const dateRangeFunc = (n) => {
  return moment().subtract(n, "days").format("MMMM Do YYYY, h:mm:ss A [EST]");
};

// Parses a custom date string into a JavaScript Date object, considering the UTC timezone.
export const parseCustomDate = (dateString) => {
  if (!dateString) return null;
  const formatString = "MMMM D YYYY hh:mm A Z";
  const dateMoment = moment.tz(dateString, formatString, "UTC");
  if (!dateMoment.isValid()) {
    return null;
  }
  return dateMoment.toDate();
};

// Sums up numerical values in an array, primarily used for aggregating amounts.
export const sumAmounts = (array) => {
  if (!Array.isArray(array)) {
    return 0;
  }

  return array.reduce((total, item) => {
    return total + (Number(item.amount) || 0);
  }, 0);
};

// Converts a given timestamp to a formatted string in Eastern Standard Time (EST).
export const estTimeStamp = (timeStamp) => {
  let dateStr = timeStamp;
  let dateInEST = moment(dateStr)
    .tz("America/New_York")
    .format("MMMM Do YYYY, hh:mm:ss A");

  return dateInEST + " EST";
};

// Checks if two arrays are equal in terms of length and content.
export const arraysAreEqual = (arr1, arr2) => {
  if (arr1?.length !== arr2?.length) return false;

  return arr1.every((value, index) => value === arr2[index]);
};

// Parses and formats a date string into a more readable format.
export const parseDate = (dateString) => {
  return moment(dateString, "ddd MMM D YYYY").toString();
};

// Generates a unique identifier based on the date, formatted as MMDDYY.
export const dateId = (dateString) => {
  return moment(dateString).format("MMDDYY");
};

// Generates a timestamp formatted as MMDDYYHHmmss, useful for creating unique IDs.
export const timeStamper = () => {
  return moment().format("MMDDYYHHmmss");
};

// Formats a given date string into a more readable format with the full month name.
export const dateFormat = (dateString) => {
  return moment(dateString).format("MMMM D, YYYY");
};

// Formats a date string to include the full month name, day, and year.
export const formatDateFullMonth = (dateString) => {
  const date = moment(dateString, "M/D");
  return date.format("MMMM D, YYYY");
};

// Calculates the number of days from a given date string to the current date.
export const daysBefore = (dateString) => {
  return moment(dateString, "MMMM D, YYYY")
    .startOf("day")
    .diff(moment().startOf("day"), "days")
    .toString();
};

// Adds commas to a numerical string for better readability, particularly for large numbers.
export const addComma = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Formats a numerical value as a donation amount, ensuring two decimal places and comma separation.
export const formatDonation = (num) => {
  if (num === null || num === undefined) return;

  let [integerPart, fractionalPart] = num?.toFixed(2).toString().split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!fractionalPart) {
    fractionalPart = "00";
  } else if (fractionalPart.length === 1) {
    fractionalPart += "0";
  }

  return `${integerPart}.${fractionalPart}`;
};

// Truncates a string to a specified length and adds ellipsis if it exceeds that length.
export const addEllipsis = (string, num) => {
  if (string && string.length > num) {
    return string.substring(0, num) + "...";
  } else {
    return string;
  }
};

// Formats a phone number string into a more readable format with parentheses and hyphens.
export const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phoneNumberString;
};

// Ensures that a given string starts with a specified symbol.
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

// Custom hook for creating a countdown timer, decreasing from an initial value at specified intervals.
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

// Firebase Storage: Deletes an image from Firebase storage based on provided parameters.
const storage = getStorage();
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

// Filters out an image by name from an array of images, also handles deletion from Firebase storage.
export const removeImageByName = (images, imageName, page, tripId, user) => {
  if (page.hasOwnProperty("title"))
    deleteImageFromStorage(imageName, tripId, user);
  return images.filter((image) => image.name !== imageName);
};

// Extracts the base file name from a full string, typically a file path or URL.
export const fileNameString = (string) => {
  const lastPeriodIndex = string.lastIndexOf(".");
  return lastPeriodIndex !== -1 ? string.substring(0, lastPeriodIndex) : string;
};

// Extracts the file name from a Firebase Storage URL.
export const extractFileName = (url) => {
  const pngIndex = url.lastIndexOf(".png?alt");
  if (pngIndex === -1) return null;
  const partBeforePngAlt = url.substring(0, pngIndex);
  const lastSlashIndex = partBeforePngAlt.lastIndexOf("%2F");
  if (lastSlashIndex === -1) return null;
  const filename = partBeforePngAlt.substring(lastSlashIndex + 3) + ".png";
  return filename;
};

// Creates an array of image objects from an array of image URLs.
export const createImageObjects = (imageURLs) => {
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

// Handles the upload of images to Firebase Storage and returns their download URLs.
const handleImages = (images, tripId, user) => {
  return images.map(async (imageDataUrl) => {
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
};

// Saves trip information to Firestore, including handling image uploads.
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
      const imageUploadPromises = handleImages(images, createdId, user);

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
      sessionStorage.removeItem("placeData");
      sessionStorage.removeItem("places");
      sessionStorage.removeItem("images");
      sessionStorage.removeItem("tripDesc");
      sessionStorage.removeItem("totalCost");

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Updates the information of an edited trip in Firestore, including image handling.
export const updateEditedTrip = async (
  user,
  tripData,
  tripId,
  images,
  newDesc,
  travelDate,
  title
) => {
  const optimisticData = {
    images,
    tripDesc: newDesc,
    travelDate: dateFormat(travelDate),
  };

  mutate(title, optimisticData, false);

  try {
    const imageUploadPromises = handleImages(images, tripId, user);
    const imageURLs = await Promise.all(imageUploadPromises);
    const imageObjects = createImageObjects(imageURLs);

    const tripRef = doc(firestore, "users", user, "trips", tripId);
    await updateDoc(tripRef, {
      images: imageObjects,
      travelDate: dateFormat(travelDate),
      tripDesc: newDesc,
    });

    mutate(title);
  } catch (error) {
    mutate(title, tripData);
    console.error("Failed to update trip:", error);
  }
};

// Calculates the time elapsed since a given timestamp, returning a human-readable string.
export const timeSince = (timeString) => {
  const then = new Date(timeString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)} days`;
  } else {
    return `${Math.floor(diffInSeconds / 2592000)} months`;
  }
};

// Custom hook to keep track of the page history in a Next.js application using the useRouter hook.
export const usePageHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const prevPath = usePrevious(router.asPath);

  useEffect(() => {
    if (prevPath && prevPath !== router.asPath) {
      setHistory((currentHistory) => [...currentHistory, prevPath]);
    }
  }, [router.asPath, prevPath]);

  return history;
};
