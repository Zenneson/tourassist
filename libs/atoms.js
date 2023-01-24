import { atom } from "recoil";

export const visibleState = atom({
  key: "visibleState",
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

export const placeSearchState = atom({
  key: "placeSearchState",
  default: true,
});

export const mapLoadState = atom({
  key: "mapLoadState",
  default: true,
});

export const placeListState = atom({
  key: "placeListState",
  default: [],
});

export const infoOpenedState = atom({
  key: "infoOpenedState",
  default: false,
});

export const loginOpenedState = atom({
  key: "loginOpenedState",
  default: false,
});

export const loginTypeState = atom({
  key: "loginTypeState",
  default: "login",
});
