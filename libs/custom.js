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
