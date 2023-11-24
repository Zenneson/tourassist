"use client";
import { useState, useEffect } from "react";
import {
  useComputedColorScheme,
  useMantineColorScheme,
  Center,
  Box,
  Flex,
  Title,
  Text,
  Button,
  Group,
  Image,
  Divider,
  Tooltip,
} from "@mantine/core";
import {
  IconWorld,
  IconInfoCircle,
  IconBrightnessUp,
  IconMoon,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import LoginComp from "./loginComp";
import classes from "./intro.module.css";

export default function Intro(props) {
  const { auth, setShowLegal } = props;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <>
        <Box
          pos={"absolute"}
          top={5}
          right={5}
          style={{
            zIndex: 1400,
          }}
        >
          <Tooltip label="Toggle Color Scheme" position="left" withArrow>
            <Button
              className={classes.toggleColorButton}
              variant="subtle"
              onClick={() => toggleColorScheme()}
              radius={"xl"}
              p={10}
              c={dark ? "#000" : "#fff"}
            >
              {dark ? <IconBrightnessUp size={17} /> : <IconMoon size={17} />}
            </Button>
          </Tooltip>
        </Box>
        <Flex
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: "1200",
          }}
        >
          <Center
            w={600}
            h={"100vh"}
            bg={dark ? "rgba(2, 2, 2, 0.75)" : "rgba(255, 255, 255, 0.6)"}
            style={{
              backdropFilter: "blur(5px)",
              flexDirection: "column",
              boxShadow: dark
                ? "3px 0 7px rgba(0,0,0,0.5), inset 0 0 50px rgba(0, 0, 0, 0.2)"
                : "3px 0 7px rgba(0, 0, 0, 0.1), inset 0 0 50px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Image
              mb={25}
              style={{ width: "100%", maxWidth: "250px" }}
              src={"img/TA_GlobeLogo.png"}
              alt="TouraSSist_logo"
            />
            <Title
              fw={900}
              color="#fff"
              fz={"2.2rem"}
              style={{
                textShadow: "0 2px 5px rgba(0,0,0,0.15)",
              }}
            >
              <Text fw={500} c={dark ? "#adadad" : "#7e7e7e"} inherit span>
                TOUR
              </Text>
              ASSIST
            </Title>
            <Box
              mt={10}
              pos={"relative"}
              style={{
                width: "80%",
                maxWidth: "380px",
              }}
            >
              <LoginComp auth={auth} setShowLegal={setShowLegal} />
            </Box>
          </Center>
          <Center w={"100%"}>
            <Flex
              direction={"column"}
              align={"center"}
              ta={"center"}
              w={"80%"}
              py={60}
              style={{
                borderRadius: "3px",
                backdropFilter: "blur(10px)",
                border: dark
                  ? "1px solid rgba(0,0,0,0.2)"
                  : "1px solid rgba(255, 255, 255, 0.03)",
                boxShadow: dark
                  ? "0 3px 7px rgba(0,0,0,0.3), inset 0 0 50px rgba(0, 0, 0, 0.2)"
                  : "0 3px 7px rgba(0, 0, 0, 0.1), inset 0 0 50px rgba(0, 0, 0, 0.1)",
                background: dark
                  ? "rgba(2, 2, 2, 0.35)"
                  : "rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* <Image
              mb={25}
              style={{ maxWidth: "45vw" }}
              src={"img/TA_GlobeLogo.png"}
              alt="TouraSSist_logo"
            />
            <Title fw={900} fz={"3.5rem"}>
              <Text fw={500} color={dark ? "#adadad" : "#7e7e7e"} inherit span>
                TOUR
              </Text>
              ASSIST
            </Title> */}
              <Title
                tt={"uppercase"}
                order={1}
                fw={400}
                transform="uppercase"
                fz={"4.3vw"}
                color={"gray.0"}
                style={{
                  textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  lineHeight: "1",
                }}
              >
                <Text
                  fw={900}
                  inherit
                  span
                  variant="gradient"
                  gradient={{ from: "#2DC7F3", to: "#0D3F82", deg: 45 }}
                >
                  Tourist
                </Text>{" "}
                or on{" "}
                <Text
                  fw={900}
                  inherit
                  span
                  variant="gradient"
                  gradient={{ from: "#2DC7F3", to: "#0D3F82", deg: 45 }}
                >
                  Tour
                </Text>
                <br />
                <Text fz={"5.3vw"} inherit span>
                  here&apos;s an{" "}
                  <Text
                    fw={900}
                    inherit
                    span
                    variant="gradient"
                    gradient={{ from: "#2DC7F3", to: "#0D3F82", deg: 45 }}
                  >
                    assist
                  </Text>
                </Text>
              </Title>
              <Divider
                variant="solid"
                my={10}
                w="85%"
                color={dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.3)"}
              />
              <Title order={2} fw={300} fz={"1.5vw"}>
                Make your travel plans a reality with the power of your
                community!
              </Title>
              <Text
                px={40}
                py={10}
                fz=".9vw"
                fw={400}
                w={"90%"}
                opacity={0.6}
                c={dark ? "#fff" : "#000"}
              >
                Whether you&rsquo;re seeking adventure, exploring new cultures,
                reuniting with loved ones, pursuing your passions, or making
                lifelong memories on your honeymoon, here&rsquo;s an assist to
                make it all possible.
              </Text>
              <Group w="100%" justify="center" mt={10}>
                <Button
                  className={classes.infoButton}
                  fw={900}
                  size={"md"}
                  h={44}
                  variant="light"
                  bg={dark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.2)"}
                  c={"#fff"}
                  radius={3}
                  onClick={() => {
                    getPosition();
                    router.push("/map");
                  }}
                  style={{
                    textTransform: "uppercase",
                  }}
                  leftSection={
                    <IconInfoCircle
                      size={30}
                      style={{
                        textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      }}
                    />
                  }
                >
                  tourassit?
                </Button>
                {/* Plan Trip Button */}
                <Button
                  fw={900}
                  size={"md"}
                  variant="gradient"
                  radius={3}
                  style={{
                    textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    textTransform: "uppercase",
                  }}
                  gradient={{ from: "#11a3cc", to: "#0D3F82", deg: 45 }}
                  onClick={() => router.push("/map")}
                  leftSection={
                    <IconWorld
                      size={30}
                      style={{
                        textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      }}
                    />
                  }
                >
                  Let&lsquo;s Go!
                </Button>
              </Group>
            </Flex>
          </Center>
        </Flex>
      </>
    )
  );
}
