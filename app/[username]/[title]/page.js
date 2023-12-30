"use client";
import PageLoader from "@globalComps/pageLoader/pageLoader";
import { useEffect } from "react";
import useSWR from "swr";
import { create } from "zustand";
import { getTripData } from "./api/route";
import TripWrapper from "./comps/tripWrapper";

export const useTripDataLoaded = create((set) => ({
  tripDataLoaded: false,
  setTripDataLoaded: (value) => set({ tripDataLoaded: value }),
}));

export const useImagesLoaded = create((set) => ({
  imagesLoaded: false,
  setImagesLoaded: (value) => set({ imagesLoaded: value }),
}));

export default function Trippage(props) {
  const imagesLoaded = useImagesLoaded();
  const { tripDataLoaded, setTripDataLoaded } = useTripDataLoaded();
  const title = props.params.title;
  const { data: tripData, error } = useSWR(title, () => getTripData(title));
  if (error) console.error(error);

  useEffect(() => {
    if (tripData && tripData.length > 0) {
      setTripDataLoaded(true);
    }
  }, [tripData]);

  return (
    <>
      <PageLoader contentLoaded={imagesLoaded || tripDataLoaded || !error} />
      <TripWrapper title={title} dbTripData={tripData} />
    </>
  );
}
