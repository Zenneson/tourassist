"use client";
import { useMapState } from "@libs/store";
import TripPlannerWrapper from "./comps/tripPlannerWrapper";

export default function TripPlanner() {
  const { places, setPlaces } = useMapState();

  // if (!places || places.length === 0)
  //   return <PageLoader contentLoaded={false} />;

  return <TripPlannerWrapper placeData={places} setPlaceData={setPlaces} />;
}
