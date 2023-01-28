import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import {
  Box,
  UnstyledButton,
  Text,
  Group,
  RingProgress,
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
      region: "New York, United States",
      startDate: "Jan 1, 2023",
      daysLeft: 30,
      donations: 22,
      moneyRaised: 2345,
      percent: 90,
    },
    {
      place: "China",
      region: "",
      startDate: "Aug 15, 2023",
      daysLeft: 20,
      donations: 15,
      moneyRaised: 2459,
      percent: 80,
    },
    {
      place: "Silver Spring",
      region: "Maryland, United States",
      startDate: "Feb 12, 2023",
      daysLeft: 15,
      donations: 2,
      moneyRaised: 300,
      percent: 25,
    },
    {
      place: "Tokyo",
      region: "Japan",
      startDate: "Mar 16, 2023",
      daysLeft: 45,
      donations: 15,
      moneyRaised: 1234,
      percent: 45,
    },
    {
      place: "Texas",
      region: "United States",
      startDate: "Jun 5, 2023",
      daysLeft: 8,
      donations: 7,
      moneyRaised: 234,
      percent: 30,
    },
    {
      place: "Mexico",
      region: "",
      startDate: "July 4, 2023",
      daysLeft: 36,
      donations: 23,
      moneyRaised: 5460,
      percent: 75,
    },
    {
      place: "South Africa",
      region: "",
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
      w="100%"
      sx={{
        transition: "all 200ms ease",
        borderRadius: "3px",
        backgroundColor: "rgba(255, 255, 255, 0.01)",
        boxShadow: "0 2px 5px  rgba(0,0,0, 0.15)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          boxShadow: "0 2px 15px  rgba(0,0,0, 0.2)",
        },
        "&:active": {
          transform: "scale(0.998)",
          boxShadow: "none",
        },
      }}
    >
      <Stack>
        <Group
          grow
          sx={{
            borderBottom: "1px solid rgba(0,0,0, 0.15)",
          }}
        >
          <Stack spacing={0} py={15} pl={20} ta="left" bg="rgba(0,0,0, 0.17)">
            <Text size="xl" fw={400}>
              {trip.place}
            </Text>
            <div>
              <Text size="xs" color="dimmed" fw={400} lineClamp={1} truncate>
                {trip.region}
              </Text>
            </div>
          </Stack>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Text size="md" fw={700} color="#fff">
              $
              {trip.moneyRaised
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
            <Text size="xs" color="dimmed">
              Money Raised
            </Text>
          </div>
        </Group>
        <Group pb={10} px={20} ml={20} position="apart">
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Text size="xs" fw={700}>
              {trip.startDate}
            </Text>
            <Text size="xs" color="dimmed">
              Start Date
            </Text>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Text size="xs" fw={700}>
              {trip.daysLeft}
            </Text>
            <Text size="xs" color="dimmed">
              Days Left
            </Text>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Text size="xs" fw={700}>
              {trip.donations}
            </Text>
            <Text size="xs" color="dimmed">
              Donations
            </Text>
          </div>
          <div>
            <RingProgress
              sections={[
                {
                  value: trip.percent,
                  color: `${
                    trip.percent < 33
                      ? "yellow"
                      : trip.percent < 66
                      ? "lime"
                      : "#00E8FC"
                  }`,
                },
              ]}
              size={60}
              thickness={1}
              label={
                <Text
                  color={
                    trip.percent < 33
                      ? "yellow"
                      : trip.percent < 66
                      ? "lime"
                      : "#00E8FC"
                  }
                  weight={700}
                  align="center"
                  size="md"
                  fw={600}
                >
                  {trip.percent}
                </Text>
              }
            />
          </div>
        </Group>
      </Stack>
    </UnstyledButton>
  ));

  return (
    <Stack
      pt={15}
      ref={tripsRef}
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
        <Box ref={ref}></Box>
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
    </Stack>
  );
}
