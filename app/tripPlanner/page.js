"use client";
import { useMapState } from "@libs/store";
import { createFormContext } from "@mantine/form";
import TripPlannerWrapper from "./comps/tripPlannerWrapper";

export const [FormProvider, useFormContext, useForm] = createFormContext();

export default function TripPlanner() {
  const { places, setPlaces } = useMapState();

  // if (!places || places.length === 0)
  //   return <PageLoader contentLoaded={false} />;

  return <TripPlannerWrapper placeData={places} setPlaceData={setPlaces} />;
}
