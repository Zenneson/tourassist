import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@mantine/core/styles.css";
import "@mantine/core/styles/global.css";
import "@mantine/notifications/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { cache } from "react";
import "typeface-montserrat";
import GlobeLoader from "./map/comps/globeLoader";
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
        <link rel="icon" href="/favicon.ico" />
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
