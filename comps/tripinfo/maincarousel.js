import React, { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { BackgroundImage, Box, Button, Center, Group } from "@mantine/core";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MainCarousel(props) {
  const { tripImages } = props;
  const sliderRef = useRef();

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

  const slides = tripImages.map((image, index) => (
    <BackgroundImage
      key={index}
      src={image}
      h={500}
      maw={650}
      alt="Image Slideshow"
      radius={3}
    />
  ));

  if (tripImages.length === 1) {
    return (
      <Box
        style={{
          boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <BackgroundImage src={tripImages} h={500} w={650} alt="Main Image" />
      </Box>
    );
  }

  return (
    tripImages.length > 0 && (
      <Group spacing={0} w={tripImages.length > 1 ? "auto" : "650px"} h={500}>
        <Center>
          {tripImages.length > 1 && (
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
                  backgroundColor: "transparent",
                  transform: "scale(1.2)",
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
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
              width: "650px",
              height: "500px",
            }}
          >
            {slides}
          </Slider>
          {tripImages.length > 1 && (
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
                  backgroundColor: "transparent",
                  transform: "scale(1.2)",
                },
              }}
            >
              <IconChevronRight size={50} />
            </Button>
          )}
        </Center>
      </Group>
    )
  );
}
