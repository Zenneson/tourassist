import { useState } from "react";
import {
  useMantineColorScheme,
  BackgroundImage,
  Box,
  Group,
  Modal,
  ScrollArea,
  Button,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { getAuth } from "firebase/auth";
import Intro from "../comps/intro";
import Slider from "react-slick";
import Legal from "./legal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const auth = getAuth();

export default function Home() {
  const { height, width } = useViewportSize();
  const { colorScheme } = useMantineColorScheme();
  const [showLegal, setShowLegal] = useState(false);
  const dark = colorScheme === "dark";

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
        zIndex={1500}
        opened={showLegal}
        fullScreen={true}
        onClose={() => setShowLegal(false)}
        scrollAreaComponent={ScrollArea.Autosize}
        withCloseButton={false}
        sx={{
          "& .mantine-ScrollArea-root": {
            "& .mantine-ScrollArea-scrollbar": {
              opacity: 0.3,
              width: 8,
            },
          },
        }}
      >
        <Group pos={"absolute"} right={20} w={"100%"} position="right">
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
        sx={{
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
              sx={{
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
