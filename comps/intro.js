import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  Center,
  Box,
  Flex,
  Title,
  Text,
  Button,
  Group,
  Overlay,
  Transition,
  Image,
} from "@mantine/core";
import { IconWorld } from "@tabler/icons";
import LoginComp from "./loginComp";
import { useLocalStorage } from "@mantine/hooks";

export default function Intro() {
  const [opened, setOpened] = useState(false);
  const [user, setUser] = useLocalStorage({ key: "user" });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
    defaultValue: true,
  });

  const auth = getAuth();
  useEffect(() => {
    if (user) {
      // setOpened(false);
      setVisible(true);
      setMapSpin(false);
      console.log(user?.email);
    } else {
      setMapSpin(true);
      if (!visible) setOpened(true);
      // setVisible(false);
    }
  }, [user, setVisible, setMapSpin, visible]);

  return (
    <>
      <Transition
        mounted={opened && !user}
        transition="fade"
        duration={250}
        timingFunction="linear"
      >
        {(styles) => (
          <Flex
            style={styles}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: "105",
            }}
          >
            <Center
              opacity={0.9}
              sx={{
                backgroundColor: "#020202",
                height: "100vh",
                width: "50%",
                minWidth: "450px",
                maxWidth: "1000px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                flexDirection: "column",
              }}
            >
              <Image
                mt={-60}
                mb={20}
                mr={3}
                sx={{ width: "100%", maxWidth: "250px" }}
                src={"img/blogo.png"}
                alt="TouraSSist_logo"
                withPlaceholder
              />
              <Box
                sx={{
                  width: "80%",
                  maxWidth: "380px",
                }}
              >
                <LoginComp />
              </Box>
            </Center>
            <Center
              sx={{
                width: "100%",
                height: "100vh",
                flexWrap: "wrap",
                zIndex: "105",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  width: "75%",
                  minWidth: "300px",
                }}
              >
                <Title
                  order={1}
                  fw={900}
                  sx={{
                    fontSize: "4.5rem",
                    marginBottom: "30px",
                    lineHeight: "1",
                  }}
                >
                  Where in the{" "}
                  <Text
                    inherit
                    span
                    variant="gradient"
                    gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
                  >
                    world
                  </Text>{" "}
                  would you like to go?
                </Title>
                <Text size="md" sx={{ width: "90%", marginLeft: "5%" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.
                </Text>
                <Group
                  sx={{
                    marginTop: "30px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    fw={900}
                    size="md"
                    uppercase={true}
                    loaderProps={{ variant: "oval", size: 20 }}
                    variant="gradient"
                    gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
                    sx={{ width: "200px" }}
                    onClick={() => {
                      setMapSpin(false);
                      setOpened(false);
                      setVisible(true);
                    }}
                    leftIcon={
                      <IconWorld size={20} style={{ color: "#00E8FC" }} />
                    }
                  >
                    Plan a trip
                  </Button>
                </Group>
              </Box>
            </Center>
          </Flex>
        )}
      </Transition>
      <Transition
        mounted={mapSpin}
        transition="fade"
        duration={100}
        exitDuration={100}
        timingFunction="linear"
      >
        {(styles) => (
          <Overlay
            style={styles}
            color="rgba(0,0,0,0.9)"
            blur={5}
            zIndex={102}
          />
        )}
      </Transition>
    </>
  );
}
