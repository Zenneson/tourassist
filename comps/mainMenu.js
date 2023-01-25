import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
import { useLocalStorage } from "@mantine/hooks";
import {
  Avatar,
  Header,
  Button,
  Image,
  Group,
  Tooltip,
  Popover,
  Box,
  Text,
} from "@mantine/core";
import {
  IconQuestionMark,
  IconLogin,
  IconLogout,
  IconSearch,
} from "@tabler/icons";
import {
  searchOpenedState,
  loginOpenedState,
  infoOpenedState,
  mapLoadState,
  profileOpenedState,
  profileLinkState,
} from "../libs/atoms";
import ProfileDrawer from "./profileDrawer";

export default function MainMenu() {
  const [infoOpened, setInfoOpened] = useRecoilState(infoOpenedState);
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [logoutOpeened, setLogoutOpeened] = useState(false);
  const [mapLoaded, setMapLoaded] = useRecoilState(mapLoadState);
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [active, setActive] = useRecoilState(profileLinkState);
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
  });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [user, setUser] = useLocalStorage({ key: "user" });

  useEffect(() => {
    if (user) {
      setVisible(true);
      console.log(user?.email);
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
        hidden={
          !visible || infoOpened || searchOpened || loginOpened || mapSpin
        }
        sx={{
          display: "flex",
          padding: "15px 25px",
          alignItems: "flex-start",
          justifyContent: "space-between",
          transition: "all 200ms ease",
        }}
      >
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => {
            if (router.pathname === "/") return;
            setMapLoaded(false);
            router.push("/");
          }}
        >
          <Image
            width={"auto"}
            height={103}
            src={"img/blogo.png"}
            alt="TouraSSist_logo"
            withPlaceholder
            onClick={() => {
              user && setProfileOpened((o) => !o);
              !user && setInfoOpened(true);
              setActive(-1);
            }}
          />
        </Box>
        <Group px={0} py={10} m={0}>
          {user && (
            <Button
              variant="subtle"
              radius="xl"
              pl={0}
              pr={12}
              size="sm"
              bg="rgba(0, 0, 0, 0.4)"
              onClick={() => {
                setProfileOpened((o) => !o);
                setActive(-1);
              }}
            >
              <Avatar
                size={30}
                src={user?.providerData[0].photoURL}
                radius="xl"
                mr={7}
              />
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
            <Tooltip
              label="TourAssist?"
              position="bottom"
              openDelay={800}
              withArrow
            >
              <Button
                onClick={() => setInfoOpened(true)}
                variant="subtle"
                radius="xl"
                p={10}
              >
                <IconQuestionMark size={17} />
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
                    {user ? <IconLogout size={17} /> : <IconLogin size={17} />}
                  </Button>
                </Popover.Target>
              </Tooltip>
              <Popover.Dropdown p={0}>
                <Button
                  size="xs"
                  fw={700}
                  px={17}
                  uppercase={true}
                  variant="default"
                  sx={{ color: "rgba(255,255,255,0.3)" }}
                  leftIcon={<IconLogout size={15} />}
                  onClick={function () {
                    signOut(auth)
                      .then(() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("visible");
                        localStorage.removeItem("mapSpin");
                        router.reload();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  Logout
                </Button>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </Header>
    </>
  );
}
