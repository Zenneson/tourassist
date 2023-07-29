import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSessionStorage } from "@mantine/hooks";
import { useMantineTheme, Box, Image, LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";

export default function Loader(props) {
  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: null,
  });
  let { loaded, setLoaded = () => {}, mapLoaded } = props;
  const theme = useMantineTheme();
  const router = useRouter();
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
    if (
      document &&
      document.readyState === "interactive" &&
      tripData === null
    ) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
  }, [setLoaded, loaded, tripData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) {
        setLoaded(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loaded, setLoaded]);

  if (router.pathname === "/") {
    return;
  }

  console.log("Loaded: ", loaded);

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
