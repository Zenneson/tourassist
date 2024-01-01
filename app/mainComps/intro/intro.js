"use client";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrightnessUp,
  IconInfoCircle,
  IconMoon,
  IconWorld,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginComp from "../login/loginComp";
import classes from "./styles/intro.module.css";

export default function Intro() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const toggleColorScheme = () => {
    setColorScheme(dark ? "light" : "dark");
  };

  useEffect(() => {
    router.prefetch("/map");
  }, [router]);

  return (
    <>
      <Box className={classes.colorBtnFrame}>
        <Tooltip
          className={classes.colorBtnTooltip}
          label="Toggle Color Scheme"
          position="left"
          zIndex={9999}
          withArrow
        >
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
            width={235}
            height={235}
            src={"/img/TA_GlobeLogo.png"}
            alt="TouraSSist_logo"
          />
          <Title mt={15} className={classes.loginTitle}>
            <Text className={classes.loginTitleThin} inherit span>
              TOUR
            </Text>
            ASSIST
          </Title>
          <Box className={classes.loginCompFrame} mt={10}>
            <LoginComp />
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
              width={235}
              height={235}
              style={{ maxWidth: "45vw" }}
              src={"/img/TA_GlobeLogo.png"}
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
              className={classes.introFrameDivider}
              variant="solid"
              my={10}
            />
            <Title order={2} fw={300} fz={"1.5vw"}>
              Make your travel plans a reality with the power of your community!
            </Title>
            <Text className={classes.introText} px={40} py={10}>
              Whether you&rsquo;re seeking adventure, exploring new cultures,
              reuniting with loved ones, pursuing your passions, or making
              lifelong memories on your honeymoon, here&rsquo;s an assist to
              make it all possible.
            </Text>
            <Group w="100%" justify="center" mt={10}>
              <Button
                className={classes.infoButton}
                size={"md"}
                h={44}
                variant="light"
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
                className={classes.enterSiteBtn}
                fw={900}
                size={"md"}
                variant="gradient"
                radius={3}
                gradient={{ from: "#11a3cc", to: "#0D3F82", deg: 45 }}
                onClick={() => router.push("/map")}
                leftSection={
                  <IconWorld className={classes.enterSiteIcon} size={30} />
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
