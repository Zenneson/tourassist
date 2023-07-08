import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { useLocalStorage } from "@mantine/hooks";
import {
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
} from "@tabler/icons-react";
import ProfileDrawer from "./profileDrawer";

export default function MainMenu({
  active,
  setActive,
  profileShow,
  setProfileShow,
  profileOpened,
  setProfileOpened,
  setListOpened,
  searchOpened,
  setSearchOpened,
  loginOpened,
  setTripSelected,
  auth,
}) {
  const [logoutOpeened, setLogoutOpeened] = useState(false);
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

  return (
    <>
      <ProfileDrawer
        active={active}
        setActive={setActive}
        profileShow={profileShow}
        setProfileShow={setProfileShow}
        profileOpened={profileOpened}
        setProfileOpened={setProfileOpened}
        setTripSelected={setTripSelected}
        auth={auth}
      />
      <Header
        zIndex={998}
        bg="none"
        pb={0}
        withBorder={false}
        height={1} // that that the header does not block the middele of the top
        opacity={!visible || searchOpened || loginOpened || mapSpin ? 0 : 1}
        sx={{
          display: "flex",
          padding: "15px 25px",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Flex
          direction={"row"}
          align="center"
          gap={10}
          mt={0}
          ml={-15}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            setProfileOpened((o) => !o);
            setListOpened(false);
            setProfileShow(false);
            setActive(-1);
          }}
        >
          <Image
            ml={5}
            width={"auto"}
            height={"60px"}
            src={"img/TA_GlobeLogo.png"}
            alt="TouraSSist_logo"
            withPlaceholder
          />
          <Title fw={900} color="#fff" fz={30}>
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
              color="dark"
              label="Search Trips"
              position="bottom"
              openDelay={800}
              withArrow
            >
              <Button
                onClick={() => {
                  setSearchOpened(!searchOpened);
                  setProfileOpened(false);
                  setProfileShow(false);
                }}
                variant="subtle"
                radius="xl"
                p={10}
              >
                <IconSearch size={17} />
              </Button>
            </Tooltip>
            {user && (
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
                  color="dark"
                  label={user ? "Logout" : "Login"}
                  position="bottom"
                  openDelay={800}
                  withArrow
                >
                  <Popover.Target>
                    <Button
                      onClick={() => {
                        setLogoutOpeened((o) => !o);
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
                          localStorage.removeItem("placeDataState");
                          setProfileOpened(false);
                          setProfileShow(false);
                          if (router.pathname !== "/") router.push("/");
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
            )}
          </Group>
        </Group>
      </Header>
    </>
  );
}
