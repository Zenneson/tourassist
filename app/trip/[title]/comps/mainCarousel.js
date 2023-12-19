"use client";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { Box } from "@mantine/core";
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
} from "@tabler/icons-react";
import Image from "next/image";
import classes from "../styles/mainCarousel.module.css";

export default function MainCarousel(props) {
  const { tripImages, setImagesLoaded } = props;

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
    <Carousel.Slide key={index} pos={"relative"}>
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
    </Carousel.Slide>
  ));

  return (
    tripImages?.length > 0 && (
      <Carousel
        h={500}
        w={"650px"}
        withIndicators
        controlsOffset={-50}
        controlSize={60}
        nextControlIcon={
          <IconChevronCompactRight className={classes.carouselIcon} size={60} />
        }
        previousControlIcon={
          <IconChevronCompactLeft className={classes.carouselIcon} size={60} />
        }
        classNames={{
          controls: classes.controls,
          control: classes.control,
          root: classes.root,
        }}
      >
        {slides}
      </Carousel>
    )
  );
}
