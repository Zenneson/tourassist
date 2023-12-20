import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import GlobeLoader from "@globalComps/pageLoader/globeLoader";
import "@mantine/core/styles/global.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { cache } from "react";
import "typeface-montserrat";
import AppWrapper from "./pageComps/appWrapper";

export const metadata = {
  title: "Tour Assist",
  description: "Crowd Funding Travel Platform",
};

export const Globe = cache(() => <GlobeLoader />);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
