import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { useSessionStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import { Box } from "@mantine/core";
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
  IconInfoCircleFilled,
  IconBrightnessUp,
  IconMoon,
} from "@tabler/icons-react";
import ProfileDrawer from "./profileDrawer";
import { auth } from "../../libs/firebase";
import { useUser } from "../../libs/context";

export default function MainMenu(props) {
  const {
    setListOpened,
    searchOpened,
    setSearchOpened,
    setDropDownOpened,
    colorScheme,
    toggleColorScheme,
  } = props;
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";
  const router = useRouter();
  const [logoutOpened, setLogoutOpened] = useState(false);
  const [mainMenuOpened, setMainMenuOpened] = useSessionStorage({
    key: "mainMenuOpened",
    defaultValue: false,
  });
  const [panelShow, setPanelShow] = useSessionStorage({
    key: "panelShow",
    defaultValue: false,
  });

  const { user } = useUser();

  const [active, setActive] = useSessionStorage({
    key: "active",
    defaultValue: -1,
  });

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
    setMainMenuOpened(false);
    router.push("/", undefined, { shallow: false });
  };

  if (router.pathname === "/") {
    return null;
  }

  return (
    <Box
      sx={{
        userSelect: "none",
      }}
    >
      <ProfileDrawer
        active={active}
        setActive={setActive}
        panelShow={panelShow}
        setPanelShow={setPanelShow}
        mainMenuOpened={mainMenuOpened}
        setMainMenuOpened={setMainMenuOpened}
        openMenu={openMenu}
        signOutFunc={signOutFunc}
      />
      <Header
        zIndex={998}
        bg="none"
        pb={0}
        withBorder={false}
        height={1} // so that the header does not block the middele of the top
        opacity={searchOpened ? 0 : 1}
        sx={{
          display: "flex",
          padding: "15px 25px",
          alignItems: "flex-start",
          justifyContent: "space-between",
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
            src={"img/TA_GlobeLogo.png"}
            alt="TouraSSist_logo"
            withPlaceholder
          />
          <Title fw={900} color={dark ? "gray.0" : "dark.0"} fz={30}>
            <Text fw={500} color={dark ? "gray.5" : "dark.3"} inherit span>
              TOUR
            </Text>
            ASSIST
          </Title>
        </Flex>
        <Flex align={"center"} gap={10} px={0} py={10} mt={10} mr={10}>
          {user && (
            //  Main Menu Button
            <Button
              variant="subtle"
              size="sm"
              onClick={openMenu}
              radius={"xl"}
              mr={-5}
              sx={{
                "&:hover": {
                  background: !dark && "rgba(45, 200, 243, 0.2)",
                },
              }}
            >
              <Text fz={12} color={dark ? "gray.0" : "dark.9"}>
                {user.email}
              </Text>
            </Button>
          )}
          <Tooltip label="Toggle Color Scheme" position="bottom">
            <Button
              variant="subtle"
              onClick={() => toggleColorScheme()}
              radius={"xl"}
              p={10}
              c={dark ? "gray.0" : "dark.9"}
              sx={{
                "&:hover": {
                  background: !dark && "rgba(45, 200, 243, 0.2)",
                },
              }}
            >
              {dark ? <IconBrightnessUp size={17} /> : <IconMoon size={17} />}
            </Button>
          </Tooltip>
          <Group spacing={0}>
            <Tooltip label="Search Trips" position="bottom">
              {/* Search button */}
              <Button
                onClick={openSearch}
                variant="subtle"
                radius="xl"
                mr={5}
                p={10}
                c={dark ? "gray.0" : "dark.9"}
                sx={{
                  "&:hover": {
                    background: !dark && "rgba(45, 200, 243, 0.2)",
                  },
                }}
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
              <Tooltip label={user ? "Logout" : "Login"} position="bottom">
                <Popover.Target>
                  {/* Logout Dropdown */}
                  <Button
                    p={10}
                    radius="xl"
                    variant="subtle"
                    c={dark ? "gray.0" : "dark.9"}
                    onClick={() => {
                      setLogoutOpened((o) => !o);
                    }}
                    sx={{
                      "&:hover": {
                        background: !dark && "rgba(45, 200, 243, 0.2)",
                      },
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
                  size="xs"
                  fw={700}
                  px={15}
                  variant="default"
                  onClick={() => {
                    signOutFunc();
                  }}
                  sx={{
                    opacity: 0.35,
                    "&:hover": {
                      opacity: 1,
                    },
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
                1, 1, 1, 0.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.3, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0.3, 1, 0.3, 1,
              ],
            }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            {/* DropDown Button */}
            <Tooltip label={"TourAssist?"} position="bottom">
              <IconInfoCircleFilled
                stroke={1}
                size={30}
                style={{
                  color: dark ? theme.colors.blue[6] : theme.colors.blue[9],
                  paddingTop: "3px",
                  cursor: "pointer",
                  transform: "scale(1.5)",
                }}
                onClick={openDropDown}
              />
            </Tooltip>
          </motion.div>
        </Flex>
      </Header>
    </Box>
  );
}
