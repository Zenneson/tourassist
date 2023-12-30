"use client";
import { useTripState } from "@libs/store";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
} from "@tabler/icons-react";
import Image from "next/image";
import { useImagesLoaded } from "../page";
import classes from "../styles/mainCarousel.module.css";

export default function MainCarousel() {
  const { tripImages } = useTripState();
  const { setImagesLoaded } = useImagesLoaded();

  const slides = tripImages?.map((image, index) => (
    <CarouselSlide key={index} pos={"relative"}>
      <Image
        fetchPriority="high"
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
    </CarouselSlide>
  ));

  return (
    <Carousel
      h={500}
      w={"650px"}
      withIndicators={tripImages.length > 1}
      controlsOffset={-50}
      controlSize={60}
      nextControlIcon={
        <IconChevronCompactRight className={classes.carouselIcon} size={60} />
      }
      previousControlIcon={
        <IconChevronCompactLeft className={classes.carouselIcon} size={60} />
      }
      classNames={{
        indicators: classes.indicators,
        indicator: tripImages.length > 1 && classes.indicator,
        controls: classes.controls,
        control: classes.control,
        root: classes.root,
      }}
    >
      {slides}
    </Carousel>
  );
}
