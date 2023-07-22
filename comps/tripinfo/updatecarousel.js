import { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { BackgroundImage, Button, Group } from "@mantine/core";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function UpdateCarousel({ images }) {
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

  if (images.length === 1) {
    return (
      <BackgroundImage
        radius={3}
        src={images[0]}
        h={300}
        mx={"5%"}
        mb={30}
        alt="intro"
      />
    );
  }

  return (
    <Group
      ref={ref}
      spacing={0}
      w={"100%"}
      h={300}
      mb={30}
      sx={{ overflow: "hidden" }}
    >
      {hovered && (
        // Previous Image Button
        <Button
          h={"80%"}
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
          marginLeft: hovered ? 0 : "5%",
          width: "calc(100% - 10%)",
        }}
      >
        {images.map((image, index) => (
          <BackgroundImage
            radius={3}
            key={index}
            src={image}
            h={300}
            alt="intro"
          />
        ))}
      </Slider>
      {hovered && (
        // Next Image Button
        <Button
          h={"80%"}
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
    </Group>
  );
}
