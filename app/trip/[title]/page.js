"use client";
import PageLoader from "@globalComps/pageLoader/pageLoader";
import { useState } from "react";
import useSWR from "swr";
import { getTripData } from "./api/route";
import TripWrapper from "./comps/tripWrapper";

export default function Trippage(props) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const title = props.params.title;
  const { data: tripData, error } = useSWR(title, () => getTripData(title));
  if (error) console.error(error);

  return (
    <>
      <PageLoader contentLoaded={imagesLoaded && tripData} />
      <TripWrapper
        title={title}
        dbTripData={tripData}
        setImagesLoaded={setImagesLoaded}
      />
    </>
  );
}
