import Head from "next/head";
import { RecoilRoot } from "recoil";
import { MantineProvider, AppShell } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import InfoModal from "../comps/infoModal";
import LoginModal from "../comps/loginModal";
import NavBar from "../comps/navBar";
import SearchModal from "../comps/searchModal";

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
        }}
      >
        <RecoilRoot>
          <NotificationsProvider position="top-center">
            <InfoModal />
            <LoginModal />
            <SearchModal />
            <AppShell padding="none" header={<NavBar />}>
              <Component {...pageProps} />
            </AppShell>
          </NotificationsProvider>
        </RecoilRoot>
      </MantineProvider>
    </>
  );
}
