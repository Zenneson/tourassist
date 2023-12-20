import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";

export const noCosts = {
  title: "Trip Cost Missing",
  message: "Add your trip costs.",
  color: "red",
  icon: <IconAlertTriangle size={17} />,
  autoClose: 2500,
};

export const noTitle = {
  title: "Missing Trip Title",
  message: "Please provide a title for your trip.",
  color: "red",
  icon: <IconAlertTriangle size={17} />,
  autoClose: 2500,
};

export const titleIsShort = {
  title: "Trip Title is Short",
  message: "Please provide a longer Title for your trip.",
  color: "orange",
  icon: <IconAlertTriangle size={17} />,
  autoClose: 2500,
};

export const noDesc = {
  title: "Add details about your trip",
  message: "Please provide a description of your trip below.",
  color: "red",
  icon: <IconAlertTriangle size={17} />,
  autoClose: 2500,
};

export const descIsShort = {
  title: "Description is Short",
  message: "Please provide more information about your trip.",
  color: "orange",
  icon: <IconAlertTriangle size={17} />,
  autoClose: 2500,
};

export const noAccountInfo = {
  title: "Account Information Required",
  message: "Please provide your account information below.",
  color: "orange",
  icon: <IconAlertTriangle size={17} />,
  autoClose: 2500,
};

export const createTrip = {
  id: "creating-trip",
  title: "Creating Trip Campaign...",
  message: "Please wait while we create your trip campaign.",
  color: "green",
  loading: true,
  withCloseButton: false,
  autoClose: false,
};

export const tripMade = {
  id: "creating-trip",
  title: "Trip Campaign Created!",
  message: "Welcome to your trip Campaign!",
  color: "green",
  loading: false,
  autoClose: 5000,
  icon: <IconCheck size={17} />,
};

export const tripFailed = {
  id: "creating-trip",
  title: "Failed to Create Trip Campaign",
  message:
    "There was an error while creating your trip campaign. Please try again later.",
  color: "red",
  loading: false,
  autoClose: 5000,
  icon: <IconCheck size={17} />,
};

export const addUpdateTitle = {
  color: "orange",
  icon: <IconAlertTriangle size={20} />,
  title: "Please add a title",
  autoClose: 3000,
};

export const addUpdateContent = {
  color: "orange",
  icon: <IconAlertTriangle size={20} />,
  title: "You have not added any text to your update",
  autoClose: 3000,
};

export const postingUpdate = {
  id: "postingUpdate",
  color: "green",
  icon: <IconCheck size={20} />,
  title: "Update posted!",
  autoClose: false,
  loading: true,
  withCloseButton: false,
};

export const noDonation = {
  color: "orange",
  icon: <IconAlertTriangle size={20} />,
  title: "Please add a donation amount",
  autoClose: 3000,
};

export const updatePosted = {
  id: "postingUpdate",
  color: "green",
  icon: <IconCheck size={20} />,
  title: "Update posted!",
  autoClose: 3000,
  loading: false,
  withCloseButton: true,
};

export const maxReached = {
  color: "orange",
  icon: <IconAlertTriangle size={20} />,
  title: "$5,000 is the maximum donation amount",
  autoClose: 3000,
};

export const noDonorName = {
  color: "orange",
  icon: <IconAlertTriangle size={20} />,
  title: "Please add your name or choose to stay anonymous",
  autoClose: 3000,
};

export const paymentError = (error, dark) => {
  return {
    color: "orange",
    title: "Payment Error",
    message: "Please try again. Error: " + error.message,
    autoClose: false,
    icon: <IconAlertTriangle size={20} />,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };
};

export const newAccount = (form) => {
  return {
    color: "green",
    icon: <IconCheck size={20} />,
    title: "Welcome",
    message: `${form.values.firstName} ${form.values.lastName}'s account has been created.`,
  };
};

export const emailInvalid = (form) => {
  return {
    color: "red",
    icon: <IconX size={20} />,
    title: "Invalid Email",
    message: `${form.values.email} is not a valid email address.`,
  };
};

export const alreadyExists = (form) => {
  return {
    color: "red",
    icon: <IconX size={20} />,
    title: "Email already in use",
    message: `${form.values.email} is linked to another account.`,
  };
};

export const userNotFound = (form) => {
  return {
    color: "red",
    icon: <IconX size={20} />,
    title: "User not found",
    message: `An account for ${form.values.email} does not exist.`,
  };
};

export const loggedIn = (dark, user) => {
  return {
    color: "green",
    icon: <IconCheck size={20} />,
    title: "Welcome Back",
    autoClose: 2500,
    message: `${user.email} is logged in`,
  };
};

export const wrongPassword = {
  color: "red",
  icon: <IconX size={20} />,
  title: "Wrong password",
  message: `The password you entered is incorrect.`,
};

export const placeExists = (startLocale) => {
  return {
    title: "Already set as destination",
    message: `${startLocale} is set as a destination. Please choose another location.`,
    color: "orange",
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
  };
};
