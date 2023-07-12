import Head from "next/head";
import { getAuth } from "firebase/auth";
import { app } from "../libs/firebase";
import { useState } from "react";
import { useRouter } from "next/router";
import { MantineProvider, AppShell } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterTransition } from "../comps/routertransition";
import SearchModal from "../comps/searchModal";
import MainMenu from "../comps/mainMenu";
import DropDown from "../comps/dropdown";
require("typeface-montserrat");
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

export default function Money(props) {
  const { Component, pageProps } = props;
  const [active, setActive] = useState(-1);
  const [panelShow, setPanelShow] = useState(false);
  const [mainMenuOpened, setMainMenuOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const [dropDownOpened, setDropDownOpened] = useState(false);

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
              background: "#373A40",
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
              "#131314",
              "#101113",
              "#0b0c0d",
              "#050506",
              "#020202",
            ],
          },
          TypographyStylesProvider: {
            fontFamily: "Homemade Apple",
          },
          globalStyles: (theme) => ({
            body: {
              backgroundColor:
                theme.colorScheme === "dark" ? "#0c0c0c" : theme.white,
            },
          }),
        }}
      >
        <Notifications position="top-center" />
        <SearchModal
          searchOpened={searchOpened}
          setSearchOpened={setSearchOpened}
        />
        <DropDown
          dropDownOpened={dropDownOpened}
          setDropDownOpened={setDropDownOpened}
        />
        <AppShell
          padding="none"
          header={
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
              auth={auth}
            />
          }
        >
          <RouterTransition
            setMainMenuOpened={setMainMenuOpened}
            setPanelShow={setPanelShow}
            setDropDownOpened={setDropDownOpened}
          />
          <Component
            {...pageProps}
            setPanelShow={setPanelShow}
            setMainMenuOpened={setMainMenuOpened}
            listOpened={listOpened}
            setListOpened={setListOpened}
            searchOpened={searchOpened}
            dropDownOpened={dropDownOpened}
            setDropDownOpened={setDropDownOpened}
            auth={auth}
          />
        </AppShell>
      </MantineProvider>
    </>
  );
}
