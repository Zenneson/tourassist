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

export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
