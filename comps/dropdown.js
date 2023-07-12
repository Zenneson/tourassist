import { useState } from "react";
import { motion } from "framer-motion";
import { IconArrowBadgeRight } from "@tabler/icons-react";
import { Box, Drawer, Center, Flex, Space, createStyles } from "@mantine/core";
import LatestTrips from "./latesttrips";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "block",
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    lineHeight: "2.4rem",
    fontSize: theme.fontSizes.sm,
    height: "2.4rem",
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? "rgba(0, 0, 0, 0.5)"
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
  },

  indicator: {
    transition: "transform 150ms ease",
    position: "absolute",
    top: "10px",
    left: `-15px`,
  },

  activeBox: {
    background: "rgba(11, 12, 13, 0.5)",
    borderTop: "2px solid rgba(255,255,255,0.2)",
    borderRadius: "0 0 3px 3px",
    backdropFilter: "blur(20px)",
    height: "600px",
    padding: "20px",
    boxShadow:
      "0 2px 5px  rgba(0,0,0, 0.1), inset 0 -3px 10px 1px rgba(0,0,0, 0.05)",
  },
}));

export default function DropDown({ dropDownOpened, setDropDownOpened }) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(0);
  const [highlighted, setHighlighted] = useState(0);

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

  const menuItems = (event, index) => {
    event.preventDefault();
    setActive(index);
    setHighlighted(index);
  };

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const items = terms.map((term, index) => (
    // Menu Items
    <Box
      onClick={(event) => {
        menuItems(event, index);
      }}
      key={index}
      className={cx(classes.link, { [classes.linkActive]: active === index })}
      sx={(theme) => ({
        cursor: "pointer",
        paddingLeft: "10px",
      })}
    >
      {term.label}
    </Box>
  ));

  return (
    <>
      <Drawer
        zIndex={450}
        opened={dropDownOpened}
        position="top"
        size={"100%"}
        withCloseButton={false}
        onClose={() => setDropDownOpened(false)}
        withOverlay={false}
        styles={{
          content: {
            overflow: "hidden",
            background: "rgba(11, 12, 13, 0.9)",
          },
          header: {
            background: "transparent",
          },
        }}
      >
        <Center mt={120} mb={50}>
          <Flex w={"80%"} maw={1200} pos={"relative"}>
            <Flex direction={"column"} w={"20%"} pos={"relative"}>
              <Box maw={180}>
                <IconArrowBadgeRight
                  className={classes.indicator}
                  size={17}
                  style={{
                    color: "#4dabf7",
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
