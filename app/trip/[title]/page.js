"use client";
import PageLoader from "@globalComps/pageLoader/pageLoader";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import useSWR from "swr";
import { getTripData } from "./api/route";
import TripWrapper from "./comps/tripWrapper";

export const tripDataLoadedAtom = atom(false);
export const imagesLoadedAtom = atom(false);

export default function Trippage(props) {
  const imagesLoaded = useAtomValue(imagesLoadedAtom);
  const [tripDataLoaded, setTripDataLoaded] = useAtom(tripDataLoadedAtom);
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
