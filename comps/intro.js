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
import LoginComp from "./loginComp";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

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

  const firstDown = useMediaQuery("(max-width: 1343px)");
  const autoplay = useRef(Autoplay({ delay: 7500 }));

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
                sx={{
                  textAlign: "center",
                  width: "75%",
                  minWidth: "300px",
                }}
              >
                <Carousel
                  loop
                  w="100%"
                  speed={3}
                  height={350}
                  withControls={false}
                  draggable={false}
                  orientation="vertical"
                  plugins={[autoplay.current]}
                  onMouseEnter={autoplay.current.stop}
                  onMouseLeave={autoplay.current.reset}
                  sx={{ overflow: "hidden" }}
                >
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/girl.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/concert.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/planewater.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/coast.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/planewindow.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/lady.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/blueguy.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/boat.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                  <Carousel.Slide>
                    <Image
                      src={"img/intro/swimmers.jpg"}
                      alt="Women Looking at our website"
                      height={350}
                      radius={3}
                    />
                  </Carousel.Slide>
                </Carousel>
                <Title
                  order={1}
                  fw={400}
                  mt={20}
                  hidden={firstDown}
                  transform="uppercase"
                  sx={{
                    fontSize: "2.3vw",
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
                <Divider variant="solid" my={15} opacity={0.7} w="100%" />
                <Title order={2} fw={100}>
                  Make your travel plans a reality with the help of your
                  community!
                </Title>
                <Text px={50} py={10}>
                  Whether you&rsquo;re seeking adventure, exploring new
                  cultures, reuniting with loved ones, pursuing your passions,
                  or making lifelong memories on your honeymoon, here&rsquo;s an
                  assist to make it all possible.
                </Text>
                <Group w="100%" position="center" mt={20}>
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
            opacity={0.77}
            blur={5}
            zIndex={102}
          />
        )}
      </Transition>
    </>
  );
}
