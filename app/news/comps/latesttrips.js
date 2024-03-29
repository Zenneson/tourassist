import {
  Badge,
  Box,
  Card,
  Grid,
  RingProgress,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import classes from "../styles/latesttrips.module.css";

export default function LatestTrips() {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const latestTripData = [
    {
      destination: "Mexico",
      percent: 44,
      image: "/img/intro/bluehair.jpg",
      title: "Help Me Get To Mexico",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "London",
      percent: 70,
      image: "/img/mother.jpg",
      title: "Going to See Family in London",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "New York",
      percent: 80,
      image: "/img/women.jpg",
      title: "Going to See the Big Apple",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "Los Angeles",
      percent: 64,
      image: "/img/intro/planewindow.jpg",
      title: "Taking a Trip to LA",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "Barcelona",
      percent: 92,
      image: "/img/intro/street.jpg",
      title: "Barcelona, Here I Come!",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "Las Vegas",
      percent: 77,
      image: "/img/intro/concert.jpg",
      title: "Party in Vegas!",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
  ];

  const latestTrips = latestTripData.map((trip, index) => (
    <Grid.Col span={4} key={index}>
      <Card
        className={classes.tripCard}
        component={Link}
        href="/zenneson/zenneson_goingtogrenada113023" // PLACEHOLDER LINK
      >
        <Card.Section
          pos={"relative"}
          mih={170}
          style={{
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <Box
            pos={"absolute"}
            w={"100%"}
            h={"100%"}
            style={{
              zIndex: 1,
              transform: "scale(1.02)",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(11,12,12,1) 100%)",
            }}
          />
          <Badge
            pos={"absolute"}
            bottom={10}
            right={10}
            variant="outline"
            size="xs"
            style={{
              zIndex: 2,
            }}
          >
            {trip.destination}
          </Badge>
          <RingProgress
            pos={"absolute"}
            top={7}
            right={7}
            size={50}
            thickness={3}
            roundCaps
            sections={[{ value: trip.percent, color: "lime" }]}
            style={{
              zIndex: 2,
            }}
            label={
              <Text c="lime" fw={100} align="center" size={14}>
                {trip.percent}
                <Text fz={7} pos={"relative"} top={-5} span>
                  %
                </Text>
              </Text>
            }
          />
          <Image src={trip.image} alt="Trip Image" fit="cover" fill={true} />
        </Card.Section>
        <Title
          order={6}
          mt={20}
          mb={10}
          style={{
            lineClamp: 2,
          }}
        >
          {trip.title}
        </Title>
        <Text
          lineClamp={5}
          fz={12}
          pl={10}
          mb={10}
          style={{
            borderLeft: `1px solid ${
              dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
            }`,
            textAlign: "justify",
          }}
        >
          {trip.description}
        </Text>
      </Card>
    </Grid.Col>
  ));

  return (
    <>
      <Grid gutter={20}>{latestTrips}</Grid>
    </>
  );
}
