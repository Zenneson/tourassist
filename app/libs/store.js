import { create } from "zustand";
import { persist } from "zustand/middleware";

const sessionStore = {
  getItem: (name) => sessionStorage.getItem(name),
  setItem: (name, value) => sessionStorage.setItem(name, value),
  removeItem: (name) => sessionStorage.removeItem(name),
};

// App State
export const useAppState = create((set) => ({
  active: -1,
  setActive: (value) => set({ active: value }),
  panelOpened: false,
  setPanelOpened: (value) => set({ panelOpened: value }),
  mainMenuOpened: false,
  setMainMenuOpened: (value) => set({ mainMenuOpened: value }),
  listOpened: false,
  setListOpened: (value) => set({ listOpened: value }),
  searchOpened: false,
  setSearchOpened: (value) => set({ searchOpened: value }),
  history: ["empty"],
  setHistory: (value) => set({ history: value }),
}));

// Hide Loader State
export const useLoaderState = create((set) => ({
  hideLoader: false,
  setHideLoader: (value) => set({ hideLoader: value }),
}));

// Map State
export const useMapState = create(
  persist(
    (set) => ({
      area: { label: "" },
      setArea: (value) => set({ area: value }),
      places: [],
      setPlaces: (value) => set({ places: value }),
    }),
    {
      name: "mapState",
      storage: sessionStore,
      partialize: (state) => ({ places: state.places }),
    }
  )
);

// Trip Page State
export const useTripState = create(
  persist(
    (set) => ({
      funds: 0,
      setFunds: (value) => set({ funds: value }),
      donations: [],
      setDonations: (value) => set({ donations: value }),
      activeTrip: [],
      setActiveTrip: (value) => set({ activeTripData: value }),
      tripImages: [],
      setTripImages: (value) => set({ tripImages: value }),
      tripDesc: "",
      setTripDesc: (value) => set({ tripDesc: value }),
      travelDate: "",
      setTravelDate: (value) => set({ travelDate: value }),
      updatedDesc: "",
      setUpdatedDesc: (value) => set({ updatedDesc: value }),
      updates: [],
      setUpdates: (value) => set({ updates: value }),
      tripData: [{}],
      setTripData: (value) => set({ tripData: value }),
    }),
    {
      name: "tripState",
      storage: sessionStore,
      partialize: (state) => ({ tripData: state.tripData }),
    }
  )
);

// Trip Planner State
export const useTripPlannerState = create((set) => ({
  tripTypes: [],
  travelers: 1,
  setTravelers: (travelers) => set({ travelers }),
  roundTrip: false,
  setRoundTrip: (roundTrip) => set({ roundTrip }),
  plannerImages: [],
  setPlannerImages: (plannerImages) => set({ plannerImages }),
  plannerTripTitle: "",
  setPlannerTripTitle: (plannerTripTitle) => set({ plannerTripTitle }),
  plannerTripDesc: "",
  setPlannerTripDesc: (plannerTripDesc) => set({ plannerTripDesc }),
  startLocale: "",
  setStartLocale: (startLocale) => set({ startLocale }),
}));
