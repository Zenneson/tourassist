import Head from "next/head";
import { getAuth } from "firebase/auth";
import { app } from "../libs/firebase";
import { useState } from "react";
import { MantineProvider, AppShell } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterTransition } from "../comps/routertransition";
import SearchModal from "../comps/searchModal";
import MainMenu from "../comps/mainMenu";
require("typeface-montserrat");
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

export default function App(props) {
  const { Component, pageProps } = props;
  const [loginOpened, setLoginOpened] = useState(false);
  const [active, setActive] = useState(-1);
  const [profileShow, setProfileShow] = useState(false);
  const [profileOpened, setProfileOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const [tripSelected, setTripSelected] = useState(false);
  const [places, setPlaces] = useState([]);
  const auth = getAuth(app);

  return (
    <>
      <Head>
        <title>TouraSSist</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          // colorScheme: "light",
          defaultRadius: 3,
          colorScheme: "dark",
          loader: "dots",
          focusRing: "auto",
          focusRingStyles: {
            resetStyles: () => ({ outline: "none" }),
            styles: (theme) => ({ outline: "none" }),
            inputStyles: (theme) => ({
              outline: "none",
              background: "#131314",
              transition: "background 0.2s ease",
              color: "#fff",
              "&::placeholder": {
                color: "#fff",
              },
            }),
          },
          headings: {
            fontFamily: "Montserrat, sans-serif",
          },
          fontFamily: "Open Sans, sans-serif",
          colors: {
            dark: [
              "#C1C2C5",
              "#A6A7AB",
              "#909296",
              "#5C5F66",
              "#373A40",
              "#0c0c0c",
              "#101113",
              "#0b0c0d",
              "#050506",
              "#020202",
            ],
          },
          TypographyStylesProvider: {
            fontFamily: "Homemade Apple",
          },
        }}
      >
        <Notifications position="top-center" />
        <SearchModal
          searchOpened={searchOpened}
          setSearchOpened={setSearchOpened}
        />
        <AppShell
          padding="none"
          header={
            <MainMenu
              active={active}
              setActive={setActive}
              profileShow={profileShow}
              setProfileShow={setProfileShow}
              profileOpened={profileOpened}
              setProfileOpened={setProfileOpened}
              setListOpened={setListOpened}
              searchOpened={searchOpened}
              setSearchOpened={setSearchOpened}
              loginOpened={loginOpened}
              setTripSelected={setTripSelected}
              auth={auth}
            />
          }
        >
          <RouterTransition />
          <Component
            {...pageProps}
            setProfileShow={setProfileShow}
            setProfileOpened={setProfileOpened}
            listOpened={listOpened}
            setListOpened={setListOpened}
            searchOpened={searchOpened}
            places={places}
            setPlaces={setPlaces}
            loginOpened={loginOpened}
            tripSelected={tripSelected}
            setTripSelected={setTripSelected}
            auth={auth}
          />
        </AppShell>
      </MantineProvider>
    </>
  );
}
