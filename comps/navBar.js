import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
import {
  IconQuestionMark,
  IconLogin,
  IconLogout,
  IconSearch,
} from "@tabler/icons";
import {
  Avatar,
  Header,
  Button,
  Image,
  Group,
  Tooltip,
  Popover,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import Sidebar from "../comps/sidebar";
import {
  searchOpenedState,
  loginOpenedState,
  infoOpenedState,
} from "../libs/atoms";

export default function NavBar() {
  const [infoOpened, setInfoOpened] = useRecoilState(infoOpenedState);
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [logoutOpeened, setLogoutOpeened] = useState(false);
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
      <Header
        zIndex={120}
        hidden={!visible || infoOpened || searchOpened || loginOpened}
        sx={{
          display: "flex",
          padding: "15px 25px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/">
          <Image
            width={"auto"}
            height={50}
            src={"img/blogo.png"}
            alt="TouraSSist_logo"
            withPlaceholder
          />
        </Link>
        <Group>
          {user && (
            <Link href="/profile">
              <Button variant="subtle" radius="xl" pl={0} pr={12} size="xs">
                <Avatar
                  size={25}
                  src={user?.providerData[0].photoURL}
                  radius="xl"
                  mr={7}
                />
                {user?.providerData[0].email}
              </Button>
            </Link>
          )}
          <Group
            spacing={0}
            sx={{
              backgroundColor: "rgba(0,0,0,0.2)",
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
              width="auto"
              position="left"
              withArrow
              shadow="md"
              opened={logoutOpeened}
              onChange={setLogoutOpeened}
            >
              <Tooltip
                label="Login"
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
                  uppercase={true}
                  variant="default"
                  sx={{ color: "rgba(255,255,255,0.3)" }}
                  leftIcon={<IconLogout size={15} />}
                  onClick={function () {
                    signOut(auth)
                      .then(() => {
                        localStorage.removeItem("user");
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
        {visible && !infoOpened && !searchOpened && !loginOpened && <Sidebar />}
      </Header>
    </>
  );
}
