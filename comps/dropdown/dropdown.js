import { useState } from "react";
import { motion } from "framer-motion";
import { IconChevronsRight, IconChevronsUp } from "@tabler/icons-react";
import {
  ActionIcon,
  Box,
  Drawer,
  Center,
  Flex,
  createStyles,
} from "@mantine/core";
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
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    transition: "transform 150ms ease",
    position: "absolute",
    top: "10px",
    left: `-20px`,
  },

  activeBox: {
    background:
      theme.colorScheme === "dark"
        ? "rgba(11, 12, 13, 0.5)"
        : "rgba(248, 248, 248, 0.5)",
    borderTop: `2px solid ${
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors.gray[0], 0.1)
        : theme.fn.rgba(theme.colors.dark[9], 0.1)
    }`,
    borderRadius: "0 0 3px 3px",
    height: "600px",
    padding: "20px",
    boxShadow:
      "0 2px 5px  rgba(0,0,0, 0.1), inset 0 -3px 10px 1px rgba(0,0,0, 0.05)",
  },
}));

export default function DropDown(props) {
  const { dropDownOpened, setDropDownOpened } = props;
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
        styles={(theme) => ({
          body: {
            padding: 0,
            width: "100vw",
            height: "100vh",
          },
          content: {
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            background:
              theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors.dark[7], 0.8)
                : theme.fn.rgba(theme.colors.gray[0], 0.8),
          },
          header: {
            background: "transparent",
          },
        })}
      >
        <Center h={"100vh"} mb={50}>
          <Flex w={"80%"} maw={1200} h={705} pos={"relative"}>
            <ActionIcon
              pos={"absolute"}
              variant="tranparent"
              opacity={0.3}
              right={-70}
              size={"xl"}
              onClick={() => setDropDownOpened(false)}
              sx={{
                "&:hover": {
                  opacity: 1,
                },
              }}
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
