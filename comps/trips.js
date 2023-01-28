import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import {
  Avatar,
  Box,
  UnstyledButton,
  Text,
  Group,
  RingProgress,
  Divider,
  Stack,
  Center,
  Button,
} from "@mantine/core";
import { IconReload } from "@tabler/icons";

export default function Trips() {
  const tripsRef = useRef();
  const { ref, entry } = useIntersection({
    root: tripsRef.current,
    threshold: 1,
  });

  const tripData = [
    {
      place: "New York",
      startDate: "Jan 1, 2023",
      daysLeft: 30,
      donations: 22,
      moneyRaised: 2345,
      percent: 90,
    },
    {
      place: "Silver Spring",
      startDate: "Feb 12, 2023",
      daysLeft: 15,
      donations: 2,
      moneyRaised: 300,
      percent: 25,
    },
    {
      place: "Tokyo",
      startDate: "Mar 16, 2023",
      daysLeft: 45,
      donations: 15,
      moneyRaised: 1234,
      percent: 45,
    },
    {
      place: "Texas",
      startDate: "Jun 5, 2023",
      daysLeft: 8,
      donations: 7,
      moneyRaised: 234,
      percent: 30,
    },
    {
      place: "Mexico",
      startDate: "July 4, 2023",
      daysLeft: 36,
      donations: 23,
      moneyRaised: 5460,
      percent: 75,
    },
    {
      place: "China",
      startDate: "Aug 15, 2023",
      daysLeft: 20,
      donations: 15,
      moneyRaised: 2459,
      percent: 80,
    },
    {
      place: "South Africa",
      startDate: "Sep 5, 2023",
      daysLeft: 11,
      donations: 20,
      moneyRaised: 3000,
      percent: 90,
    },
    {
      place: "South Africa",
      startDate: "Sep 5, 2023",
      daysLeft: 11,
      donations: 20,
      moneyRaised: 3000,
      percent: 90,
    },
  ];

  const trips = tripData.map((trip, index) => (
    <UnstyledButton
      key={index}
      p={10}
      w="100%"
      sx={{
        transition: "all 200ms ease",
        borderRadius: "100px",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          transform: "scale(1.002)",
        },
        "&:active": {
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          transform: "scale(0.998)",
        },
      }}
    >
      <Group position="apart">
        <Group spacing={10} w={242} position="apart">
          <Group
            spacing={5}
            sx={{
              overflow: "hidden",
            }}
          >
            <Avatar
              variant="subtle"
              radius={100}
              size={65}
              sx={{
                background: "rgba(33, 94, 190, 0.08)",
              }}
            >
              {trip.place[0]}
            </Avatar>
            <div style={{ padding: "0 10px" }}>
              <Text size="lg" fw={700}>
                {trip.place}
              </Text>
            </div>
          </Group>
          <Divider orientation="vertical" opacity={0.3} />
        </Group>
        <div style={{ textAlign: "center" }}>
          <Text size="sm" fw={700}>
            {trip.startDate}
          </Text>
          <Text size="xs" color="dimmed">
            Start Date
          </Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text size="md" fw={700}>
            {trip.daysLeft}
          </Text>
          <Text size="xs" color="dimmed">
            Days Left
          </Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text size="md" fw={700}>
            {trip.donations}
          </Text>
          <Text size="xs" color="dimmed">
            Donations
          </Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text size="md" fw={700} color="lime">
            ${trip.moneyRaised}
          </Text>
          <Text size="xs" color="dimmed">
            Money Raised
          </Text>
        </div>
        <RingProgress
          sections={[
            {
              value: trip.percent,
              color: `${
                trip.percent < 33
                  ? "red"
                  : trip.percent < 66
                  ? "yellow"
                  : "lime"
              }`,
            },
          ]}
          size={75}
          thickness={7}
          roundCaps
          label={
            <Text
              color={
                trip.percent < 33
                  ? "red"
                  : trip.percent < 66
                  ? "yellow"
                  : "lime"
              }
              weight={700}
              align="center"
              size="lg"
              fw={900}
            >
              {trip.percent}
            </Text>
          }
        />
      </Group>
    </UnstyledButton>
  ));

  return (
    <Stack
      py={10}
      ref={tripsRef}
      radius={3}
      px={10}
      mb={10}
      sx={{
        maxHeight: "calc(100vh - 500px)",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: "0",
        },
        boxShadow: `${
          entry?.isIntersecting
            ? "none"
            : "rgba(0, 0, 0, 0.37) 0px -10px 10px -5px inset"
        }`,
        borderBottom: `${
          entry?.isIntersecting ? "none" : "1px solid rgba(0, 0, 0, .5)"
        }`,
      }}
    >
      {trips.length !== 0 ? (
        trips
      ) : (
        <Text color="dimmed" ta="center" fz={12}>
          Your trips will be listed here...
        </Text>
      )}
      <Center>
        <Button
          variant="default"
          compact
          pr={10}
          mb={10}
          leftIcon={<IconReload size={14} />}
        >
          Load More
        </Button>
      </Center>
      <Box ref={ref}></Box>
    </Stack>
  );
}
