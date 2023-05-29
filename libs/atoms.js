import { atom } from "recoil";

export const moneyTabState = atom({
  key: "moneyTabState",
  default: "finances",
});

export const profileLinkState = atom({
  key: "profileLinkState",
  default: -1,
});

export const profileShowState = atom({
  key: "profileShowState",
  default: false,
});

export const profileOpenedState = atom({
  key: "profileOpenedState",
  default: false,
});

export const listOpenedState = atom({
  key: "listOpenedState",
  default: false,
});

export const searchOpenedState = atom({
  key: "searchOpenedState",
  default: false,
});

export const mapLoadState = atom({
  key: "mapLoadState",
  default: false,
});

export const placeListState = atom({
  key: "placeListState",
  default: [],
});

export const loginOpenedState = atom({
  key: "loginOpenedState",
  default: false,
});

export const editContentModalState = atom({
  key: "editContentModalState",
  default: false,
});

export const editUpdateState = atom({
  key: "editUpdateState",
  default: "",
});

export const addTripDecriptionState = atom({
  key: "addTripDecriptionState",
  default: false,
});

export const addUpdateDecriptionState = atom({
  key: "addUpdateDecriptionState",
  default: false,
});

export const donateState = atom({
  key: "donateState",
  default: false,
});
