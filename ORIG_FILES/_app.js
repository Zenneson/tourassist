import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { UserProvider } from "@libs/context";
import {
  AppShell,
  MantineProvider,
  ScrollArea,
  createTheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/core/styles/global.css";
import { useSessionStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { setCookie } from "cookies-next";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import "node_modules/focus-visible/dist/focus-visible.min.js";
import { useEffect, useState } from "react";
import { MapProvider } from "react-map-gl";
import "typeface-montserrat";
import ChatBot from "../app/globalComps/chatbot/chatBot";
import DropDown from "../app/globalComps/dropdown/dropdown";
import { RouterTransition } from "../app/globalComps/loading";
import MainMenu from "../app/navbar/mainMenu";
import SearchModal from "../app/navbar/searchModal";
import "./global.css";

const tourTheme = createTheme({
  focusRing: "auto",
  colors: {
    dark: [
      "#C1C2C5",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#131314",
      "#101113",
      "#0b0c0d",
      "#050506",
      "#020202",
      "#010101",
    ],
    blue: [
      "#4DFFFF",
      "#41FDFF",
      "#3AEBFD",
      "#33D9F8",
      "#2DC7F3",
      "#1C7BB2",
      "#186CA6",
      "#145D9A",
      "#104E8E",
      "#0D3F82",
    ],
  },
  cursorType: "pointer",
  primaryColor: "blue",
  primaryShade: { light: 5, dark: 9 },
  components: {
    Combobox: {
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    InputBase: {
      defaultProps: {
        variant: "filled",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    Input: {
      defaultProps: {
        variant: "filled",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    TextInput: {
      defaultProps: {
        variant: "filled",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    NumberInput: {
      defaultProps: {
        variant: "filled",
        suffix: ".00",
        thousandSeparator: ",",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
        input: {
          textAlign: "right",
        },
      },
    },
    ScrollArea: {
      defaultProps: {
        scrollbarSize: 8,
        type: "hover",
      },
    },
    Switch: {
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    Button: {
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
        arrowSize: 10,
        openDelay: 1500,
        closeDelay: 0,
        events: { hover: true, focus: true, touch: false },
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    LoadingOverlay: {
      defaultProps: {
        loaderProps: {
          type: "bars",
        },
      },
    },
  },
  defaultRadius: 3,
  headings: {
    fontFamily: "Montserrat, sans-serif",
  },
  fontFamily: "Open Sans, sans-serif",
  TypographyStylesProvider: {
    fontFamily: "Homemade Apple",
  },
});

export default function App(props) {
  const { Component, pageProps } = props;
  const auth = getAuth();
  const [active, setActive] = useState(-1);
  const [panelShow, setPanelShow] = useState(false);
  const [mainMenuOpened, setMainMenuOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const [dropDownOpened, setDropDownOpened] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const router = useRouter();

  const [placeData, setPlaceData] = useSessionStorage({
    key: "places",
    defaultValue: [],
  });
  const [roundTrip, setRoundTrip] = useSessionStorage({
    key: "roundTrip",
    defaultValue: false,
  });
  const [startLocale, setStartLocale] = useSessionStorage({
    key: "startLocale",
    defaultValue: "",
  });

  // if the user leaves the trip planner page and is not on the title page, clear the trip data
  const checkHistoryForTripData = (pageHistory) => {
    const isTripPlannerLast =
      pageHistory[pageHistory.length - 1] === "/tripPlanner";
    const isNotTripPlanner = router.pathname !== "/tripPlanner";
    const isNotTitlePage = router.pathname !== "/[title]";

    if (isTripPlannerLast && isNotTitlePage && isNotTripPlanner) {
      if (placeData.length > 1) {
        let tempData = JSON.parse(JSON.stringify(placeData));

        let finalPlace = tempData[tempData.length - 1];
        let isReturnFlight = finalPlace && finalPlace.returnFlight;

        if (isReturnFlight) {
          tempData.splice(tempData.length - 1, 1);
        }
        setPlaceData(tempData);
        setRoundTrip(false);
        setStartLocale("");
      }
    }
  };

  useEffect(() => {
    setCookie("history", pageHistory);

    checkHistoryForTripData(pageHistory);
  }, [pageHistory]);

  return (
    <MantineProvider theme={tourTheme} defaultColorScheme="dark">
      <Head>
        <title>TouraSSist</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <UserProvider>
        <Notifications position="top-center" zIndex={9999} limit={1} />
        <SearchModal setSearchOpened={setSearchOpened} />
        <DropDown
          dropDownOpened={dropDownOpened}
          setDropDownOpened={setDropDownOpened}
        />
        <MapProvider>
          <AppShell
            transitionDuration={300}
            transitionTimingFunction="ease"
            padding="none"
            header={{ height: 1 }}
            component={router.pathname !== "/map" && ScrollArea}
            style={{
              position: "absolute",
              height: "100vh",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            <AppShell.Header>
              <RouterTransition />
              <MainMenu
                active={active}
                setActive={setActive}
                panelShow={panelShow}
                setPanelShow={setPanelShow}
                mainMenuOpened={mainMenuOpened}
                setMainMenuOpened={setMainMenuOpened}
                setListOpened={setListOpened}
                searchOpened={searchOpened}
                setSearchOpened={setSearchOpened}
                setDropDownOpened={setDropDownOpened}
              />
            </AppShell.Header>
            {router.pathname !== "/" && <ChatBot pageHistory={pageHistory} />}
            <Component
              {...pageProps}
              panelShow={panelShow}
              setPanelShow={setPanelShow}
              mainMenuOpened={mainMenuOpened}
              setMainMenuOpened={setMainMenuOpened}
              listOpened={listOpened}
              setListOpened={setListOpened}
              searchOpened={searchOpened}
              dropDownOpened={dropDownOpened}
              setDropDownOpened={setDropDownOpened}
              mapLoaded={mapLoaded}
              setMapLoaded={setMapLoaded}
              auth={auth}
            />
          </AppShell>
        </MapProvider>
      </UserProvider>
    </MantineProvider>
  );
}
