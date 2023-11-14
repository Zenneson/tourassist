"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import useSWR from "swr";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { useSessionStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import { Box } from "@mantine/core";
import {
  useComputedColorScheme,
  useMantineColorScheme,
  Button,
  Image,
  Group,
  Tooltip,
  Popover,
  Text,
  Flex,
  Title,
} from "@mantine/core";
import {
  IconLogin,
  IconSearch,
  IconDoorExit,
  IconInfoCircleFilled,
  IconBrightnessUp,
  IconMoon,
} from "@tabler/icons-react";
import ProfileDrawer from "./profileDrawer";
import { auth } from "../../libs/firebase";
import { useUser } from "../../libs/context";
import Cookies from "js-cookie";
import classes from "./mainMenu.module.css";

export default function MainMenu(props) {
  const {
    setListOpened,
    searchOpened,
    setSearchOpened,
    setDropDownOpened,
    mainMenuOpened,
    setMainMenuOpened,
    panelShow,
    setPanelShow,
  } = props;

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const [isClient, setIsClient] = useState(false);
  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  const router = useRouter();
  const [logoutOpened, setLogoutOpened] = useState(false);

  const { user } = useUser();

  const [currentTrip, setCurrentTrip] = useSessionStorage({
    key: "currentTrip",
    defaultValue: [],
  });

  const [active, setActive] = useSessionStorage({
    key: "active",
    defaultValue: -1,
  });

  const fetchTrips = async (userEmail) => {
    const queryData = collection(firestore, "users", userEmail, "trips");
    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((doc) => doc.data());
  };

  const {
    data: allTrips,
    mutate,
    error,
    isLoading,
  } = useSWR(user?.email, fetchTrips);

  useEffect(() => {
    if (!allTrips && !error) {
      mutate();
    }
  }, [allTrips, error, mutate]);

  if (error) {
    console.error("Error fetching trips:", error);
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!currentTrip || currentTrip.length === 0) {
      const sessionTrip = sessionStorage.getItem("currentTrip");
      if (sessionTrip) {
        const parsedTrip = JSON.parse(sessionTrip);
        setCurrentTrip(parsedTrip);
      } else if (allTrips && allTrips.length > 0) {
        setCurrentTrip(allTrips[0]);
      }
    }
  }, [currentTrip, setCurrentTrip, allTrips]);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const openMenu = () => {
    setMainMenuOpened((o) => !o);
    setListOpened(false);
    setPanelShow(false);
    setActive(-1);
  };

  const openSearch = () => {
    setSearchOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const openDropDown = () => {
    if (panelShow === true) {
      setDropDownOpened(true);
    } else {
      setDropDownOpened((o) => !o);
    }
    setPanelShow(false);
  };

  const signOutFunc = async () => {
    setLogoutOpened(false);
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
    }
    sessionStorage.clear();
    Cookies.remove("tripData");
    Cookies.remove("user");
    setMainMenuOpened(false);
    router.push("/", undefined, { shallow: false });
  };

  if (router.pathname === "/") {
    return null;
  }

  return (
    isClient && (
      <>
        <Box>
          <Box
            height={1} // so that the header does not block the middele of the top
            opacity={searchOpened ? 0 : 1}
            style={{
              position: "fixed",
              zIndex: 1600,
              width: "100%",
              display: "flex",
              padding: "15px 25px",
              alignItems: "flex-start",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            {/* Main Menu Button  */}
            <Flex
              direction={"row"}
              align="center"
              gap={10}
              mt={5}
              ml={-10}
              style={{
                cursor: "pointer",
                pointerEvents: "all",
              }}
              onClick={openMenu}
            >
              <Image
                ml={5}
                width={"auto"}
                height={"60px"}
                src={"img/TA_GlobeLogo.png"}
                alt="TouraSSist_logo"
              />
              <Title fw={900} c={dark ? "gray.0" : "dark.3"} fz={30}>
                <Text fw={500} c={dark ? "gray.5" : "#000"} inherit span>
                  TOUR
                </Text>
                ASSIST
              </Title>
            </Flex>
            <Flex
              align={"center"}
              gap={10}
              px={0}
              py={10}
              mt={10}
              mr={10}
              style={{
                pointerEvents: "all",
              }}
            >
              {user && (
                //  Main Menu Button
                <Button
                  className={classes.openMenuButton}
                  variant="subtle"
                  size="sm"
                  onClick={openMenu}
                  radius={"xl"}
                  mr={-5}
                >
                  <Text fz={12} c={dark ? "gray.0" : "dark.9"}>
                    {user.email}
                  </Text>
                </Button>
              )}
              <Tooltip
                label="Toggle Color Scheme"
                position="bottom"
                classNames={{ tooltip: classes.toolTip }}
              >
                <Button
                  className={classes.toggleColorButton}
                  variant="subtle"
                  onClick={() => toggleColorScheme()}
                  radius={"xl"}
                  p={10}
                  c={dark ? "gray.0" : "dark.9"}
                >
                  {dark ? (
                    <IconBrightnessUp size={17} />
                  ) : (
                    <IconMoon size={17} />
                  )}
                </Button>
              </Tooltip>
              <Group gap={0}>
                <Tooltip
                  label="Search Trips"
                  position="bottom"
                  classNames={{ tooltip: classes.toolTip }}
                >
                  {/* Search button */}
                  <Button
                    className={classes.openSearchButton}
                    onClick={openSearch}
                    variant="subtle"
                    radius="xl"
                    mr={5}
                    p={10}
                    c={dark ? "gray.0" : "dark.9"}
                  >
                    <IconSearch size={17} />
                  </Button>
                </Tooltip>
                <Popover
                  withArrow
                  arrowOffset={15}
                  width="auto"
                  position="bottom"
                  shadow="md"
                  opened={logoutOpened}
                >
                  <Tooltip
                    label={user ? "Logout" : "Login"}
                    position="bottom"
                    classNames={{ tooltip: classes.toolTip }}
                  >
                    <Popover.Target>
                      {/* Logout Dropdown */}
                      <Button
                        className={classes.logoutDropdownButton}
                        p={10}
                        radius="xl"
                        variant="subtle"
                        c={dark ? "gray.0" : "dark.9"}
                        onClick={() => {
                          setLogoutOpened((o) => !o);
                        }}
                      >
                        {user ? (
                          <IconDoorExit size={17} />
                        ) : (
                          <IconLogin size={17} />
                        )}
                      </Button>
                    </Popover.Target>
                  </Tooltip>
                  <Popover.Dropdown p={0}>
                    {/* Logout Button  */}
                    <Button
                      className={classes.logoutButton}
                      size="xs"
                      fw={700}
                      px={15}
                      variant="default"
                      onClick={() => {
                        signOutFunc();
                      }}
                    >
                      {user ? "LOGOUT" : "LOGIN"}
                    </Button>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <motion.div
                animate={{
                  opacity: [
                    1, 1, 1, 0.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.3, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 0.3, 1, 0.3, 1,
                  ],
                }}
                transition={{ duration: 7, repeat: Infinity }}
              >
                {/* DropDown Button */}
                <Tooltip
                  label={"TourAssist?"}
                  position="bottom"
                  classNames={{ tooltip: classes.toolTip }}
                >
                  <IconInfoCircleFilled
                    stroke={1}
                    size={30}
                    style={{
                      color: dark ? "blue.6" : "blue.9",
                      paddingTop: "3px",
                      cursor: "pointer",
                      transform: "scale(1.5)",
                    }}
                    onClick={openDropDown}
                  />
                </Tooltip>
              </motion.div>
            </Flex>
          </Box>
        </Box>
        <ProfileDrawer
          active={active}
          setActive={setActive}
          panelShow={panelShow}
          setPanelShow={setPanelShow}
          mainMenuOpened={mainMenuOpened}
          setMainMenuOpened={setMainMenuOpened}
          setDropDownOpened={setDropDownOpened}
          signOutFunc={signOutFunc}
          openMenu={openMenu}
          allTrips={allTrips}
        />
      </>
    )
  );
}
