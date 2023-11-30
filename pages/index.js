"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import {
  useComputedColorScheme,
  BackgroundImage,
  Box,
  Group,
  Modal,
  Button,
  ScrollArea,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { getAuth } from "firebase/auth";
import classes from "./index.module.css";
import Slider from "react-slick";
import Intro from "../comps/intro";
import Legal from "./legal";

const auth = getAuth();
export default function Home(props) {
  const { height, width } = useViewportSize();
  const [showLegal, setShowLegal] = useState(false);

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const slideSettings = {
    dots: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 5000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    "ppl/ppl1.jpg",
    "ppl/ppl2.jpg",
    "ppl/ppl3.jpg",
    "ppl/ppl4.jpg",
    "ppl/ppl5.jpg",
    "ppl/ppl6.jpg",
    "ppl/ppl7.jpg",
    "ppl/ppl8.jpg",
  ];

  return (
    <>
      <Modal
        className={classes.legalModal}
        zIndex={1500}
        opened={showLegal}
        fullScreen={true}
        onClose={() => setShowLegal(false)}
        scrollAreaComponent={ScrollArea.Autosize}
        withCloseButton={false}
      >
        <Group pos={"absolute"} right={20} w={"100%"} justify="flex-end">
          <Button variant="default" onClick={() => setShowLegal(false)}>
            CLOSE
          </Button>
        </Group>
        <Legal />
      </Modal>
      <Intro auth={auth} setShowLegal={setShowLegal} />
      <Box
        opacity={1}
        pos="absolute"
        w={width}
        h={height}
        style={{
          zIndex: "1000",
          filter: "brightness(123%)",
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
              style={{
                filter: dark
                  ? "brightness(70%) saturate(144%)"
                  : "brightness(110%) saturate(100%)",
              }}
            />
          ))}
        </Slider>
      </Box>
    </>
  );
}
