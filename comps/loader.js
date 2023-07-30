import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSessionStorage } from "@mantine/hooks";
import { useMantineTheme, Box, Image, LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";

export default function Loader(props) {
  const [loaded, setLoaded] = useSessionStorage({
    key: "loaded",
    defaultValue: false,
  });
  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: null,
  });
  let { mapLoaded } = props;
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
      !tripData ||
      router.query.title === tripData.tripId ||
      router.pathname === "/map"
    ) {
      return;
    }
    setLoaded(true);
  }, [router.pathname, router.query, tripData, setLoaded]);

  if (router.pathname === "/") return;

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded && !loaded}
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
