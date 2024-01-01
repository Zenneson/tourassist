"use client";
import LoginComp from "@mainComps/login/loginComp";
import { useUser } from "@libs/context";
import { auth } from "@libs/firebase";
import { useAppState } from "@libs/store";
import {
  Box,
  Button,
  Flex,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useFullscreen, useSessionStorage } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBrightnessUp,
  IconDoorExit,
  IconDualScreen,
  IconLogin,
  IconMoon,
  IconSearch,
} from "@tabler/icons-react";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import ProfileDrawer from "./profileDrawer";
import classes from "./styles/mainMenu.module.css";

export default function MainMenu() {
  const { user } = useUser();

  const {
    panelOpened,
    setPanelOpened,
    setListOpened,
    mainMenuOpened,
    setMainMenuOpened,
    searchOpened,
    setSearchOpened,
  } = useAppState();

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  const router = useRouter();
  const pathname = usePathname();
  const { toggle, fullscreen } = useFullscreen();
  const [popoverOpened, setPopoverOpened] = useState(false);

  const [active, setActive] = useSessionStorage({
    key: "active",
    defaultValue: -1,
  });

  const openMenu = () => {
    setMainMenuOpened(!mainMenuOpened);
    setListOpened(false);
    setPanelOpened(false);
    setActive(-1);
  };

  const openSearch = () => {
    spotlight.open();
    setSearchOpened(true);
    setMainMenuOpened(false);
    setPanelOpened(false);
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
    router.push("/");
  };

  const logoutHandler = () => {
    setPopoverOpened(false);

    if (user) {
      signOutFunc();
      return;
    } else {
      setPopoverOpened(false);
    }
  };

  return (
    <>
      <Box>
        <Box
          // height={1} // so that the header does not block the middele of the top
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
              width={60}
              height={60}
              src={"/img/TA_GlobeLogo.png"}
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
              >
                <>
                  <IconBrightnessUp size={17} className={classes.lightIcon} />
                  <IconMoon size={17} className={classes.darkIcon} />
                </>
              </Button>
            </Tooltip>
            {/* TOGGLE FULLSCREEN  */}
            {pathname === "/map" && (
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
                opened={popoverOpened}
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
                        setPopoverOpened(!popoverOpened);
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
                  {user ? (
                    <Button
                      className={classes.logoutButton}
                      color={dark ? "#fff" : "#000"}
                      size="md"
                      fw={700}
                      px={15}
                      variant="subtle"
                      leftSection={<IconDualScreen size={18} />}
                      onClick={logoutHandler}
                    >
                      LOGOUT
                    </Button>
                  ) : (
                    <Box p={20} pt={10} w={375}>
                      <LoginComp setPopoverOpened={setPopoverOpened} />
                    </Box>
                  )}
                </PopoverDropdown>
              </Popover>
            </Group>
          </Flex>
        </Box>
      </Box>
      <ProfileDrawer
        active={active}
        setActive={setActive}
        panelOpened={panelOpened}
        setPanelOpened={setPanelOpened}
        mainMenuOpened={mainMenuOpened}
        setMainMenuOpened={setMainMenuOpened}
        signOutFunc={signOutFunc}
        openMenu={openMenu}
      />
    </>
  );
}
