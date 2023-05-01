import { useRef } from "react";
import {
  Avatar,
  Button,
  Box,
  BackgroundImage,
  Center,
  Group,
  Divider,
  Flex,
  Progress,
  Title,
  Text,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconClockHour5,
} from "@tabler/icons";
import Autoplay from "embla-carousel-autoplay";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Donations from "../comps/donations";

export default function Trippage() {
  const images = [
    "img/women.jpg",
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
    "img/intro/street.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewindow.jpg",
    "img/intro/happyguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/plane.jpg",
  ];

  const autoplay = useRef(Autoplay({ delay: 1000 }));
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

  const sliderRef = useRef();

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

  const costData = [
    {
      title: "New York",
      flight: 500.45,
      hotel: 200.23,
    },
    {
      title: "Mexico",
      flight: 550.34,
      hotel: 150.65,
    },
    {
      title: "Cuba",
      flight: 980.23,
      hotel: 340.56,
    },
    {
      title: "Grenada",
      flight: 1234.56,
      hotel: 234.56,
    },
  ];

  const costs = costData.map((cost, index) => (
    <Flex direction={"column"} key={index} mt={5}>
      <Title order={6} mb={2}>
        {cost.title}
      </Title>
      <Divider opacity={0.1} />
      <Group position="apart" py={1} pl={30} mb={-5}>
        <Text fz={10}>FLIGHT</Text>
        <Title order={4}>
          <Text
            inherit
            span
            fz={12}
            fw={700}
            color="dark.4"
            pos={"relative"}
            top={-5}
            right={3}
          >
            $
          </Text>
          {cost.flight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Title>
      </Group>
      <Group position="apart" py={1} pl={30}>
        <Text fz={10}>HOTEL</Text>
        <Title order={4}>
          <Text
            inherit
            span
            fz={12}
            fw={700}
            color="dark.4"
            pos={"relative"}
            top={-5}
            right={3}
          >
            $
          </Text>
          {cost.hotel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Title>
      </Group>
      {costData.length < index + 1 && <Divider opacity={0.1} />}
    </Flex>
  ));

  const commentData = [
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Just donated! Can't wait to see the team swimming with the Loch Ness Monster in Scotland! #LegendaryAdventure",
    },
    {
      name: "Jill Jailbreaker",
      time: "10 mintues ago",
      text: "Proud to support this amazing journey! Meeting the aliens at Area 51 sounds like a once-in-a-lifetime experience!",
    },
    {
      name: "Bill Horsefighter",
      time: "10 mintues ago",
      text: "Just backed this epic trip! Excited to watch you guys discover the lost city of Atlantis. Good luck!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Happy to contribute! Dinosaur-watching in Jurassic Park seems like a childhood dream come true! Have fun!",
    },
    {
      name: "Henry Silkeater",
      time: "10 mintues ago",
      text: "Donated! Can't wait to see the vlogs from this epic time-traveling trip. Say hi to the cavemen for me!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Supported! Have a blast exploring the underwater city of Rapture. Beware of the Big Daddies though! 😉",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Just gave my support! Enjoy your teleportation adventure to Mars. Can't wait for the Martian selfies!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Contributed to the cause! Have fun at the North Pole Santa's Workshop tour! Bring back some elf souvenirs!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Proud to back this project! Can't wait to see the team climbing Mount Everest in just one day! 🏔️",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Donated! Good luck discovering the Fountain of Youth, you guys! Don't forget to share the secret! 😉",
    },
  ];

  const comments = commentData.map((comment, index) => (
    <>
      <Group key={index}>
        <Avatar alt="" radius="xl">
          {comment.name.charAt(0)}
        </Avatar>
        <Box>
          <Text size="sm">{comment.name}</Text>
          <Text size="xs" color="dimmed">
            {comment.time}
          </Text>
        </Box>
      </Group>
      <Text size="sm" pl={55} pb={20}>
        {comment.text}
      </Text>
      {commentData.length !== index + 1 && <Divider opacity={0.25} my={10} />}
    </>
  ));

  return (
    <Center>
      <Flex gap={30} w={"80%"} maw={1200} mt={120}>
        <Flex w={"calc(70% - 30px)"} direction={"column"} align={"center"}>
          <Group
            spacing={0}
            w={images.length > 1 ? "auto" : "650px"}
            h={500}
            sx={{
              overflow: "hidden",
              borderRadius: "5px",
              border: images.length > 1 ? "1px solid rgba(0,0,0,0.2)" : "none",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
            }}
          >
            {images.length > 1 ? (
              <>
                <Button
                  h={500}
                  mb={7}
                  radius={"3px 0 0 3px"}
                  onClick={previous}
                  variant="outline"
                  color={"dark.4"}
                  p={0}
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
                <Slider
                  ref={sliderRef}
                  {...slideSettings}
                  style={{
                    width: "650px",
                  }}
                >
                  {images.map((image, index) => (
                    <BackgroundImage
                      key={index}
                      src={image}
                      h={500}
                      w={"650px"}
                      alt="intro"
                    />
                  ))}
                </Slider>
                <Button
                  h={500}
                  mb={7}
                  radius={"3px 0 0 3px"}
                  onClick={previous}
                  variant="outline"
                  color={"dark.4"}
                  p={0}
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
              </>
            ) : (
              <BackgroundImage src={images} h={500} w={"650px"} alt="intro" />
            )}
          </Group>
          <Title order={2} p={10} ta={"center"}>
            Help me raise money to go on a Music Tour
          </Title>
          <Center mt={10}>
            <Button.Group>
              <Button data-disabled>
                <Title order={6}>SHARE</Title>
              </Button>
              <Button variant="default" px={50}>
                <IconBrandFacebook size={20} />
              </Button>
              <Button variant="default" px={50}>
                <IconBrandInstagram size={20} />
              </Button>
              <Button variant="default" px={50}>
                <IconBrandTiktok size={20} />
              </Button>
              <Button variant="default" px={50}>
                <IconBrandTwitter size={20} />
              </Button>
            </Button.Group>
          </Center>
          <Box
            radius={3}
            bg={"rgba(0,0,0,0.05)"}
            w={"85%"}
            mt={20}
            py={20}
            px={30}
            fz={14}
            sx={{
              border: "1px solid rgba(0,0,0,0.15)",
              borderTop: "3px solid rgba(255,255,255,0.1)",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
            }}
          >
            Join me in turning my long-held dream into reality by generously
            funding my unforgettable trip to New York City! Experience the magic
            of the Big Apple vicariously through my adventure as I traverse
            iconic landmarks, immerse myself in diverse cultural experiences,
            and capture precious moments to share with my amazing supporters.
            Your kind contributions will not only enable me to tick this item
            off my bucket list but also create an extraordinary, life-changing
            experience. Thank you for believing in my journey and making this
            dream come true!
          </Box>

          <Box
            radius={5}
            bg={"rgba(0,0,0,0.05)"}
            w={"85%"}
            mt={25}
            mb={50}
            p={"20px 30px"}
            sx={{
              border: "1px solid rgba(0,0,0,0.15)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
            }}
          >
            <Divider label="// COMMENTS" mb={20} />
            {comments}
          </Box>
        </Flex>

        {/* COLUMN 2 HERE */}
        <Flex w={"30%"} direction={"column"}>
          <Box
            radius={3}
            bg={"rgba(0,0,0,0.05)"}
            w={"100%"}
            pt={12}
            pb={22}
            px={20}
            sx={{
              border: "1px solid rgba(0,0,0,0.15)",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
            }}
          >
            <Group px={5} mb={-4} grow>
              <Title order={1} ta={"left"} ml={30} color="green.7">
                $500
              </Title>
              <Title order={1} ta={"left"} ml={30} color="gray.7">
                ${(1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Title>
            </Group>
            <Group fw={100} fz={10} px={7} mb={10} grow>
              <Text ta={"left"} ml={30}>
                RAISED
              </Text>
              <Text ta={"left"} ml={30}>
                GOAL
              </Text>
            </Group>
            <Progress
              value={50}
              color="green.7"
              striped
              animate
              bg={"gray.6"}
              size={"xl"}
              radius={"xl"}
              mt={20}
            />
            <Group mt={10} spacing={5} fz={12} fw={700} pr={5} position="right">
              <IconClockHour5 size={15} /> 15 Days Left
            </Group>
            <Divider mb={5} label="Cost Breakdown" opacity={0.4} />
            {costs}
            <Button
              mt={20}
              w={"100%"}
              variant="gradient"
              gradient={{ from: "green.5", to: "green.9", deg: 180 }}
            >
              <Title
                order={3}
                color="gray"
                sx={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.07)",
                }}
              >
                DONATE
              </Title>
            </Button>
          </Box>
          <Box mt={20}>
            <Donations />
          </Box>
        </Flex>
      </Flex>
    </Center>
  );
}
