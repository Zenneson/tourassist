"use client";
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
    if (sessionPlaces && sessionPlaces.length === 0 && places.length > 0)
      setSessionPlaces(places);
  }, [places, sessionPlaces, setSessionPlaces]);

  return (
    <TripPlannerWrapper
      placeData={sessionPlaces}
      setPlaceData={setSessionPlaces}
    />
  );
}
