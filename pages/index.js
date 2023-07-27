import { useEffect } from "react";
import { Box } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { getAuth } from "firebase/auth";
import Intro from "../comps/intro";

const auth = getAuth();

export default function Home() {
  const [geoLat, setGeoLat] = useSessionStorage({
    key: "geoLatState",
    defaultValue: 37,
  });
  const [geoLng, setGeoLng] = useSessionStorage({
    key: "geoLngState",
    defaultValue: -95,
  });

  useEffect(() => {
    if (!geoLat || !geoLng) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setGeoLat(position.coords.latitude);
          setGeoLng(position.coords.longitude);
        },
        function (error) {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }
  }, [geoLat, geoLng, setGeoLat, setGeoLng]);

  return (
    <>
      <Intro auth={auth} />
      <Box
        sx={{
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
        }}
      >
        <video
          loop
          muted
          autoPlay
          playsInline
          src={"globe.mp4"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            transform: "scale(2.3)",
          }}
        />
      </Box>
    </>
  );
}
