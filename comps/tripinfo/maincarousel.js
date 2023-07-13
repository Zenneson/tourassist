import React, { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { BackgroundImage, Box, Button, Center, Group } from "@mantine/core";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MainCarousel() {
  const images = [
    "img/women.jpg",
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
    "img/intro/street.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewindow.jpg",
    "img/intro/happyguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/plane.jpg",
  ];

  const sliderRef = useRef();
  const { hovered, ref } = useHover();

  const slideSettings = {
    dots: false,
    fade: true,
    infinite: true,
    autoplay: true,
    swipeToSlide: true,
    speed: 250,
    autoplaySpeed: 5000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

  const slides = images.map((image, index) => (
    <BackgroundImage
      key={index}
      src={image}
      h={500}
      maw={650}
      alt="intro"
      radius={"0 0 3px 3px"}
    />
  ));

  if (images.length === 1) {
    return (
      <Box
        style={{
          borderTop: "3px solid rgba(255,255,255,0.2)",
          boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
          borderRadius: "0 0 3px 3px",
          overflow: "hidden",
        }}
      >
        <BackgroundImage src={images} h={500} w={650} alt="intro" />
      </Box>
    );
  }

  return (
    <Group
      ref={ref}
      spacing={0}
      w={images.length > 1 ? "auto" : "650px"}
      h={500}
    >
      <Center>
        {hovered && images.length > 1 && (
          // Previous Slider Button
          <Button
            h={490}
            mb={7}
            radius={"3px 0 0 3px"}
            onClick={previous}
            variant="outline"
            color={"dark.4"}
            p={0}
            w={"5%"}
            sx={{
              border: "none",
              "&:hover": {
                color: "#fff",
              },
            }}
          >
            <IconChevronLeft size={50} />
          </Button>
        )}
        <Slider
          ref={sliderRef}
          {...slideSettings}
          style={{
            borderTop: "3px solid rgba(255,255,255,0.2)",
            boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
            width: "650px",
            height: "500px",
          }}
        >
          {slides}
        </Slider>
        {hovered && images.length > 1 && (
          // Next Slider Button
          <Button
            h={490}
            mb={7}
            radius={"3px 0 0 3px"}
            onClick={next}
            variant="outline"
            color={"dark.4"}
            p={0}
            w={"5%"}
            sx={{
              border: "none",
              "&:hover": {
                color: "#fff",
              },
            }}
          >
            <IconChevronRight size={50} />
          </Button>
        )}
      </Center>
    </Group>
  );
}
