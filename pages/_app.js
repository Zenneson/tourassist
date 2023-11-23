import "@mantine/core/styles/global.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";
import Head from "next/head";
import { useState } from "react";
import {
  MantineProvider,
  createTheme,
  AppShell,
  ScrollArea,
} from "@mantine/core";
import { useRouter } from "next/router";
import { Notifications } from "@mantine/notifications";
import { MapProvider } from "react-map-gl";
import { RouterTransition } from "../comps/routertransition";
import { getAuth } from "firebase/auth";
import { UserProvider } from "../libs/context";
import StateProviderComp from "../libs/stateVars";
import colorSchemeManager from "../libs/colorSchemeManager";
import SearchModal from "../comps/navbar/searchModal";
import MainMenu from "../comps/navbar/mainMenu";
import DropDown from "../comps/dropdown/dropdown";
require("typeface-montserrat");
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

const localColorScheme = colorSchemeManager({ key: "mantine-color-scheme" });

const tourTheme = createTheme({
  focusRing: "never",
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
        openDelay: 750,
        events: { hover: true, focus: true, touch: false },
      },
      styles: {
        root: {
          transition: "all 200ms ease",
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

  return (
    <StateProviderComp>
      <MantineProvider
        theme={tourTheme}
        defaultColorScheme="dark"
        colorSchemeManager={localColorScheme}
      >
        <Head>
          <title>TouraSSist</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <UserProvider>
          <Notifications position="top-center" zIndex={9999} limit={1} />
          <SearchModal
            searchOpened={searchOpened}
            setSearchOpened={setSearchOpened}
          />
          <DropDown
            dropDownOpened={dropDownOpened}
            setDropDownOpened={setDropDownOpened}
          />
          <MapProvider>
            <AppShell
              padding="none"
              header={{ height: 1 }}
              component={router.pathname !== "/map" && ScrollArea}
              style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
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
    </StateProviderComp>
  );
}
