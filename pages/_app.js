import Head from "next/head";
import { getAuth } from "firebase/auth";
import { app } from "../libs/firebase";
import { useState } from "react";
import { useToggle } from "@mantine/hooks";
import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterTransition } from "../comps/routertransition";
import SearchModal from "../comps/navbar/searchModal";
import MainMenu from "../comps/navbar/mainMenu";
import DropDown from "../comps/dropdown/dropdown";
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
  const [colorMode, toggle] = useToggle(["dark", "light"]);

  const auth = getAuth(app);

  const tourTheme = {
    colorScheme: colorMode,
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
    primaryColor: colorMode === "dark" ? "blue" : "red",
    primaryShade: { light: 5, dark: 9 },
    components: {
      Autocomplete: {
        defaultProps: {
          variant: "filled",
        },
      },
      Input: {
        defaultProps: {
          variant: "filled",
        },
      },
      Switch: {
        styles: {
          thumb: {
            cursor: "pointer",
          },
          track: {
            cursor: "pointer",
          },
          label: {
            cursor: "pointer",
          },
        },
      },
      Button: {
        styles: {
          root: {
            transition: "all 0.2s ease",
          },
        },
      },
    },
    defaultRadius: 3,
    loader: "dots",
    focusRing: "auto",
    focusRingStyles: {
      resetStyles: () => ({ outline: "none" }),
      styles: (theme) => ({ outline: "none" }),
      inputStyles: (theme) => ({
        outline: "none",
        transition: "background 0.2s ease",
        background:
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[4],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.gray[0]
            : theme.colors.dark[9],
        "&::placeholder": {
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[0]
              : theme.colors.dark[9],
        },
      }),
    },
    headings: {
      fontFamily: "Montserrat, sans-serif",
    },
    fontFamily: "Open Sans, sans-serif",
    TypographyStylesProvider: {
      fontFamily: "Homemade Apple",
    },
    // globalStyles: (theme) => ({
    //   body: {
    //     backgroundColor:
    //       theme.colorScheme === "dark" ? theme.dark : theme.white,
    //   },
    // }),
  };

  return (
    <>
      <Head>
        <title>TouraSSist</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS theme={tourTheme}>
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
              auth={auth}
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
              toggle={toggle}
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
