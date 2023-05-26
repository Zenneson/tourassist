import { useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import {
  ActionIcon,
  Box,
  Text,
  Group,
  Progress,
  Stack,
  Center,
  Button,
  Popover,
  Tooltip,
} from "@mantine/core";
import {
  IconReload,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconEye,
} from "@tabler/icons";

export default function Trips() {
  const tripsRef = useRef();
  const { ref, entry } = useIntersection({
    root: tripsRef.current,
    threshold: 1,
  });

  const tripData = [
    {
      title: "Help Me Fund a Trip to New York",
      place: "New York",
      region: "New York, United States",
      startDate: "Jan 1, 2023",
      daysLeft: 30,
      donations: 22,
      moneyRaised: 2345,
      percent: 90,
    },
    {
      title:
        "Going home to Silver Spring to see my family. It has been a while.",
      place: "Silver Spring",
      region: "Maryland, United States",
      startDate: "Feb 12, 2023",
      daysLeft: 15,
      donations: 2,
      moneyRaised: 300,
      percent: 25,
    },
    {
      title: "Adventures in Tokyo. To see the cherry blossoms.",
      place: "Tokyo",
      region: "Japan",
      startDate: "Mar 16, 2023",
      daysLeft: 45,
      donations: 15,
      moneyRaised: 1234,
      percent: 45,
    },
    {
      title: "University Trip to Texas",
      place: "Texas",
      region: "United States",
      startDate: "Jun 5, 2023",
      daysLeft: 8,
      donations: 7,
      moneyRaised: 234,
      percent: 30,
    },
    {
      title: "Vacation in Mexico",
      place: "Mexico",
      region: "",
      startDate: "July 4, 2023",
      daysLeft: 36,
      donations: 23,
      moneyRaised: 5460,
      percent: 75,
    },
    {
      title: "Educational Trip to South Africa",
      place: "South Africa",
      region: "",
      startDate: "Sep 5, 2023",
      daysLeft: 11,
      donations: 20,
      moneyRaised: 3000,
      percent: 90,
    },
    {
      title: "Charity Trip to China",
      place: "China",
      region: "",
      startDate: "Aug 15, 2023",
      daysLeft: 20,
      donations: 15,
      moneyRaised: 2459,
      percent: 50,
    },
  ];

  const trips = tripData.map((trip, index) => (
    <Box
      key={index}
      w="100%"
      sx={{
        transition: "all 200ms ease",
        borderRadius: "3px",
        border: "1px solid rgba(0,0,0, 0.35)",
        position: "relative",
        opacity: 0.7,
        boxShadow:
          "0 2px 5px  rgba(0,0,0, 0.15), inset 0 -3px 10px 1px rgba(255,255,255, 0.005)",
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      <Stack spacing={0}>
        <Group
          sx={{
            borderRadius: "3px 3px 0 0",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
          spacing={0}
        >
          <Stack
            spacing={0}
            py={10}
            px={15}
            ta="left"
            w="70%"
            h={84}
            justify="flex-start"
            bg="rgba(0,0,0, 0.17)"
            sx={{
              borderRadius: "3px 0 0 0",
              borderTop: "1px solid rgba(0,0,0, 0.1)",
              borderLeft: "1px solid rgba(0,0,0, 0.1)",
              boxShadow: "inset 7px 7px 5px 1px rgba(0,0,0, 0.1)",
            }}
          >
            <Text size="md" fw={400} lineClamp={1} w={350} color="dimmed">
              {trip.title}
            </Text>
            <div>
              <Text
                size={10}
                fw={400}
                lineClamp={2}
                mt={3}
                pl={10}
                truncate="true"
                sx={{
                  borderLeft: "1px solid rgba(255,255,255, 0.035)",
                }}
              >
                <Text fw={700}>{trip.place}</Text>
                {trip.region && <Text color="dimmed">{trip.region}</Text>}
              </Text>
            </div>
          </Stack>
          <Center w="30%" ta={"center"}>
            <Box>
              <Text
                size={20}
                fw={900}
                color={
                  trip.percent < 33
                    ? "#D0F0C0"
                    : trip.percent < 66
                    ? "#138808"
                    : "#7CFC00"
                }
              >
                $
                {trip.moneyRaised
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
              <Text size="xs" color="dimmed" mt={-4}>
                Money Raised
              </Text>
            </Box>
          </Center>
        </Group>
        <Group py={15} px={20} position="apart" bg="rgba(0,0,0,0.25)">
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
          <Group>
            <Progress
              value={trip.percent}
              w={80}
              color={
                trip.percent < 33
                  ? "#D0F0C0"
                  : trip.percent < 66
                  ? "#138808"
                  : "#7CFC00"
              }
            />
            <Text
              color={
                trip.percent < 33
                  ? "#D0F0C0"
                  : trip.percent < 66
                  ? "#138808"
                  : "#7CFC00"
              }
              weight={700}
              align="center"
              size="sm"
              fw={600}
            >
              {trip.percent}%
            </Text>
          </Group>
        </Group>
      </Stack>
    </Box>
  ));

  return (
    <Stack
      pt={15}
      ref={tripsRef}
      spacing={27}
      px={10}
      mb={10}
      h={"calc(100vh - 197px)"}
      sx={{
        overflowY: "scroll",
        borderRadius: "3px",
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
