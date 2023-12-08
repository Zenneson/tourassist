import { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Box, Button, Center, Group } from "@mantine/core";
import Image from "next/image";
import classes from "./styles/maincarousel.module.css";
import Slider from "react-slick";

export default function MainCarousel(props) {
  const { tripImages, setImagesLoaded } = props;
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
    lazyLoad: null,
  };

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

  if (tripImages?.length === 1) {
    return (
      <Box
        style={{
          position: "relative",
          boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
          borderRadius: "3px",
          overflow: "hidden",
          height: "500px",
          width: "650px",
        }}
      >
        <Image
          priority="true"
          loading="eager"
          onLoad={() => {
            setImagesLoaded(true);
          }}
          src={tripImages[0].file}
          height={500}
          width={650}
          alt="Main Image"
          style={{
            transition: "none",
          }}
        />
      </Box>
    );
  }

  const slides = tripImages?.map((image, index) => (
    <Box key={index} pos={"relative"}>
      <Image
        priority="true"
        loading="eager"
        onLoad={() => {
          setImagesLoaded(true);
        }}
        src={image.file}
        height={500}
        width={650}
        alt="Image Slideshow"
        style={{
          transition: "none",
          borderRadius: "3px",
          boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
        }}
      />
    </Box>
  ));

  return (
    tripImages?.length > 0 && (
      <Group
        gap={0}
        w={tripImages?.length > 1 ? "auto" : "650px"}
        h={500}
        style={{
          overflow: "hidden",
        }}
      >
        <Center>
          {tripImages?.length > 1 && (
            // Previous Slider Button
            <Button
              className={classes.prevSliderButton}
              h={500}
              radius={"3px 0 0 3px"}
              onClick={previous}
              variant="outline"
              color={"dark.4"}
              p={0}
              w={"5%"}
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
          {tripImages?.length > 1 && (
            // Next Slider Button
            <Button
              className={classes.nextSliderButton}
              h={500}
              radius={"3px 0 0 3px"}
              onClick={next}
              variant="outline"
              color={"dark.4"}
              p={0}
              w={"5%"}
            >
              <IconChevronRight size={50} />
            </Button>
          )}
        </Center>
      </Group>
    )
  );
}
