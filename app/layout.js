import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@mantine/core/styles.css";
import "@mantine/core/styles/global.css";
import "@mantine/notifications/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Script from "next/script";
import "typeface-montserrat";
import AppWrapper from "./pageComps/appWrapper";

export const metadata = {
  title: "Tour Assist",
  description: "Crowd Funding Travel Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
          strategy="beforeInteractive"
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        />
        <Script
          type="text/javascript"
          src="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js"
        />
      </body>
    </html>
  );
}
