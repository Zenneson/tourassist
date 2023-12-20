import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// App State
export const activeAtom = atom(-1);
export const panelAtom = atom(false);
export const mainMenuAtom = atom(false);
export const listAtom = atom(false);
export const searchOpenedAtom = atom(false);
export const historyAtom = atom(["empty"]);

// Map State
export const areaAtom = atom({ label: "" });
export const placesAtom = atom([]);

// Trip Page State
export const fundsAtom = atom(0);
export const donationsAtom = atom([]);
export const activeTripData = atom([]);
export const tripImagesAtom = atom([]);
export const tripDescAtom = atom("");
export const travelDateAtom = atom("");
export const updatedDescAtom = atom("");
export const updatesAtom = atom([]);
export const tripDataAtom = atomWithStorage("tripData", [], {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, newValue) =>
    sessionStorage.setItem(key, JSON.stringify(newValue)),
  removeItem: (key) => sessionStorage.removeItem(key),
});
