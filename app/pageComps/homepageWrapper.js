"use client";
import Intro from "@globalComps/intro/intro";
import PageLoader from "@globalComps/pageLoader/pageLoader";
import { BackgroundImage, Box, useComputedColorScheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useState } from "react";
import classes from "../styles/page.module.css";

const Carousel = ({ children, interval = 5000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      setActiveIndex((current) => (current + 1) % children.length);
    }, interval);

    return () => clearInterval(tick);
  }, [children.length, interval]);

  return (
    <div>
      {children.map((child, index) => (
        <div
          key={index}
          className={`${classes.carouselItem} ${
            index === activeIndex ? classes.carouselItemVisible : ""
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
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

export default function HomepageWrapper() {
  const { height, width } = useViewportSize();
  const [pageLoaded, setPageLoaded] = useState(false);

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      {/* Show Legal Docs Modal  */}
      <Intro />
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
        <PageLoader contentLoaded={pageLoaded} />
        <Carousel>
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
        </Carousel>
      </Box>
    </>
  );
}
