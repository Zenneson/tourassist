import { useRef } from "react";
import {
  ActionIcon,
  BackgroundImage,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Menu,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconSourceCode,
  IconBrandWhatsapp,
  IconShare,
} from "@tabler/icons";
import { useHover } from "@mantine/hooks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Update() {
  const { hovered, ref } = useHover();
  const [showall, toggle] = useToggle(["hide", "show"]);

  const sliderRef = useRef();

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

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

  const imagesone = [
    "img/women.jpg",
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
  ];

  const imagestwo = [
    "img/intro/street.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewindow.jpg",
  ];

  const imagesthree = [
    "img/intro/happyguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/plane.jpg",
  ];

  const updateData = [
    {
      month: "May",
      day: "5",
      year: "2023",
      updateImages: imagesone,
      title: "Heres an update on the Trip",
      content:
        "Hello from Bali! Day 5 included sunrise yoga, an Indonesian cooking class, and exploring Tegalalang Rice Terraces. We ended with exhilarating whitewater rafting on the Ayung River. New friendships and unforgettable memories are forming in this paradise.",
    },
    {
      month: "June",
      day: "1",
      year: "2023",
      updateImages: imagestwo,
      title: "Another upadate on the Trip",
      content:
        "Greetings from Ubud! On Day 6, we visited the enchanting Sacred Monkey Forest Sanctuary, where we interacted with friendly, curious macaques. Afterwards, we indulged in a rejuvenating Balinese massage at a serene spa, leaving us feeling refreshed.",
    },
    {
      month: "July",
      day: "4",
      year: "2023",
      updateImages: imagesthree,
      title: "Update number 3 of the trip",
      content:
        "Hello from Uluwatu! Day 7 brought us to the stunning Uluwatu Temple, perched atop dramatic cliffs overlooking the Indian Ocean. As the sun set, we watched a captivating Kecak fire dance performance. We wrapped up the day with a beachside seafood feast, savoring the island's flavors.",
    },
  ];

  function Carousel({ images }) {
    const sliderRef = useRef();
    const { hovered, ref } = useHover();

    const next = () => {
      sliderRef.current.slickNext();
    };

    const previous = () => {
      sliderRef.current.slickPrev();
    };

    return (
      <Group
        ref={ref}
        spacing={0}
        w={"100%"}
        h={300}
        sx={{ overflow: "hidden", borderRadius: "5px" }}
      >
        {hovered && (
          <Button
            h={300}
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
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.2)",
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
          <Button
            h={300}
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
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            }}
          >
            <IconChevronRight size={50} />
          </Button>
        )}
      </Group>
    );
  }

  const updates = updateData.map((update, index) => (
    <Flex
      key={index}
      radius={3}
      bg={"rgba(0,0,0,0.05)"}
      w={"85%"}
      mt={20}
      py={20}
      px={30}
      fz={14}
      gap={10}
      sx={{
        border: "1px solid rgba(0,0,0,0.15)",
        borderTop: "3px solid rgba(255,255,255,0.1)",
        boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
      }}
    >
      <Flex direction={"column"} w={"15%"}>
        <Stack
          spacing={0}
          sx={{
            borderRadius: "3px",
            overflow: "hidden",
            boxShadow: "0 2px 10px 0 rgba(0,0,0,0.1)",
          }}
        >
          <Text
            w={"100%"}
            bg={"blue.9"}
            ta={"center"}
            py={5}
            fw={700}
            fz={12}
            sx={{
              zIndex: 1,
              textTransform: "uppercase",
              boxShadow: "0 5px 5px 0 rgba(0,0,0,0.15)",
            }}
          >
            {update.month}
          </Text>
          <Title ta={"center"} bg={"dark.5"} pt={5}>
            {update.day}
          </Title>
          <Text w={"100%"} bg={"dark.5"} ta={"center"} pb={5}>
            {update.year}
          </Text>
        </Stack>
        <Menu>
          <Menu.Target>
            <Center mt={15}>
              <ActionIcon size={"xl"}>
                <IconShare size={"100%"} />
              </ActionIcon>
            </Center>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <IconBrandFacebook />
            </Menu.Item>
            <Menu.Item>
              <IconBrandInstagram />
            </Menu.Item>
            <Menu.Item>
              <IconBrandTiktok />
            </Menu.Item>
            <Menu.Item>
              <IconBrandTwitter />
            </Menu.Item>
            <Menu.Item>
              <IconBrandWhatsapp />
            </Menu.Item>
            <Menu.Item>
              <IconSourceCode />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <Flex direction={"column"} w={"85%"}>
        <Center>
          <Carousel images={update.updateImages} />
        </Center>
        <Box
          mt={30}
          mx={"5%"}
          py={5}
          pl={20}
          sx={{
            borderLeft: "3px solid rgba(255,255,255,0.15)",
          }}
        >
          <Title order={3}>{update.title}</Title>
          <Text mt={10}>{update.content}</Text>
        </Box>
      </Flex>
    </Flex>
  ));

  return (
    <>
      {showall === "hide" ? updates[updates.length - 1] : updates}

      <Divider
        labelPosition="center"
        w={"85%"}
        label={
          <Button
            compact
            size="xs"
            radius={25}
            px={15}
            variant="subtle"
            color="gray.6"
            onClick={() => toggle()}
          >
            Show {showall === "hide" ? "All Updates" : "Latest Update"}
          </Button>
        }
        mb={20}
      />
    </>
  );
}
