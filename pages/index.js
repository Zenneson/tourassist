import { useState } from "react";
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
import Mymap from "../comps/Mymap";

export default function Home() {
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);

  const [listOpened, setListOpened] = useState(false);
  // <Button onClick={() => setListOpened(true)}>Login</Button>

  const [visible, setVisible] = useState(false);

  const { user, username } = {};

  return (
    <div>
      {!visible && (
        <Center
          sx={{
            position: "absolute",
            height: "100vh",
            width: "100%",
            flexWrap: "wrap",
            zIndex: "105",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              width: "70%",
            }}
          >
            <Title
              order={1}
              sx={{ fontSize: "6rem", marginBottom: "30px", lineHeight: "1" }}
            >
              Where in the{" "}
              <Text
                inherit
                span
                variant="gradient"
                fw={900}
                gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
              >
                world
              </Text>{" "}
              would you like to go?
            </Title>
            <Text size="md" sx={{ width: "90%", marginLeft: "5%" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Box sx={{ marginTop: "30px" }}>
              <Button
                size="md"
                uppercase={true}
                variant="default"
                sx={{ width: "200px", marginRight: "20px" }}
              >
                Login | Sign Up
              </Button>
              <Button
                size="md"
                uppercase={true}
                variant="filled"
                sx={{ width: "200px" }}
                onClick={() => setVisible((v) => !v)}
              >
                Plan a trip
              </Button>
            </Box>
          </Box>
        </Center>
      )}
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
