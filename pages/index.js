import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import {
  Title,
  Text,
  Center,
  Box,
  Overlay,
  AppShell,
  Header,
  Autocomplete,
  Drawer,
  Button,
  Image,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import Intro from "../comps/intro";
import Mymap from "../comps/mymap";

export const visibleState = atom({
  key: "visibleState",
  default: false,
});

export default function Home() {
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);

  const [listOpened, setListOpened] = useState(false);
  // <Button onClick={() => setListOpened(true)}>Login</Button>

  const [visible, setVisible] = useRecoilState(visibleState);

  const { user, username } = {};

  return (
    <div>
      <Intro />
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        {!visible && <Overlay opacity={0.9} color="#000" zIndex={102} />}
        <AppShell
          padding="none"
          header={
            <Header
              height={{ base: 50, md: 70 }}
              p="md"
              zIndex={100}
              hidden={!visible}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                {/* Mobile Menu Burger */}
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery>
                <Link href="/">
                  <Image
                    width={"auto"}
                    height={50}
                    src={"img/blogo.png"}
                    alt="TouraSSist_logo"
                    withPlaceholder
                  />
                </Link>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                  <>
                    {username && (
                      <Link href={`/${username}`}>
                        <Image
                          alt="Profile"
                          src={user?.photoURL}
                          sx={{
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            cursor: "pointer",
                          }}
                        />
                      </Link>
                    )}
                    {!username && (
                      <Button component="a" href="/enter">
                        Login
                      </Button>
                    )}
                  </>
                </MediaQuery>
              </div>
            </Header>
          }
        >
          {visible && (
            <Autocomplete
              placeholder="Search for a location"
              transition="slide-up"
              size="lg"
              radius="xl"
              data={["1", "2", "3", "4", "5"]}
              style={{
                position: "absolute",
                bottom: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "500px",
                zIndex: 100,
              }}
            />
          )}
          <Drawer
            opened={listOpened}
            onClose={() => setListOpened(false)}
            withOverlay={false}
            withCloseButton={false}
            zIndex={99}
            padding="xl"
          >
            <div
              style={{
                paddingTop: "35px",
              }}
            >
              <h2>List</h2>
            </div>
          </Drawer>
          <Mymap />
        </AppShell>
      </Box>
    </div>
  );
}
