import {} from "react";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Card,
  Image,
  Grid,
  RingProgress,
  Text,
  Title,
} from "@mantine/core";

export default function LatestTrips() {
  const router = useRouter();

  const latestTripData = [
    {
      destination: "Mexico",
      percent: 44,
      image: "img/intro/bluehair.jpg",
      title: "Help Me Get To Mexico",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "London",
      percent: 70,
      image: "img/mother.jpg",
      title: "Going to See Family in London",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "New York",
      percent: 80,
      image: "img/women.jpg",
      title: "Going to See the Big Apple",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "Los Angeles",
      percent: 64,
      image: "img/intro/planewindow.jpg",
      title: "Taking a Trip to LA",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "Barcelona",
      percent: 92,
      image: "img/intro/street.jpg",
      title: "Barcelona, Here I Come!",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
    {
      destination: "Las Vegas",
      percent: 77,
      image: "img/intro/concert.jpg",
      title: "Party in Vegas!",
      description:
        "Are you ready to join me on an adventure of a lifetime? Together, we can make my long-held dream of visiting New York City a reality! I have always been captivated by the magic of the Big Apple, and I am excited to explore its vibrant neighborhoods, iconic landmarks, and diverse cultural experiences.",
    },
  ];

  const latestTrips = latestTripData.map((trip, index) => (
    <Grid.Col span={4} key={index}>
      <Card
        onClick={() => router.push("/trippage")}
        sx={{
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: "rgba(11, 12, 13, 0)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow:
            "0 2px 5px  rgba(0,0,0, 0.2), inset 0 -3px 10px 1px rgba(0,0,0, 0.1)",
          "&:hover": {
            background: "rgba(5, 5, 5, 1)",
            boxShadow: "none",
          },
        }}
      >
        <Card.Section pos={"relative"} mih={170}>
          <Box
            pos={"absolute"}
            w={"100%"}
            h={"100%"}
            sx={{
              zIndex: 1,
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
            sx={{
              zIndex: 2,
            }}
          >
            {trip.destination}
          </Badge>
          <RingProgress
            pos={"absolute"}
            top={7}
            right={7}
            size={40}
            thickness={3}
            roundCaps
            sections={[{ value: trip.percent, color: "blue" }]}
            sx={{
              zIndex: 2,
            }}
            label={
              <Text color="blue" weight={700} align="center" size={12}>
                {trip.percent}
                <Text fz={7} pos={"relative"} top={-3} span>
                  %
                </Text>
              </Text>
            }
          />
          <Image src={trip.image} alt="Trip Image" fit="cover" height={170} />
        </Card.Section>
        <Title order={6} mt={20} mb={10} lineClamp={2}>
          {trip.title}
        </Title>
        <Text
          lineClamp={5}
          fz={12}
          pl={10}
          mb={10}
          sx={{
            borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
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
