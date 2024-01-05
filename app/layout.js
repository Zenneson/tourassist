import GlobeLoader from "@mainComps/pageLoader/globeLoader";
import "@mantine/core/styles/global.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { cache } from "react";
import AppWrapper from "./homeComps/appWrapper";

export const Globe = cache(() => <GlobeLoader />);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "development" && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            data-project-id="h8dEJji5WH1z5KTsa3P7YNGuxCMgt01zpk7aQIgN"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        )}
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
