import { BackgroundImage, Box } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { getAuth } from "firebase/auth";
import Intro from "../comps/intro";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const auth = getAuth();

export default function Home() {
  const { height, width } = useViewportSize();

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
      <Intro auth={auth} />
      <Box
        opacity={1}
        pos="absolute"
        w={width}
        h={height}
        sx={{
          zIndex: "1000",
          filter: "brightness(123%)",
          overflow: "hidden",
        }}
      >
        <Slider {...slideSettings}>
          {images.map((image, index) => (
            <BackgroundImage key={index} src={image} h={height} alt="intro" />
          ))}
        </Slider>
      </Box>
    </>
  );
}
