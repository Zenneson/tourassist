import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import GlobeLoader from "@globalComps/pageLoader/globeLoader";
import "@mantine/core/styles/global.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { cache } from "react";
import "typeface-montserrat";
import AppWrapper from "./pageComps/appWrapper";

export const Globe = cache(() => <GlobeLoader />);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/favicon/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
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
