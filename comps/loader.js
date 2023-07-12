import { useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Image, LoadingOverlay } from "@mantine/core";

export default function Loader({ pageLoaded }) {
  const Globe = () => (
    <Box>
      <motion.div
        animate={{
          opacity: [1, 0.1, 1],
          transform: ["scale(1)", "scale(0.9)", "scale(1)"],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Image src={"img/blue_loader.png"} alt="TourAssist Loader" />
      </motion.div>
    </Box>
  );

  useEffect(() => {
    sessionStorage.setItem("pageLoaded", JSON.stringify(pageLoaded));
  }, [pageLoaded]);

  return (
    <>
      <LoadingOverlay
        visible={!pageLoaded}
        overlayColor="#0b0c0d"
        overlayOpacity={1}
        zIndex={1000}
        transitionDuration={250}
        loader={<Globe />}
        style={{ pointerEvents: "none" }}
      />
    </>
  );
}
