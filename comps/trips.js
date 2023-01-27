import {} from "react";
import {
  Avatar,
  ScrollArea,
  UnstyledButton,
  Text,
  Group,
  RingProgress,
  Divider,
  Stack,
} from "@mantine/core";

export default function Trips() {
  const tripData = [
    {
      id: Math.round(Math.random() * 1000),
      place: "New York",
      startDate: "Jan 1, 2023",
      daysLeft: 30,
      donations: 22,
      moneyRaised: 2345,
      percent: 90,
    },
    {
      id: Math.round(Math.random() * 1000),
      place: "Silver Spring",
      startDate: "Feb 12, 2023",
      daysLeft: 15,
      donations: 2,
      moneyRaised: 300,
      percent: 25,
    },
    {
      id: Math.round(Math.random() * 1000),
      place: "Tokyo",
      startDate: "Mar 16, 2023",
      daysLeft: 45,
      donations: 15,
      moneyRaised: 1234,
      percent: 45,
    },
    {
      id: Math.round(Math.random() * 1000),
      place: "Texas",
      startDate: "Jun 5, 2023",
      daysLeft: 8,
      donations: 7,
      moneyRaised: 234,
      percent: 20,
    },
  ];

  const trips = tripData.map((trip) => (
    <UnstyledButton
      key={trip.id}
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

  return <Stack py={10}>{trips}</Stack>;
}
