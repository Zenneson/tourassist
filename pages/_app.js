import Head from "next/head";
import { RecoilRoot } from "recoil";
import { MantineProvider, AppShell } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import LoginModal from "../comps/loginModal";
import SearchModal from "../comps/searchModal";
import MainMenu from "../comps/mainMenu";
require("typeface-montserrat");
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";

export default function App(props) {
  const { Component, pageProps } = props;

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
          loader: "dots",
          // colorScheme: "light",
          colorScheme: "dark",
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
        }}
      >
        <RecoilRoot>
          <Notifications position="top-center" />
          <LoginModal />
          <SearchModal />
          <AppShell padding="none" header={<MainMenu />}>
            <Component {...pageProps} />
          </AppShell>
        </RecoilRoot>
      </MantineProvider>
    </>
  );
}
