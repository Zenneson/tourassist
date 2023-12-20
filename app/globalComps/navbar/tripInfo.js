import { useUser } from "@libs/context";
import { LoadingOverlay } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { getAllTrips } from "./api/getAllTrips";
import TripInfoWrapper, { currentTripAtom } from "./tripInfoWrapper";

export default function TripInfo() {
  const [tripsLoaded, setTripsLoaded] = useState(false);
  const { user } = useUser();
  const currentTrip = useAtomValue(currentTripAtom);
  getAllTrips(user.email).then((data) => setTripsLoaded(data));

  return (
    <>
      <LoadingOverlay
        visible={!tripsLoaded || currentTrip === undefined}
        ml={310}
        transitionProps={{
          duration: 1500,
          timingFunction: "ease",
        }}
        overlayProps={{
          backgroundOpacity: 1,
        }}
      />
      <TripInfoWrapper allTrips={tripsLoaded} />
    </>
  );
}
