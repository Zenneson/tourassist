import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { useSessionStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import { RemoveScroll } from "@mantine/core";
import {
  useMantineColorScheme,
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
import { estTimeStamp } from "../../libs/custom";
import { auth } from "../../libs/firebase";

export default function MainMenu(props) {
  const {
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
  } = props;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const router = useRouter();
  const [logoutOpeened, setLogoutOpeened] = useState(false);
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
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

  const recordLogout = async (user) => {
    await updateDoc(doc(firestore, "users", user.email), {
      lastLogout: estTimeStamp(new Date()),
    });
  };

  const signOutFunc = async () => {
    sessionStorage.removeItem("tripData");
    sessionStorage.removeItem("guest");
    sessionStorage.removeItem("placeDataState");
    sessionStorage.removeItem("images");
    sessionStorage.removeItem("tripDesc");
    if (user) {
      await recordLogout(user);
      try {
        await signOut(auth);
      } catch (error) {
        console.log(error);
      }
    }
    sessionStorage.removeItem("user");
    router.push("/");
  };

  if (router.pathname === "/") {
    return null;
  }

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
            src={dark ? "img/TA_GlobeLogo.png" : "img/TA_GlobeRed.png"}
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
          {/* TODO */}
          {user && (
            //  Main Menu Button
            <Button
              variant="subtle"
              size="sm"
              onClick={openMenu}
              radius={"xl"}
              mr={-5}
            >
              <Text fz={12} color={dark ? "gray.0" : "dark.9"}>
                {user.email}
              </Text>
            </Button>
          )}
          {/* TODO   */}
          <Tooltip
            color={dark ? "dark" : "gray.0"}
            c={dark ? "gray.0" : "dark.9"}
            label="Toggle Color Scheme"
            position="bottom"
            withArrow
          >
            <Button
              variant="subtle"
              onClick={() => toggleColorScheme()}
              radius={"xl"}
              p={10}
              c={dark ? "gray.0" : "dark.9"}
            >
              {dark ? <IconBrightnessUp size={17} /> : <IconMoon size={17} />}
            </Button>
          </Tooltip>
          <Group spacing={0}>
            <Tooltip
              color={dark ? "dark" : "gray.0"}
              c={dark ? "gray.0" : "dark.9"}
              label="Search Trips"
              position="bottom"
              withArrow
            >
              {/* Search button */}
              <Button
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
              opened={logoutOpeened}
              onChange={setLogoutOpeened}
            >
              <Tooltip
                color={dark ? "dark" : "gray.0"}
                c={dark ? "gray.0" : "dark.9"}
                label={user ? "Logout" : "Login"}
                position="bottom"
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
                    c={dark ? "gray.0" : "dark.9"}
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
                  onClick={signOutFunc}
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
            <Tooltip
              color={dark ? "dark" : "gray.0"}
              c={dark ? "gray.0" : "dark.9"}
              label={"TourAssist?"}
              position="bottom"
              withArrow
            >
              <IconInfoCircleFilled
                stroke={1}
                size={30}
                style={{
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
    </>
  );
}
