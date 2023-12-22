import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// App State
export const activeAtom = atom(-1);
export const panelAtom = atom(false);
export const mainMenuAtom = atom(false);
export const listAtom = atom(false);
export const searchOpenedAtom = atom(false);
export const historyAtom = atom(["empty"]);

// Hide Loader State
export const hideLoaderAtom = atom(false);

// Map State
export const areaAtom = atom({ label: "" });
export const placesAtom = atomWithStorage("places", []);

// Trip Page State
export const fundsAtom = atom(0);
export const donationsAtom = atom([]);
export const activeTripData = atom([]);
export const tripImagesAtom = atom([]);
export const tripDescAtom = atom("");
export const travelDateAtom = atom("");
export const updatedDescAtom = atom("");
export const updatesAtom = atom([]);
export const tripDataAtom = atomWithStorage("tripData", []);
