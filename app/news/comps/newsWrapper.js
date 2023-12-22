"use client";
import { Box, Center, Flex } from "@mantine/core";
import { IconChevronsRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import classes from "../styles/news.module.css";
import Faqs from "./faqs";
import LatestTrips from "./latesttrips";

export default function NewsWrapper() {
  const [active, setActive] = useState(0);

  const terms = [
    {
      label: "Featured Trips",
    },
    {
      label: "Lastest News",
    },
    {
      label: "Tourassist?",
    },
  ];

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const items = terms.map((term, index) => (
    // Menu Items
    <Box
      key={index}
      onClick={() => setActive(index)}
      className={classes.link}
      style={{
        cursor: "pointer",
        paddingLeft: "10px",
      }}
    >
      {term.label}
    </Box>
  ));

  return (
    <Center h={"100vh"}>
      <Flex w={"80%"} maw={1200} h={705} pos={"relative"}>
        <Flex direction={"column"} w={"20%"} pos={"relative"}>
          <Box maw={180}>
            <IconChevronsRight
              className={classes.indicator}
              size={17}
              style={{
                transform: `translateY(calc(${active} * 2.4rem))`,
              }}
            />
            {items}
          </Box>
        </Flex>
        <Flex direction={"column"} w={"80%"}>
          {active === 0 && (
            <motion.div {...animation}>
              <Box w={"100%"}>
                <LatestTrips />
              </Box>
            </motion.div>
          )}
          {active === 1 && (
            <motion.div {...animation}>
              <Box w={"100%"} className="pagePanel">
                Lastest News
              </Box>
            </motion.div>
          )}
          {active === 2 && (
            <motion.div {...animation}>
              <Box w={"100%"}>
                <Faqs />
              </Box>
            </motion.div>
          )}
        </Flex>
      </Flex>
    </Center>
  );
}
