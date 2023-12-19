"use client";
import { Box, Group } from "@mantine/core";
import Image from "next/image";

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
        Placeholder
      </Group>
    )
  );
}
