import { useRef } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Button,
  Box,
  BackgroundImage,
  Center,
  Divider,
  Group,
  Flex,
  Progress,
  Title,
  Text,
} from "@mantine/core";
import { useHover, useToggle } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconSourceCode,
  IconBrandWhatsapp,
  IconPencil,
  IconHeartHandshake,
} from "@tabler/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Donations from "../comps/donations";
import Update from "../comps/update";

export default function Trippage() {
  const router = useRouter();
  const { hovered, ref } = useHover();
  const [readmore, toggle] = useToggle(["closed", "open"]);

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
      location: "New York",
      flight: 500.45,
      hotel: 200.23,
    },
    {
      location: "Mexico",
      flight: 550.34,
      hotel: 150.65,
    },
    {
      location: "Cuba",
      flight: 980.23,
      hotel: 340.56,
    },
    {
      location: "Grenada",
      flight: 1234.56,
      hotel: 234.56,
    },
  ];

  const costs = costData.map((cost, index) => (
    <Flex direction={"column"} key={index} mt={5}>
      <Title order={6} mb={2}>
        {cost.location}
      </Title>
      <Divider opacity={0.3} my={2} />
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
        <Flex
          w={"calc(70% - 30px)"}
          direction={"column"}
          align={"center"}
          pos={"relative"}
        >
          <Group
            ref={ref}
            spacing={0}
            w={images.length > 1 ? "auto" : "650px"}
            h={500}
            sx={{
              overflow: "hidden",
              borderRadius: "3px",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.07)",
            }}
          >
            <Button
              hidden={!hovered}
              pos={"absolute"}
              top={10}
              right={90}
              leftIcon={<IconPencil size={20} />}
              size="xs"
              variant="default"
              sx={{
                zIndex: 1,
              }}
            >
              Edit
            </Button>
            <Center>
              {images.length > 1 ? (
                <>
                  {hovered && (
                    <Button
                      h={500}
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
                      width: "650px",
                    }}
                  >
                    {images.map((image, index) => (
                      <BackgroundImage
                        key={index}
                        src={image}
                        h={500}
                        maw={650}
                        alt="intro"
                      />
                    ))}
                  </Slider>
                  {hovered && (
                    <Button
                      h={500}
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
                      <IconChevronRight size={50} />
                    </Button>
                  )}
                </>
              ) : (
                <BackgroundImage src={images} h={500} w={"650px"} alt="intro" />
              )}
            </Center>
          </Group>
          <Title order={2} mt={10} p={10} ta={"center"}>
            Help me raise money to go on a Music Tour
          </Title>
          <Center mt={5}>
            <Button.Group>
              <Button variant="default" px={30}>
                <IconBrandFacebook size={20} />
              </Button>
              <Button variant="default" px={30}>
                <IconBrandInstagram size={20} />
              </Button>
              <Button variant="default" px={30}>
                <IconBrandTiktok size={20} />
              </Button>
              <Button variant="default" px={30}>
                <IconBrandTwitter size={20} />
              </Button>
              <Button variant="default" px={30}>
                <IconBrandWhatsapp size={20} />
              </Button>
              <Button variant="default" px={30}>
                <IconSourceCode size={20} />
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
              borderTop: "5px solid rgba(255,255,255,0.1)",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
            }}
          >
            <Divider
              labelPosition="right"
              w={"100%"}
              label={
                <Button
                  leftIcon={<IconPencil size={20} />}
                  compact
                  size="xs"
                  radius={25}
                  pl={10}
                  pr={15}
                  variant="subtle"
                  color="gray.6"
                >
                  Edit
                </Button>
              }
            />
            <Text lineClamp={readmore === "closed" && 5}>
              <p>
                Are you ready to join me on an adventure of a lifetime?
                Together, we can make my long-held dream of visiting New York
                City a reality! I have always been captivated by the magic of
                the Big Apple, and I am excited to explore its vibrant
                neighborhoods, iconic landmarks, and diverse cultural
                experiences.
              </p>

              <p>
                With your generous support, I will be able to travel to New York
                City and fully immerse myself in its unique atmosphere. I cannot
                wait to see the towering skyscrapers of Manhattan, stroll
                through Central Park, marvel at the Statue of Liberty, and
                explore the trendy neighborhoods of Brooklyn. From Broadway
                shows to food tours, I plan on experiencing all that this
                incredible city has to offer.
              </p>

              <p>
                I will document every moment of my journey, from the sights and
                sounds to the people I meet along the way. Your contributions
                will allow me to capture precious memories and share them with
                my amazing supporters, so you can feel like you are right there
                with me, experiencing the adventure in real-time.
              </p>

              <p>
                But this trip is not just about fulfilling a dream or checking
                an item off my bucket list. It&apos;s about creating a
                life-changing experience that will stay with me forever. I
                believe that travel opens our minds, broadens our horizons, and
                connects us with people and cultures from around the world. By
                supporting me on this journey, you are not only helping me
                achieve my dream but also contributing to a greater cause.
              </p>

              <p>
                So, please consider joining me on this unforgettable adventure.
                Your kind contributions will not only enable me to travel to New
                York City but also create a unique, transformative experience
                that will inspire me and those around me. Thank you for
                believing in my journey and for making this dream come true!
              </p>
            </Text>
          </Box>
          <Divider
            labelPosition="right"
            w={"78%"}
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
                {readmore === "closed" ? "Read More" : "Show Less"}
              </Button>
            }
            mb={20}
          />

          <Update />

          <Box
            radius={5}
            bg={"rgba(0,0,0,0.05)"}
            w={"85%"}
            mt={25}
            mb={50}
            p={"20px 30px"}
            sx={{
              border: "1px solid rgba(0,0,0,0.15)",
              borderTop: "5px solid rgba(255,255,255,0.1)",
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
            }}
          >
            <Divider label="// COMMENTS" mb={20} />
            {comments}
          </Box>
        </Flex>

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
            <Group spacing={0} w={"100%"}>
              <Box w={"70%"} pl={20}>
                <Text ta={"left"} fz={10} mb={-3}>
                  GOAL
                </Text>
                <Title order={2} ta={"left"} color="green.7">
                  $500
                  <Text ml={7} span inherit color="gray.7">
                    <Text fw={400} span inherit>
                      /
                    </Text>{" "}
                    $1,000
                  </Text>
                </Title>
              </Box>
              <Box
                w={"30%"}
                sx={{
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Text ta={"center"} fz={10} mb={-7}>
                  DAYS LEFT
                </Text>
                <Title order={2} ta={"center"} color="gray.7">
                  15
                </Title>
              </Box>
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
            <Divider
              mb={5}
              mt={20}
              size={"md"}
              label="Cost Breakdown"
              opacity={0.4}
            />
            {costs}
            <Button.Group mt={10} w={"100%"}>
              <Button
                w={"100%"}
                variant="filled"
                color="green.9"
                onClick={() => {
                  router.push("/purchase", undefined, { shallow: true });
                }}
              >
                <Text>USE FUNDS</Text>
              </Button>
              <Button variant="filled" color="blue" fullWidth>
                POST UPDATE
              </Button>
            </Button.Group>
            <Button
              mt={10}
              variant="gradient"
              gradient={{ from: "#0D3F82", to: "#2DC7F3", deg: 45 }}
              fullWidth
            >
              <Text fz={20} color="blue.2">
                <Flex align={"center"} gap={5}>
                  DONATE <IconHeartHandshake size={23} />
                </Flex>
              </Text>
            </Button>
          </Box>
          <Box mt={10}>
            <Donations />
          </Box>
        </Flex>
      </Flex>
    </Center>
  );
}
