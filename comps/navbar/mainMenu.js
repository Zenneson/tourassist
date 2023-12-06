"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { useLocalStorage, useFullscreen } from "@mantine/hooks";
import {
  useComputedColorScheme,
  useMantineColorScheme,
  Box,
  Button,
  Image,
  Group,
  Tooltip,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Text,
  Flex,
  Title,
  Modal,
  Center,
} from "@mantine/core";
import {
  IconMoon,
  IconLogin,
  IconSearch,
  IconDoorExit,
  IconBrightnessUp,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconDualScreen,
  IconPasswordUser,
} from "@tabler/icons-react";
import { spotlight } from "@mantine/spotlight";
import ProfileDrawer from "./profileDrawer";
import { auth } from "../../libs/firebase";
import { useUser } from "../../libs/context";
import classes from "./mainMenu.module.css";
import LoginComp from "../loginComp";

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
  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  const router = useRouter();
  const { toggle, fullscreen } = useFullscreen();
  const { user } = useUser();
  const [loginModal, setLoginModal] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const [currentTrip, setCurrentTrip] = useLocalStorage({
    key: "currentTrip",
    defaultValue: [],
  });

  const [active, setActive] = useLocalStorage({
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
    spotlight.open();
    setSearchOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  // Opens the Drowndown that is commented out
  const openDropDown = () => {
    if (panelShow === true) {
      setDropDownOpened(true);
    } else {
      setDropDownOpened((o) => !o);
    }
    setActive(-1);
    setPanelShow(false);
  };

  const signOutFunc = async () => {
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
    }
    sessionStorage.clear();
    // NOTE: Is this necessary? Are these ever set?
    // Cookies.remove("tripData");
    // Cookies.remove("user");
    setMainMenuOpened(false);
    router.push("/", undefined);
  };

  const logoutHandler = () => {
    if (user) {
      signOutFunc();
      return;
    } else {
      setLoginModal(true);
      setPopoverOpened(false);
    }
  };

  if (router.pathname === "/") {
    return null;
  }

  return (
    <>
      <Box>
        <Box
          height={1} // so that the header does not block the middele of the top
          opacity={searchOpened ? 0 : 1}
          className={classes.mainMenu}
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
            <Title fw={900} fz={30} className={classes.mainTitleThick}>
              <Text fw={500} inherit span className={classes.mainTitleThin}>
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
                <Text fz={12} className={classes.mainMenuBtn}>
                  {user.email}
                </Text>
              </Button>
            )}
            <Tooltip
              label="Toggle Color Scheme"
              position="bottom"
              classNames={{ tooltip: "toolTip" }}
            >
              <Button
                className={classes.colorSchemeBtn}
                variant="subtle"
                onClick={() => toggleColorScheme()}
                radius={"xl"}
                p={10}
              >
                <>
                  <IconBrightnessUp size={17} className={classes.lightIcon} />
                  <IconMoon size={17} className={classes.darkIcon} />
                </>
              </Button>
            </Tooltip>
            {/* TOGGLE FULLSCREEN  */}
            {router.pathname === "/map" && (
              <Tooltip
                label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                position="bottom"
                classNames={{ tooltip: "toolTip" }}
              >
                <Button
                  className={classes.mainMenuBtn}
                  variant="subtle"
                  onClick={toggle}
                  radius={"xl"}
                  p={10}
                >
                  {fullscreen ? (
                    <IconArrowsMinimize size={17} />
                  ) : (
                    <IconArrowsMaximize size={17} />
                  )}
                </Button>
              </Tooltip>
            )}
            <Group gap={0}>
              <Tooltip
                label="Search Trips"
                position="bottom"
                classNames={{ tooltip: "toolTip" }}
              >
                {/* Search button */}
                <Button
                  className={classes.mainMenuBtn}
                  onClick={openSearch}
                  variant="subtle"
                  radius="xl"
                  mr={5}
                  p={10}
                >
                  <IconSearch size={17} />
                </Button>
              </Tooltip>
              <Popover
                className={classes.loginPopover}
                withArrow
                arrowSize={12}
                arrowOffset={30}
                width="auto"
                position="bottom-end"
                shadow="md"
                closeOnClickOutside={true}
                onClose={() => setPopoverOpened(false)}
                opened={!loginModal && popoverOpened}
              >
                <Tooltip
                  label={user ? "Logout" : "Login"}
                  position="bottom"
                  classNames={{ tooltip: "toolTip" }}
                >
                  <PopoverTarget>
                    {/* Logout Dropdown */}
                    <Button
                      className={classes.mainMenuBtn}
                      p={10}
                      radius={"xl"}
                      variant="subtle"
                      onClick={() => {
                        setPopoverOpened((o) => !o);
                      }}
                    >
                      {user ? (
                        <IconDoorExit size={17} />
                      ) : (
                        <IconLogin size={17} />
                      )}
                    </Button>
                  </PopoverTarget>
                </Tooltip>
                <PopoverDropdown p={0} mt={-4}>
                  {/* Logout Button  */}
                  <Button
                    className={classes.logoutButton}
                    color={dark ? "#fff" : "#000"}
                    size="md"
                    fw={700}
                    px={15}
                    variant="subtle"
                    leftSection={
                      user ? (
                        <IconDualScreen size={18} />
                      ) : (
                        <IconPasswordUser size={18} />
                      )
                    }
                    onClick={logoutHandler}
                  >
                    {user ? "LOGOUT" : "LOGIN"}
                  </Button>
                </PopoverDropdown>
              </Popover>
            </Group>
            {/* DropDown Button */}
            {/* <Tooltip
              label={"TourAssist?"}
              position="bottom"
              classNames={{ tooltip: "toolTip" }}
            >
              <ActionIcon
                className={classes.infoButton}
                size={"xl"}
                radius={"xl"}
                variant="transparent"
              >
                <IconInfoCircle stroke={1.2} size={35} onClick={openDropDown} />
              </ActionIcon>
            </Tooltip> */}
          </Flex>
        </Box>
      </Box>
      <Modal
        opened={loginModal}
        padding={"xl"}
        withCloseButton={false}
        onClose={() => setLoginModal(false)}
        overlayProps={{
          blur: 10,
          backgroundOpacity: 0.3,
          color: dark ? "rgb(0,0,0)" : "rgb(255,255,255)",
        }}
      >
        <Center>
          <Image
            mb={25}
            style={{ width: "100%", maxWidth: "250px" }}
            src={"img/TA_GlobeLogo.png"}
            alt="TouraSSist_logo"
          />
        </Center>
        <Title
          fw={900}
          ta={"center"}
          color="#fff"
          fz={"2.2rem"}
          mb={10}
          style={{
            textShadow: "0 2px 5px rgba(0,0,0,0.15)",
          }}
        >
          <Text fw={500} c={dark ? "#adadad" : "#7e7e7e"} inherit span>
            TOUR
          </Text>
          ASSIST
        </Title>
        <LoginComp />
      </Modal>
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
  );
}
