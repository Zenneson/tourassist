import { useState } from "react";
import { motion } from "framer-motion";
import { IconChevronsRight, IconChevronsUp } from "@tabler/icons-react";
import { ActionIcon, Box, Drawer, Center, Flex } from "@mantine/core";
import LatestTrips from "./latesttrips";
import classes from "./dropdown.module.css";

export default function DropDown(props) {
  const { dropDownOpened, setDropDownOpened } = props;
  const [active, setActive] = useState(0);

  const terms = [
    {
      label: "Trending Trips",
    },
    {
      label: "Getting Started",
    },
    {
      label: "News",
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
    <>
      <Drawer
        classNames={{
          root: classes.dropdown,
          header: classes.dropdownHeader,
          content: classes.dropdownContent,
        }}
        zIndex={1}
        opened={dropDownOpened}
        position="top"
        size={"100%"}
        withCloseButton={false}
        onClose={() => setDropDownOpened(false)}
        withOverlay={false}
      >
        <Center h={"100vh"} mb={50}>
          <Flex w={"80%"} maw={1200} h={705} pos={"relative"}>
            <ActionIcon
              className={classes.dropdownBtn}
              variant={"transparent"}
              size={"xl"}
              onClick={() => setDropDownOpened(false)}
            >
              <IconChevronsUp size={50} />
            </ActionIcon>
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
                  <Box w={"100%"} className={classes.activeBox}>
                    Getting Started
                  </Box>
                </motion.div>
              )}
              {active === 2 && (
                <motion.div {...animation}>
                  <Box w={"100%"} className={classes.activeBox}>
                    News
                  </Box>
                </motion.div>
              )}
            </Flex>
          </Flex>
        </Center>
      </Drawer>
    </>
  );
}
