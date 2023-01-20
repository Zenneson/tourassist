import Head from "next/head";
import { RecoilRoot } from "recoil";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "mapbox-gl/dist/mapbox-gl.css";
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
          // colorScheme: "light",
          colorScheme: "dark",
          loader: "dots",
        }}
      >
        <RecoilRoot>
          <NotificationsProvider position="top-center">
            <Component {...pageProps} />
          </NotificationsProvider>
        </RecoilRoot>
      </MantineProvider>
    </>
  );
}
