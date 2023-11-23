import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Accordion,
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
  LoadingOverlay,
  Box,
  Badge,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { addComma } from "../libs/custom";
import { IconListDetails } from "@tabler/icons-react";
import classes from "./purchase.module.css";

export default function Purchase(props) {
  const router = useRouter();
  const [tripLoaded, setTripLoaded] = useState(false);

  const [funds, setFunds] = useSessionStorage({
    key: "funds",
    defaultValue: 0,
  });

  const [activeTrip, setActiveTrip] = useSessionStorage({
    key: "activeTrip",
    defaultValue: [],
  });

  useEffect(() => {
    if (activeTrip) {
      setTripLoaded(true);
    }

    if (tripLoaded && activeTrip.length === 0) {
      router.push("/map");
    }
  }, [router, activeTrip, tripLoaded]);

  if (activeTrip.length === 0) {
    return (
      <LoadingOverlay
        visible={true}
        transitionProps={{ transition: "fade", duration: 250 }}
        loaderProps={{ color: dark ? "#0d3f82" : "#2dc7f3", type: "bars" }}
        overlayProps={{
          backgroundOpacity: 1,
          color: dark ? "#0b0c0d" : "#f8f9fa",
        }}
      />
    );
  }

  const flightList = [
    {
      id: "164646",
      airlineImg: "/img/intro/airlines/delta.svg",
      airline: "Delta Airlines",
      flightClass: "Business",
      date: "Jan 15, 2024",
      time: "10:00 AM",
      price: 5000,
      info: "This is a test",
    },
    {
      id: "45434",
      airlineImg: "/img/intro/airlines/american.svg",
      airline: "American Airlines",
      flightClass: "First Class",
      date: "Feb 28, 2024",
      time: "2:00 PM",
      price: 8000,
      info: "This is a test",
    },
    {
      id: "34534455",
      airlineImg: "/img/intro/airlines/british.svg",
      airline: "British Airways",
      flightClass: "Economy",
      date: "Mar 10, 2024",
      time: "6:00 AM",
      price: 1500,
      info: "This is a test",
    },
    {
      id: "5438498",
      airlineImg: "/img/intro/airlines/jetblue.svg",
      airline: "JetBlue Airways",
      flightClass: "Economy",
      date: "Apr 1, 2024",
      time: "9:00 AM",
      price: 1800,
      info: "This is a test",
    },
  ];

  const FlightLabel = ({ airlineImg, airline, flightClass, date, time }) => {
    return (
      <Group gap={0}>
        <Badge pos={"absolute"} top={0} right={0} variant="dot" size="xs">
          {flightClass}
        </Badge>
        <Stack align="flex-start" gap={10}>
          <Text size={12}>{airline}</Text>
          <Image
            src={airlineImg}
            alt={airline}
            height={70}
            width={70}
            fit="contain"
          />
        </Stack>
        <Stack gap={0}>
          <Group>
            <Text size={12}>{date}</Text>
            <Text size={12}>{time}</Text>
          </Group>
          <Text size={12}>${addComma(2000)}</Text>
        </Stack>
      </Group>
    );
  };

  const flights = flightList.map((flight, index) => (
    <Accordion.Item value={flight.id} key={index} p={"xs"}>
      <Accordion.Control>
        <FlightLabel {...flight} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">{flight.info}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Center>
      <Stack w={"70%"}>
        <Group
          className="pagePanel"
          mt={100}
          w={"100%"}
          justify="space-between"
          p={20}
        >
          <Stack gap={0}>
            <Text size={12}>Available Funds</Text>
            <Title order={1}>${addComma(funds)}</Title>
          </Stack>
          <Button
            variant="default"
            size="md"
            style={{
              textTransform: "uppercase",
            }}
            leftSection={<IconListDetails />}
          >
            Trip Details
          </Button>
        </Group>
        <Box className="pagePanel" w={"100%"} p={20}>
          <Accordion
            className={classes.accordion}
            chevron={false}
            variant="separated"
          >
            {flights}
          </Accordion>
        </Box>
      </Stack>
    </Center>
  );
}
