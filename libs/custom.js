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
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const daysBefore = (dateString) => {
  const inputDate = moment.tz(
    dateString,
    "MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z",
    "UTC"
  );
  inputDate.subtract(1, "days");
  const today = moment.tz("UTC");
  const days = inputDate.diff(today, "days");
  return days;
};
