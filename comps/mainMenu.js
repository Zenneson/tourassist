import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
import { useLocalStorage } from "@mantine/hooks";
import {
  Header,
  Button,
  Image,
  Group,
  Tooltip,
  Popover,
  Box,
  Text,
  Flex,
  Title,
} from "@mantine/core";
import {
  IconQuestionMark,
  IconLogin,
  IconSearch,
  IconDoorExit,
  IconCircleX,
} from "@tabler/icons";
import {
  searchOpenedState,
  loginOpenedState,
  mapLoadState,
  profileOpenedState,
  profileLinkState,
  listOpenedState,
  profileShowState,
} from "../libs/atoms";
import ProfileDrawer from "./profileDrawer";

export default function MainMenu() {
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [logoutOpeened, setLogoutOpeened] = useState(false);
  const [mapLoaded, setMapLoaded] = useRecoilState(mapLoadState);
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [profileShow, setProfileShow] = useRecoilState(profileShowState);
  const [active, setActive] = useRecoilState(profileLinkState);
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
  });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });

  useEffect(() => {
    if (user) {
      setVisible(true);
    }
  }, [user, setVisible]);

  const router = useRouter();
  const auth = getAuth();

  return (
    <>
      <ProfileDrawer />
      <Header
        zIndex={120}
        bg="none"
        withBorder={false}
        hidden={!visible || searchOpened || loginOpened || mapSpin}
        sx={{
          display: "flex",
          padding: "15px 25px",
          alignItems: "flex-start",
          justifyContent: "space-between",
          transition: "all 200ms ease",
        }}
      >
        <Flex
          align="center"
          gap={10}
          mt={10}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            user && setProfileOpened((o) => !o);
            user && setListOpened(false);
            user && setProfileShow(false);
            setActive(-1);
          }}
        >
          <Image
            ml={4} //centers the logo and text when the menu is opened
            width="65px"
            height="auto"
            src={"img/TA_logo.png"}
            alt="TouraSSist_logo"
            withPlaceholder
          />
          <Title fw={900} color="#fff" fz={28}>
            <Text fw={500} color="#adadad" inherit span>
              TOUR
            </Text>
            ASSIST
          </Title>
        </Flex>
        <Group px={0} py={10} m={0}>
          {user && (
            <Button
              variant="subtle"
              radius="xl"
              px={15}
              size="sm"
              bg="rgba(0, 0, 0, 0.4)"
              onClick={() => {
                setListOpened(false);
                setProfileOpened((o) => !o);
                setProfileShow(false);
                setActive(-1);
              }}
            >
              <Text fz={12} c="rgba(255, 255, 255, 0.5)">
                {user?.providerData[0].email}
              </Text>
            </Button>
          )}
          <Group
            spacing={0}
            sx={{
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: "50px",
            }}
          >
            <Tooltip
              label="Search Trips"
              position="bottom"
              openDelay={800}
              withArrow
            >
              <Button
                onClick={() => setSearchOpened(true)}
                variant="subtle"
                radius="xl"
                p={10}
              >
                <IconSearch size={17} />
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
                label={user ? "Logout" : "Login"}
                position="bottom"
                openDelay={800}
                withArrow
              >
                <Popover.Target>
                  <Button
                    onClick={() => {
                      if (!user) setLoginOpened(true);
                      if (user) setLogoutOpeened((o) => !o);
                    }}
                    variant="subtle"
                    radius="xl"
                    p={10}
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
                  onClick={function () {
                    signOut(auth)
                      .then(() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("visible");
                        localStorage.removeItem("mapSpin");
                        setProfileOpened(false);
                        setProfileShow(false);
                        if (router.pathname !== "/")
                          router.push("/", undefined, { shallow: true });
                        else {
                          router.reload();
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  LOGOUT
                </Button>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </Header>
    </>
  );
}
