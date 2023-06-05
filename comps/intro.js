import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  Divider,
  BackgroundImage,
} from "@mantine/core";
import { IconWorld, IconInfoSquareRounded } from "@tabler/icons";
import {
  useLocalStorage,
  useMediaQuery,
  useViewportSize,
} from "@mantine/hooks";
import LoginComp from "./loginComp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Intro() {
  const [opened, setOpened] = useState(false);
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
    defaultValue: false,
  });

  const router = useRouter();

  const { height, width } = useViewportSize();
  const firstDown = useMediaQuery("(max-width: 950px)");

  useEffect(() => {
    if (user || localStorage.getItem("noLogin")) {
      setVisible(true);
      setMapSpin(false);
    } else {
      setMapSpin(true);
      if (!visible) setOpened(true);
    }
  }, [user, setVisible, setMapSpin, visible]);

  const slideSettings = {
    dots: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 10000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
    "img/intro/street.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewindow.jpg",
    "img/intro/happyguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/plane.jpg",
  ];

  return (
    <>
      <Transition
        mounted={opened && !user}
        transition="fade"
        duration={250}
        timingFunction="linear"
      >
        {(styles) => (
          <>
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
                opacity={firstDown ? 0 : 1}
                w={firstDown ? 0 : 700}
                h={"100vh"}
                bg={"#020202"}
                sx={{
                  boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                  flexDirection: "column",
                }}
              >
                <Image
                  mb={25}
                  sx={{ width: "100%", maxWidth: "250px" }}
                  src={"img/TA_GlobeLogo.png"}
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
                  sx={{
                    width: "80%",
                    maxWidth: "380px",
                  }}
                >
                  <LoginComp />
                </Box>
              </Center>
              <Center w={"100%"}>
                <Flex
                  direction={"column"}
                  align={"center"}
                  ta={"center"}
                  w={"100%"}
                >
                  <Image
                    hidden={!firstDown}
                    mb={25}
                    sx={{ maxWidth: "45vw" }}
                    src={"img/TA_GlobeLogo.png"}
                    alt="TouraSSist_logo"
                    withPlaceholder
                  />
                  <Title
                    fw={900}
                    fz={"3.5rem"}
                    color="#fff"
                    hidden={!firstDown}
                  >
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
                    <Text fz={!firstDown ? "5.3vw" : "8.5vw"} inherit span>
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
                    color="#fff"
                    variant="solid"
                    opacity={0.15}
                    my={10}
                    w="80%"
                  />
                  <Title
                    order={2}
                    fw={300}
                    fz={!firstDown ? "1.5vw" : "2.4vw"}
                    color="#fff"
                    sx={{
                      textShadow: "0 2px 5px #000",
                    }}
                  >
                    Make your travel plans a reality with the power of your
                    community!
                  </Title>
                  <Text
                    px={40}
                    py={10}
                    fz=".9vw"
                    fw={400}
                    w={"70%"}
                    opacity={0.6}
                    color="#fff"
                    hidden={firstDown}
                    sx={{
                      textShadow: "0 2px 5px #000",
                    }}
                  >
                    Whether you&rsquo;re seeking adventure, exploring new
                    cultures, reuniting with loved ones, pursuing your passions,
                    or making lifelong memories on your honeymoon, here&rsquo;s
                    an assist to make it all possible.
                  </Text>
                  <Group w="100%" position="center" mt={10}>
                    <Button
                      fw={900}
                      size={!firstDown ? "md" : "xs"}
                      uppercase={true}
                      variant="gradient"
                      gradient={{ from: "#393939", to: "#282828", deg: 180 }}
                      onClick={() => {}}
                      leftIcon={
                        <IconInfoSquareRounded
                          size={17}
                          color="rgba(255,255,255,0.25)"
                        />
                      }
                    >
                      Learn More
                    </Button>
                    <Button
                      fw={900}
                      size={!firstDown ? "md" : "xs"}
                      uppercase={true}
                      variant="gradient"
                      gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
                      onClick={() => {
                        setMapSpin(false);
                        setOpened(false);
                        setVisible(true);
                      }}
                      leftIcon={
                        <IconWorld size={14} style={{ color: "#60E4FF" }} />
                      }
                    >
                      Plan a trip
                    </Button>
                  </Group>
                </Flex>
              </Center>
            </Flex>
            <Box
              pos="absolute"
              opacity={0.15}
              w={width}
              h={height}
              sx={{
                zIndex: "104",
                overflow: "hidden",
              }}
            >
              <Slider {...slideSettings}>
                {images.map((image, index) => (
                  <BackgroundImage
                    key={index}
                    src={image}
                    h={height}
                    alt="intro"
                  />
                ))}
              </Slider>
            </Box>
          </>
        )}
      </Transition>
      <Transition
        mounted={mapSpin}
        transition="fade"
        duration={100}
        exitDuration={200}
        timingFunction="linear"
      >
        {(styles) => (
          <Overlay
            style={styles}
            gradient="linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.97) 30%, rgba(0,0,0,1) 100%)"
            opacity={1}
            blur={5}
            zIndex={102}
          />
        )}
      </Transition>
    </>
  );
}
