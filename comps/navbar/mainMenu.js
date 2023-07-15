import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { useSessionStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import { RemoveScroll } from "@mantine/core";
import {
  useMantineTheme,
  Header,
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
  IconCircleX,
  IconInfoCircleFilled,
  IconBrightnessUp,
  IconMoon,
} from "@tabler/icons-react";
import ProfileDrawer from "./profileDrawer";

export default function MainMenu({
  auth,
  active,
  setActive,
  panelShow,
  setPanelShow,
  mainMenuOpened,
  setMainMenuOpened,
  setListOpened,
  searchOpened,
  setSearchOpened,
  setDropDownOpened,
  toggle,
}) {
  const router = useRouter();

  const theme = useMantineTheme();

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const [logoutOpeened, setLogoutOpeened] = useState(false);
  const [mapSpin, setMapSpin] = useSessionStorage({
    key: "mapSpin",
  });
  const [visible, setVisible] = useSessionStorage({
    key: "visible",
    defaultValue: router.pathname !== "/" ? false : true,
  });
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  useEffect(() => {
    if (mapSpin) {
      setVisible(false);
    }
  }, [mapSpin, setVisible]);

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
    setDropDownOpened((o) => !o);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const signOutFunc = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("images");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("visible");
        sessionStorage.removeItem("mapSpin");
        sessionStorage.removeItem("placeDataState");
        if (router.pathname !== "/") router.push("/");
        else {
          router.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <ProfileDrawer
        active={active}
        setActive={setActive}
        panelShow={panelShow}
        setPanelShow={setPanelShow}
        mainMenuOpened={mainMenuOpened}
        openMenu={openMenu}
        signOutFunc={signOutFunc}
      />
      <Header
        className={RemoveScroll.classNames.zeroRight}
        zIndex={998}
        bg="none"
        pb={0}
        withBorder={false}
        height={1} // so that the header does not block the middele of the top
        opacity={!visible || searchOpened ? 0 : 1}
        sx={{
          display: "flex",
          padding: "15px 25px",
          alignItems: "flex-start",
          justifyContent: "space-between",
          pointerEvents: !visible && "none",
        }}
      >
        {/* Main Menu Button  */}
        <Flex
          direction={"row"}
          align="center"
          gap={10}
          mt={5}
          ml={-10}
          sx={{
            cursor: "pointer",
          }}
          onClick={openMenu}
        >
          <Image
            ml={5}
            width={"auto"}
            height={"60px"}
            src={
              theme.colorScheme === "dark"
                ? "img/TA_GlobeLogo.png"
                : "img/TA_GlobeRed.png"
            }
            alt="TouraSSist_logo"
            withPlaceholder
          />
          <Title
            fw={900}
            color={theme.colorScheme === "dark" ? "gray.0" : "dark.0"}
            fz={30}
          >
            <Text
              fw={500}
              color={theme.colorScheme === "dark" ? "gray.5" : "dark.3"}
              inherit
              span
            >
              TOUR
            </Text>
            ASSIST
          </Title>
        </Flex>
        <Flex align={"center"} gap={10} px={0} py={10} m={0} mt={5} mr={5}>
          {/* TODO */}
          {user && (
            //  Main Menu Button
            <Button
              variant="subtle"
              px={15}
              size="sm"
              onClick={openMenu}
              radius={"xl"}
              c={
                theme.colorScheme === "dark"
                  ? theme.colors.blue[2]
                  : theme.colors.dark[9]
              }
            >
              <Text fz={12}>{user?.providerData[0].email}</Text>
            </Button>
          )}
          {/* TODO   */}
          <Button
            variant="subtle"
            onClick={toggle}
            radius={"xl"}
            color={theme.colorScheme === "dark" ? "blue" : "dark"}
            p={10}
          >
            {theme.colorScheme === "dark" ? (
              <IconBrightnessUp size={17} />
            ) : (
              <IconMoon size={17} />
            )}
          </Button>
          <Group spacing={0}>
            <Tooltip
              color="dark"
              label="Search Trips"
              position="bottom"
              openDelay={800}
              withArrow
            >
              {/* Search button */}
              <Button onClick={openSearch} variant="subtle" radius="xl" p={10}>
                <IconSearch
                  size={17}
                  color={
                    theme.colorScheme === "dark"
                      ? theme.colors.blue[2]
                      : theme.colors.dark[9]
                  }
                />
              </Button>
            </Tooltip>
            <Popover
              withArrow
              arrowOffset={15}
              width="auto"
              position="bottom-end"
              shadow="md"
              opened={logoutOpeened}
              onChange={setLogoutOpeened}
            >
              <Tooltip
                color={theme.colorScheme === "dark" ? "dark" : "gray.0"}
                c={
                  theme.colorScheme === "dark"
                    ? theme.colors.blue[2]
                    : theme.colors.dark[9]
                }
                label={user ? "Logout" : "Login"}
                position="bottom"
                openDelay={800}
                withArrow
              >
                <Popover.Target>
                  {/* Logout Dropdown */}
                  <Button
                    onClick={() => {
                      setLogoutOpeened((o) => !o);
                    }}
                    variant="subtle"
                    radius="xl"
                    p={10}
                  >
                    {user ? (
                      <IconDoorExit
                        size={17}
                        color={
                          theme.colorScheme === "dark"
                            ? theme.colors.blue[2]
                            : theme.colors.dark[9]
                        }
                      />
                    ) : (
                      <IconLogin
                        size={17}
                        color={
                          theme.colorScheme === "dark"
                            ? theme.colors.blue[2]
                            : theme.colors.dark[9]
                        }
                      />
                    )}
                  </Button>
                </Popover.Target>
              </Tooltip>
              <Popover.Dropdown p={0}>
                {/* Logout Button  */}
                <Button
                  size="xs"
                  fw={700}
                  px={15}
                  variant="default"
                  leftIcon={<IconCircleX size={15} />}
                  sx={{
                    opacity: 0.35,
                    "&:hover": {
                      opacity: 1,
                      color: "rgba(255, 40, 40, 0.5)",
                    },
                  }}
                  onClick={signOutFunc}
                >
                  LOGOUT
                </Button>
              </Popover.Dropdown>
            </Popover>
          </Group>
          <motion.div
            animate={{
              opacity: [
                1, 1, 1, 0.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.3, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0.3, 1, 0.3, 1,
              ],
            }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            {/* DropDown Button */}
            <IconInfoCircleFilled
              stroke={1}
              size={30}
              style={{
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.blue[2]
                    : theme.colors.red[7],
                paddingTop: "3px",
                cursor: "pointer",
                transform: "scale(1.5)",
              }}
              onClick={openDropDown}
            />
          </motion.div>
        </Flex>
      </Header>
    </>
  );
}
