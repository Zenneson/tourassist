import { useEffect } from "react";
import { BackgroundImage, Box } from "@mantine/core";
import { useSessionStorage, useViewportSize } from "@mantine/hooks";
import { getAuth } from "firebase/auth";
import Intro from "../comps/intro";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const auth = getAuth();

export default function Home() {
  const { height, width } = useViewportSize();
  const [geoLat, setGeoLat] = useSessionStorage({
    key: "geoLatState",
    defaultValue: 37,
  });
  const [geoLng, setGeoLng] = useSessionStorage({
    key: "geoLngState",
    defaultValue: -95,
  });

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
    "slides/slide1.png",
    "slides/slide2.png",
    "slides/slide3.png",
    "slides/slide4.png",
    "slides/slide5.png",
    "slides/slide6.png",
    "slides/slide7.png",
    "slides/slide8.png",
    "slides/slide10.png",
    "slides/slide11.png",
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setGeoLat(position.coords.latitude);
        setGeoLng(position.coords.longitude);
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, [geoLat, geoLng, setGeoLat, setGeoLng]);

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
