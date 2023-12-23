import { useUser } from "@libs/context";
import { LoadingOverlay } from "@mantine/core";
import useSWR from "swr";
import { getAllTrips } from "./api/getAllTrips";
import TripInfoWrapper from "./tripInfoWrapper";

export default function TripInfo() {
  const { user } = useUser();
  const { data: trips, error } = useSWR("trips", () => getAllTrips(user.email));

  return (
    <>
      <LoadingOverlay
        visible={!trips && !error}
        ml={310}
        w={620}
        transitionProps={{
          duration: 1000,
          timingFunction: "ease",
        }}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 5,
        }}
      />
      <TripInfoWrapper trips={trips} />
    </>
  );
}