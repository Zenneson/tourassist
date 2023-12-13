import { atom } from "jotai";

// App State
export const activeAtom = atom(-1);
export const panelAtom = atom(false);
export const mainMenuAtom = atom(false);
export const listAtom = atom(false);
export const searchAtom = atom(false);
export const historyAtom = atom(["empty"]);

// Map State
export const areaAtom = atom({ label: "" });
export const placesAtom = atom([]);

// Trip Page State
export const tripDataAtom = atom({});
export const fundsAtom = atom(0);
export const donationsAtom = atom([]);
export const activeTripData = atom([]);
export const tripDescAtom = atom("");
export const travelDateAtom = atom("");
export const updatedDescAtom = atom("");
