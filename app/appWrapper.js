"use client";
import { MantineProvider, AppShell, ScrollArea } from "@mantine/core";
import { usePathname } from "next/navigation";
import { Notifications } from "@mantine/notifications";
import { MapProvider } from "react-map-gl";
import { RouterTransition } from "./comps/routertransition";
import { UserProvider, StateProvider } from "./libs/context";
import { tourTheme } from "./libs/tourTheme";
import ChatBot from "./comps/chatbot/chatBot";
import SearchModal from "./comps/navbar/searchModal";
import MainMenu from "./comps/navbar/mainMenu";

export default function AppWrapper({ children }) {
  const pathname = usePathname();

  // TODO: Make this a server action
  // if the user leaves the trip planner page and is not on the title page, clear the trip data
  // const checkHistoryForTripData = (pageHistory) => {
  //   const isTripPlannerLast =
  //     pageHistory[pageHistory.length - 1] === "/tripPlanner";
  //   const isNotTripPlanner = router.pathname !== "/tripPlanner";
  //   const isNotTitlePage = router.pathname !== "/[title]";

  //   if (isTripPlannerLast && isNotTitlePage && isNotTripPlanner) {
  //     if (placeData.length > 1) {
  //       let tempData = JSON.parse(JSON.stringify(placeData));

  //       let finalPlace = tempData[tempData.length - 1];
  //       let isReturnFlight = finalPlace && finalPlace.returnFlight;

  //       if (isReturnFlight) {
  //         tempData.splice(tempData.length - 1, 1);
  //       }
  //       setPlaceData(tempData);
  //       setRoundTrip(false);
  //       setStartLocale("");
  //     }
  //   }
  // };

  return (
    <MantineProvider theme={tourTheme} defaultColorScheme="dark">
      <UserProvider>
        <StateProvider>
          <Notifications position="top-center" zIndex={9999} limit={1} />
          <SearchModal />
          <MapProvider>
            <AppShell
              transitionDuration={300}
              transitionTimingFunction="ease"
              padding="none"
              header={{ height: 1 }}
              component={pathname !== "/map" && ScrollArea}
              style={{
                position: "absolute",
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
              }}
            >
              {pathname !== "/" && <ChatBot />}
              <AppShell.Header>
                <RouterTransition />
                {pathname !== "/" && <MainMenu />}
              </AppShell.Header>
              {children}
            </AppShell>
          </MapProvider>
        </StateProvider>
      </UserProvider>
    </MantineProvider>
  );
}
