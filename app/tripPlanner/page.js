"use client";
import { isEqual } from "@libs/custom";
import { useMapState } from "@libs/store";
import { useSessionStorage } from "@mantine/hooks";
import { useEffect } from "react";
import TripPlannerWrapper from "./comps/tripPlannerWrapper";

export default function TripPlanner() {
  const { places } = useMapState();
  const [sessionPlaces, setSessionPlaces] = useSessionStorage({
    key: "sessionPlaces",
    initialValue: places || [],
  });

  useEffect(() => {
    if (isEqual(sessionPlaces, places)) return;
    setSessionPlaces(places);
  }, [places, sessionPlaces]);

  return (
    <TripPlannerWrapper
      placeData={sessionPlaces}
      setPlaceData={setSessionPlaces}
    />
  );
}
