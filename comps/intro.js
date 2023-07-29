import {
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
import { useMediaQuery, useSessionStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import LoginComp from "./loginComp";

export default function Intro(props) {
  const { auth } = props;
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const firstDown = useMediaQuery("(max-width: 950px)");
  const [geoLat, setGeoLat] = useSessionStorage({
    key: "geoLatState",
    defaultValue: 37,
  });
  const [geoLng, setGeoLng] = useSessionStorage({
    key: "geoLngState",
    defaultValue: -95,
  });
  const [allowGeo, setAllowGeo] = useSessionStorage({
    key: "allowGeo",
    defaultValue: false,
  });
  const [guest, setGuest] = useSessionStorage({
    key: "guest",
    defaultValue: false,
  });

  const getUserCords = () => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setGeoLat(position.coords.latitude);
        setGeoLng(position.coords.longitude);
        setAllowGeo(true);
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
        setAllowGeo(false);
      }
    );
  };

  const enterSite = () => {
    setGuest(true);
    getUserCords();
    router.push("/map");
  };

  return (
    <>
      <Box
        pos={"absolute"}
        top={5}
        right={5}
        sx={{
          zIndex: 1400,
        }}
      >
        <Tooltip
          color={dark ? "dark" : "gray.0"}
          c={dark ? "gray.0" : "dark.9"}
          label="Toggle Color Scheme"
          position="left"
          withArrow
        >
          <Button
            variant="subtle"
            onClick={() => toggleColorScheme()}
            radius={"xl"}
            p={10}
            c={dark ? "#fff" : "#000"}
          >
            {dark ? <IconBrightnessUp size={17} /> : <IconMoon size={17} />}
          </Button>
        </Tooltip>
      </Box>
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: "1200",
        }}
      >
        <Center
          opacity={firstDown ? 0 : 1}
          w={firstDown ? 0 : 600}
          h={"100vh"}
          bg={dark ? "rgba(2, 2, 2, 0.75)" : "rgba(255, 255, 255, 0.6)"}
          sx={{
            backdropFilter: "blur(5px)",
            flexDirection: "column",
            boxShadow: dark
              ? "3px 0 7px rgba(0,0,0,0.5), inset 0 0 50px rgba(0, 0, 0, 0.2)"
              : "3px 0 7px rgba(0, 0, 0, 0.1), inset 0 0 50px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Image
            mb={25}
            sx={{ width: "100%", maxWidth: "250px" }}
            src={dark ? "img/TA_GlobeLogo.png" : "img/TA_GlobeRed.png"}
            alt="TouraSSist_logo"
            withPlaceholder
          />
          <Title
            fw={900}
            color="#fff"
            fz={"2.2rem"}
            sx={{
              textShadow: "0 2px 5px rgba(0,0,0,0.15)",
            }}
          >
            <Text fw={500} color={dark ? "#adadad" : "#7e7e7e"} inherit span>
              TOUR
            </Text>
            ASSIST
          </Title>
          <Box
            mt={10}
            pos={"relative"}
            sx={{
              width: "80%",
              maxWidth: "380px",
            }}
          >
            <LoginComp auth={auth} />
          </Box>
        </Center>
        <Center w={"100%"}>
          <Flex
            direction={"column"}
            align={"center"}
            ta={"center"}
            w={"80%"}
            py={60}
            sx={{
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
            <Image
              hidden={!firstDown}
              mb={25}
              sx={{ maxWidth: "45vw" }}
              src={dark ? "img/TA_GlobeLogo.png" : "img/TA_GlobeRed.png"}
              alt="TouraSSist_logo"
              withPlaceholder
            />
            <Title fw={900} fz={"3.5rem"} hidden={!firstDown}>
              <Text fw={500} color={dark ? "#adadad" : "#7e7e7e"} inherit span>
                TOUR
              </Text>
              ASSIST
            </Title>
            <Title
              order={1}
              fw={400}
              transform="uppercase"
              fz={!firstDown ? "4.3vw" : "7vw"}
              color={"gray.0"}
              sx={{
                textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                lineHeight: "1",
              }}
            >
              <Divider
                hidden={!firstDown}
                variant="solid"
                mt={5}
                mb={20}
                opacity={0.7}
              />
              <Text
                fw={900}
                inherit
                span
                variant="gradient"
                gradient={
                  dark
                    ? { from: "#2DC7F3", to: "#0D3F82", deg: 45 }
                    : { from: "#fa7500", to: "#820d0d", deg: 45 }
                }
              >
                Tourist
              </Text>{" "}
              or on{" "}
              <Text
                fw={900}
                inherit
                span
                variant="gradient"
                gradient={
                  dark
                    ? { from: "#2DC7F3", to: "#0D3F82", deg: 45 }
                    : { from: "#fa7500", to: "#820d0d", deg: 45 }
                }
              >
                Tour
              </Text>
              <br />
              <Text fz={!firstDown ? "5.3vw" : "8.5vw"} inherit span>
                here&apos;s an{" "}
                <Text
                  fw={900}
                  inherit
                  span
                  variant="gradient"
                  gradient={
                    dark
                      ? { from: "#2DC7F3", to: "#0D3F82", deg: 45 }
                      : { from: "#fa7500", to: "#820d0d", deg: 45 }
                  }
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
            <Title order={2} fw={300} fz={!firstDown ? "1.5vw" : "2.4vw"}>
              Make your travel plans a reality with the power of your community!
            </Title>
            <Text
              px={40}
              py={10}
              fz=".9vw"
              fw={400}
              w={"90%"}
              opacity={0.6}
              hidden={firstDown}
              color={dark ? "#fff" : "#000"}
            >
              Whether you&rsquo;re seeking adventure, exploring new cultures,
              reuniting with loved ones, pursuing your passions, or making
              lifelong memories on your honeymoon, here&rsquo;s an assist to
              make it all possible.
            </Text>
            <Group w="100%" position="center" mt={10}>
              <Button
                fw={900}
                size={!firstDown ? "md" : "sm"}
                uppercase={true}
                h={44}
                variant="light"
                bg={dark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.2)"}
                c={"#fff"}
                radius={3}
                onClick={enterSite}
                sx={{
                  textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  border: dark ? "none" : "1px solid rgba(255,255,255,0.07)",
                }}
                leftIcon={
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
                size={!firstDown ? "md" : "sm"}
                uppercase={true}
                variant="gradient"
                radius={3}
                sx={{
                  textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
                gradient={
                  dark
                    ? { from: "#11a3cc", to: "#0D3F82", deg: 45 }
                    : { from: "#b85906", to: "#820d0d", deg: 45 }
                }
                onClick={enterSite}
                leftIcon={
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
