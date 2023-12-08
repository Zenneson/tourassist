import "@mantine/core/styles/global.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles/global.css";
import "typeface-montserrat";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { ColorSchemeScript } from "@mantine/core";
import Script from "next/script";
import AppWrapper from "./appWrapper";

export const metadata = {
  title: "Tour Assist",
  description: "Crowd Funding Travel Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
        />
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
        <Script
          type="text/javascript"
          src="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js"
        />
      </body>
    </html>
  );
}
