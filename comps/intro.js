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
} from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import { useMediaQuery, useSessionStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import LoginComp from "./loginComp";

export default function Intro(props) {
  const { auth } = props;
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const firstDown = useMediaQuery("(max-width: 950px)");

  const [guest, setGuest] = useSessionStorage({
    key: "guest",
    defaultValue: false,
  });

  const enterSite = () => {
    setGuest(true);
    router.push("/map");
  };

  return (
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
        w={firstDown ? 0 : 700}
        h={"100vh"}
        bg={dark ? "rgba(2, 2, 2, 0.5)" : "rgba(255, 255, 255, 0.5)"}
        sx={{
          backdropFilter: "blur(50px)",
          flexDirection: "column",
        }}
      >
        <Image
          mb={25}
          sx={{ width: "100%", maxWidth: "250px" }}
          src={dark ? "img/TA_GlobeLogo.png" : "img/TA_GlobeRed.png"}
          alt="TouraSSist_logo"
          withPlaceholder
        />
        <Title fw={900} color="#fff" fz={"2.2rem"}>
          <Text fw={500} color="#adadad" inherit span>
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
      <Center
        bg={dark ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.9)"}
        w={"100%"}
        sx={
          {
            // backdropFilter: "blur(20px)",
          }
        }
      >
        <Flex
          direction={"column"}
          align={"center"}
          ta={"center"}
          w={"100%"}
          py={50}
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
            <Text fw={500} color="#adadad" inherit span>
              TOUR
            </Text>
            ASSIST
          </Title>
          <Title
            order={1}
            fw={400}
            transform="uppercase"
            fz={!firstDown ? "4.3vw" : "7vw"}
            sx={{
              lineHeight: "1",
              textShadow: "0 2px 5px rgba(0,0,0,0.2)",
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
          <Divider variant="solid" opacity={0.15} my={10} w="80%" />
          <Title order={2} fw={300} fz={!firstDown ? "1.5vw" : "2.4vw"}>
            Make your travel plans a reality with the power of your community!
          </Title>
          <Text
            px={40}
            py={10}
            fz=".9vw"
            fw={400}
            w={"70%"}
            opacity={0.6}
            hidden={firstDown}
          >
            Whether you&rsquo;re seeking adventure, exploring new cultures,
            reuniting with loved ones, pursuing your passions, or making
            lifelong memories on your honeymoon, here&rsquo;s an assist to make
            it all possible.
          </Text>
          <Group w="100%" position="center" mt={10}>
            {/* Plan Trip Button  */}
            <Button
              fw={900}
              size={!firstDown ? "xl" : "sm"}
              uppercase={true}
              variant="gradient"
              radius={"xl"}
              gradient={
                dark
                  ? { from: "#2DC7F3", to: "#0D3F82", deg: 45 }
                  : { from: "#fa7500", to: "#820d0d", deg: 45 }
              }
              onClick={enterSite}
              leftIcon={
                <IconWorld
                  size={30}
                  style={{ color: dark ? "#0D3F82" : "#820d0d" }}
                />
              }
            >
              Let&lsquo;s Go!
            </Button>
          </Group>
        </Flex>
      </Center>
    </Flex>
  );
}
