import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSessionStorage, useForceUpdate } from "@mantine/hooks";
import { useMantineTheme, Box, Image, LoadingOverlay } from "@mantine/core";

export default function Loader(props) {
  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: null,
  });
  const loaded = props.loaded;
  const mapLoaded = props.mapLoaded;
  const theme = useMantineTheme();
  const forceUpdate = useForceUpdate();
  const Globe = () => (
    <Box>
      <motion.div
        animate={{
          opacity: [1, 0.1, 1],
          transform: ["scale(1)", "scale(0.9)", "scale(1)"],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Image
          src={
            theme.colorScheme === "dark"
              ? "img/blue_loader.png"
              : "img/red_loader.png"
          }
          alt="TourAssist Loader"
        />
      </motion.div>
    </Box>
  );

  useEffect(() => {
    if (mapLoaded === true) {
      forceUpdate();
    }
  }, [mapLoaded, forceUpdate]);

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded && !loaded && tripData === null}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0]
        }
        overlayOpacity={1}
        zIndex={1000}
        transitionDuration={1000}
        loader={<Globe />}
        style={{ pointerEvents: "none" }}
      />
    </>
  );
}
