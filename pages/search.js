import { useEffect } from "react";
import {
  Box,
  Center,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  Image,
  Stack,
  Progress,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";

const results = [
  {
    image: "img/women.jpg",
    title: "Help Me Fund a Trip to New York",
    body: "Join me in turning my long-held dream into reality by generously funding my unforgettable trip to New York City! Experience the magic of the Big Apple vicariously through my adventure as I traverse iconic landmarks, immerse myself in diverse cultural experiences, and capture precious moments to share with my amazing supporters. Your kind contributions will not only enable me to tick this item off my bucket list but also create an extraordinary, life-changing experience. Thank you for believing in my journey and making this dream come true!",
    raised: 1234,
    goal: 3400,
    daysLeft: 45,
  },
  {
    image: "img/intro/bluehair.jpg",
    title: "Vacation in Mexico",
    body: "Support my dream vacation to Mexico, where I'll immerse myself in vibrant culture, breathtaking landscapes, and mouthwatering cuisine. Your contributions will help me discover Mexico's rich history, unwind on idyllic beaches, and create lifelong memories. Thank you for making this journey possible!",
    raised: 500,
    goal: 1000,
    daysLeft: 30,
  },
  {
    image: "img/intro/street.jpg",
    title: "University Trip to Texas",
    body: "Help me represent my university on an important educational trip to Texas, where we'll engage with industry professionals and expand our horizons. Your support will enable me to gain invaluable insights, build connections, and make the most of this unique opportunity. Every contribution counts!",
    raised: 1500,
    goal: 3000,
    daysLeft: 35,
  },
  {
    image: "img/intro/concert.jpg",
    title: "Educational Trip to South Africa",
    body: "Contribute to my enlightening educational journey to South Africa, where I'll explore the nation's diverse culture, history, and wildlife. Your generosity will allow me to broaden my understanding, develop new perspectives, and create memories that will impact my life and education. Thank you for being part of my adventure!",
    raised: 234,
    goal: 1200,
    daysLeft: 40,
  },
  {
    image: "img/intro/planewindow.jpg",
    title: "Charity Trip to China",
    body: "Support my meaningful charity trip to China, where I'll collaborate with local organizations to make a difference in underprivileged communities. Your donations will help me bring positive change, share valuable skills, and foster cross-cultural connections. Together, we can create a lasting impact!",
    raised: 300,
    goal: 1340,
    daysLeft: 15,
  },
  {
    image: "img/intro/happyguy.jpg",
    title: "Going home to Silver Spring to see my family. It has been a while.",
    body: "Help me reunite with my loving family in Silver Spring, whom I haven't seen in years. Your kind support will enable me to travel home, share heartfelt moments, and strengthen our bond. Thank you for helping me create cherished memories with the people who matter most.",
    raised: 250,
    goal: 2000,
    daysLeft: 50,
  },
];

const searchData = results.map((result, index) => (
  <>
    <Group
      radius={5}
      bg={"rgba(0,0,0,0.05)"}
      w={"100%"}
      mt={20}
      mb={15}
      p={20}
      spacing={0}
      sx={{
        "&:hover": {
          transform: "scale(1.01)",
          background: "rgba(0,0,0,0.5)",
        },
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid rgba(0,0,0,0.15)",
        borderTop: "3px solid rgba(255,255,255,0.1)",
        boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
      }}
    >
      <Image src={result.image} fit="cover" height={165} width={165} alt="" />
      <Divider orientation="vertical" mx={20} />
      <Stack w={"calc(100% - 206px)"} spacing={0}>
        <Title order={2} m={0}>
          {result.title}
        </Title>
        <Text lineClamp={3} fz={13}>
          {result.body}
        </Text>
        <Group position="apart" mt={15} mx={20}>
          <Box>
            <Title order={2}>
              ${result.raised.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Title>
            <Text fz={10} ta={"center"}>
              RAISED
            </Text>
          </Box>
          <Progress value={50} w={"60%"} />
          <Box>
            <Text fz={12}>
              ${result.goal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
            <Text fz={10} ta={"center"}>
              GOAL
            </Text>
          </Box>
          <Divider orientation="vertical" />
          <Box>
            <Text fz={25} ta={"center"}>
              {result.daysLeft}
            </Text>
            <Text fz={10}>DAYS LEFT</Text>
          </Box>
        </Group>
      </Stack>
    </Group>
  </>
));

export default function SearchPage() {
  const [loaded, setLoaded] = useSessionStorage({
    key: "loaded",
    defaultValue: false,
  });

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <>
      <Center mt={120} mb={50}>
        <Flex direction="column" gap={0} w={"80%"} maw={1000}>
          <Text fz={13} fw={700}>
            RESULTS FOR...
          </Text>
          <Title>The Search Term Appears Here</Title>
          <Divider mt={12} opacity={0.2} />
          {searchData}
        </Flex>
      </Center>
    </>
  );
}
