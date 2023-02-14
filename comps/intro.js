import { useState, useEffect, useRef } from "react";
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
  Divider,
  BackgroundImage,
} from "@mantine/core";
import { IconWorld, IconInfoSquareRounded } from "@tabler/icons";
import {
  useLocalStorage,
  useMediaQuery,
  useViewportSize,
} from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import LoginComp from "./loginComp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const { height, width } = useViewportSize();
  const firstDown = useMediaQuery("(max-width: 950px)");
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  const auth = getAuth();
  useEffect(() => {
    if (user) {
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
    speed: 2000,
    autoplaySpeed: 8000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    "img/intro/bluehair.jpg",
    "img/intro/coast.jpg",
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
                hidden={firstDown}
                sx={{
                  backgroundColor: "#020202",
                  height: "100vh",
                  minWidth: "450px",
                  boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                  flexDirection: "column",
                }}
              >
                <Image
                  mb={25}
                  sx={{ width: "100%", maxWidth: "250px" }}
                  src={"img/TA_circle_blue.png"}
                  alt="TouraSSist_logo"
                  withPlaceholder
                />
                <Image
                  src={"img/tourassist_text.svg"}
                  alt="TouraSSist_text"
                  sx={{ width: "80%", maxWidth: "250px" }}
                />
                <Divider
                  variant="solid"
                  mt={25}
                  opacity={0.6}
                  sx={{ width: "80%" }}
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
                    src={"img/TA_circle_blue.png"}
                    alt="TouraSSist_logo"
                    withPlaceholder
                  />
                  <Image
                    hidden={!firstDown}
                    src={"img/tourassist_text.svg"}
                    alt="TouraSSist_text"
                    sx={{ maxWidth: "45vw" }}
                  />
                  <Title
                    order={1}
                    fw={400}
                    mt={20}
                    transform="uppercase"
                    fz={!firstDown ? "4.3vw" : "7vw"}
                    sx={{
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
                      gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
                    >
                      Tourist
                    </Text>{" "}
                    or on{" "}
                    <Text
                      fw={900}
                      inherit
                      span
                      variant="gradient"
                      gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
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
                        gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
                      >
                        assist
                      </Text>
                    </Text>
                  </Title>
                  <Divider variant="solid" my={7} opacity={0.7} w="80%" />
                  <Title
                    order={2}
                    fw={100}
                    fz={!firstDown ? "1.5vw" : "2.4vw"}
                    color="#fff"
                  >
                    Make your travel plans a reality with the help of your
                    community!
                  </Title>
                  <Text
                    px={80}
                    py={10}
                    fz=".9vw"
                    w={"60%"}
                    color="dimmed"
                    hidden={firstDown}
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
                        <IconWorld size={14} style={{ color: "#00E8FC" }} />
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
              opacity={0.08}
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
        exitDuration={100}
        timingFunction="linear"
      >
        {(styles) => (
          <Overlay
            style={styles}
            color="#000"
            opacity={0.85}
            blur={7}
            zIndex={102}
          />
        )}
      </Transition>
    </>
  );
}
