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
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setGeoLat(position.coords.latitude);
        setGeoLng(position.coords.longitude);
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, [geoLat, geoLng, setGeoLat, setGeoLng]);

  return (
    <>
      <Intro auth={auth} />
      <video
        autoPlay
        muted
        loop
        style={{
          zIndex: -1,
          position: "fixed",
          top: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          transform: "scale(1.5)",
        }}
      >
        <source src="globe.mp4" type="video/mp4" />
      </video>
      <Box
        pos={"fixed"}
        w={"100%"}
        h={"100%"}
        bg={"#000"}
        sx={{
          zIndex: -2,
        }}
      />
    </>
  );
}
