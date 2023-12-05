"use client";
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
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  return (
    <>
      <Box className={classes.colorBtnFrame}>
        <Tooltip label="Toggle Color Scheme" position="left" withArrow>
          <Button
            className={classes.toggleColorButton}
            variant="subtle"
            onClick={() => toggleColorScheme()}
            radius={"xl"}
            p={10}
          >
            <>
              <IconBrightnessUp size={17} className={classes.lightIcon} />
              <IconMoon size={17} className={classes.darkIcon} />
            </>
          </Button>
        </Tooltip>
      </Box>
      <Flex className={classes.introLayoutFlex}>
        <Center className={classes.introBg} w={600} h={"100vh"}>
          <Image
            mb={25}
            w={"100%"}
            maw={"250px"}
            src={"img/TA_GlobeLogo.png"}
            alt="TouraSSist_logo"
          />
          <Title className={classes.loginTitle}>
            <Text className={classes.loginTitleThin} inherit span>
              TOUR
            </Text>
            ASSIST
          </Title>
          <Box className={classes.loginCompFrame} mt={10}>
            <LoginComp auth={auth} setShowLegal={setShowLegal} />
          </Box>
        </Center>
        <Center w={"100%"}>
          <Flex
            className={classes.introFrame}
            direction={"column"}
            align={"center"}
            py={60}
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
              className={classes.introTitle}
              tt={"uppercase"}
              order={1}
              fw={400}
              transform="uppercase"
              fz={"4.3vw"}
              color={"gray.0"}
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
              Make your travel plans a reality with the power of your community!
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
                leftSection={
                  <IconInfoCircle className={classes.infoIcon} size={30} />
                }
              >
                tourassist?
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
  );
}
