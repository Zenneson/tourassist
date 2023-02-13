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
} from "@mantine/core";
import { IconWorld, IconInfoSquareRounded } from "@tabler/icons";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
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
    autoplaySpeed: 5000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    "img/intro/girl.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewater.jpg",
    "img/intro/coast.jpg",
    "img/intro/planewindow.jpg",
    "img/intro/lady.jpg",
    "img/intro/blueguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/swimmers.jpg",
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
              opacity={0.9}
              sx={{
                backgroundColor: "#020202",
                height: "100vh",
                minWidth: "450px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                flexDirection: "column",
              }}
            >
              <Image
                mb={20}
                sx={{ width: "100%", maxWidth: "350px" }}
                src={"img/TA_circle_blue.png"}
                alt="TouraSSist_logo"
                withPlaceholder
              />
              <Image
                src={"img/tourassist_text.svg"}
                alt="TouraSSist_text"
                sx={{ width: "80%", maxWidth: "350px" }}
              />
              <Divider
                variant="solid"
                mt={25}
                opacity={0.7}
                sx={{ width: "100%", maxWidth: "380px" }}
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
                w={firstDown ? "90%" : "50vw"}
                sx={{
                  textAlign: "center",
                  minWidth: "300px",
                }}
              >
                <Flex
                  direction="column"
                  align="center"
                  gap={20}
                  my={20}
                  hidden={!firstDown}
                >
                  <Image
                    sx={{ maxWidth: "250px" }}
                    src={"img/TA_circle_blue.png"}
                    alt="TouraSSist_logo"
                    withPlaceholder
                  />
                  <Image
                    src={"img/tourassist_text.svg"}
                    alt="TouraSSist_text"
                    sx={{ maxWidth: "250px" }}
                  />
                </Flex>
                <Slider {...slideSettings}>
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      w="100%"
                      mb={-10}
                      src={image}
                      alt="intro"
                    />
                  ))}
                </Slider>
                <Title
                  order={1}
                  fw={400}
                  mt={20}
                  transform="uppercase"
                  fz={firstDown ? "4.1vw" : "2.3vw"}
                  sx={{
                    lineHeight: "1.1",
                  }}
                >
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
                  , here&apos;s an{" "}
                  <Text
                    fw={900}
                    inherit
                    span
                    variant="gradient"
                    gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
                  >
                    assist
                  </Text>
                </Title>
                <Divider variant="solid" my={7} opacity={0.4} w="100%" />
                <Title
                  order={2}
                  fw={100}
                  fz={firstDown ? "2.8vw" : "1.56vw"}
                  color="#fff"
                >
                  Make your travel plans a reality with the help of your
                  community!
                </Title>
                <Text px={20} py={10} fz=".9vw" color="dimmed">
                  Whether you&rsquo;re seeking adventure, exploring new
                  cultures, reuniting with loved ones, pursuing your passions,
                  or making lifelong memories on your honeymoon, here&rsquo;s an
                  assist to make it all possible.
                </Text>
                <Group w="100%" position="center" mt={10}>
                  <Button
                    fw={900}
                    size="md"
                    uppercase={true}
                    variant="gradient"
                    gradient={{ from: "#393939", to: "#282828", deg: 180 }}
                    onClick={() => {}}
                    leftIcon={
                      <IconInfoSquareRounded
                        size={23}
                        color="rgba(255,255,255,0.25)"
                      />
                    }
                  >
                    Learn More
                  </Button>
                  <Button
                    fw={900}
                    size="md"
                    uppercase={true}
                    variant="gradient"
                    gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
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
            color="#000"
            opacity={0.88}
            blur={7}
            zIndex={102}
          />
        )}
      </Transition>
    </>
  );
}
