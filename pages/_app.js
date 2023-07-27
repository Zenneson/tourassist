import Head from "next/head";
import NextApp from "next/app";
import { setCookie, getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { AppShell, MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useSessionStorage } from "@mantine/hooks";
import { RouterTransition } from "../comps/routertransition";
import { useUserData } from "../libs/custom";
import { getAuth } from "firebase/auth";
import SearchModal from "../comps/navbar/searchModal";
import MainMenu from "../comps/navbar/mainMenu";
import DropDown from "../comps/dropdown/dropdown";
require("typeface-montserrat");
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
export default function App(props) {
  const { Component, pageProps } = props;
  const [active, setActive] = useState(-1);
  const [panelShow, setPanelShow] = useState(false);
  const [mainMenuOpened, setMainMenuOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const [dropDownOpened, setDropDownOpened] = useState(false);
  const [colorScheme, setColorScheme] = useState("dark");
  const userData = useUserData();
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const toggleColorScheme = (value) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useEffect(() => {
    if (user === null || user !== userData) {
      setUser(userData);
    }
  }, [userData, user, setUser]);

  const auth = getAuth();

  const tourTheme = {
    colorScheme: colorScheme,
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
    primaryColor: colorScheme === "dark" ? "blue" : "red",
    primaryShade: { light: 7, dark: 9 },
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
            : theme.colors.gray[3],
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
    globalStyles: (theme) => ({
      body: {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
      },

      ".pagePanel": {
        borderTop: `2px solid ${
          theme.colorScheme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)"
        }`,
        background:
          theme.colorScheme === "dark"
            ? "rgba(0,0,0,0.3)"
            : "rgba(255,255,255,0.3)",
        boxShadow: "0 3px 5px 0 rgba(0,0,0,0.08)",
        borderRadius: "0 0 3px 3px",
      },
    }),
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
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS theme={tourTheme}>
          <Notifications position="top-center" zIndex={9999} />
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
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx),
  };
};
