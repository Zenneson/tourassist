import { useRecoilState } from "recoil";
import { IconPlayerPlay } from "@tabler/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Title,
  Text,
  Divider,
  Progress,
} from "@mantine/core";
import { Line } from "react-chartjs-2";
import { profileLinkState } from "../libs/atoms";
import Donations from "./donations";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

export default function Money() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
  );

  const labels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Amount received",
        data: labels.map(() => Math.round(Math.random() * 100)),
        borderColor: "red",
      },
      {
        label: "Donors",
        data: labels.map(() => Math.round(Math.random() * 100)),
        borderColor: "lime",
      },
    ],
  };

  return (
    <Box pr={20}>
      <Box
        my={20}
        w="100%"
        px={10}
        py={15}
        sx={{
          borderLeft: "3px solid rgba(204, 204, 204, 0.15)",
          borderBottom: "3px solid rgba(204, 204, 204, 0.15)",
        }}
      >
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          data={data}
        />
      </Box>
      <Group my={20} w={"100%"} spacing={0} grow>
        <Center>
          <Box>
            <Title order={3} ta={"center"}>
              $1234
            </Title>
            <Text fz={10}>AVAILABLE FUNDS</Text>
          </Box>
        </Center>
        <Center
          sx={{
            borderLeft: "3px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box>
            <Progress color="blue" value={30} mb={5} size={"xs"} w={"100%"} />
            <Title order={3} ta={"center"}>
              $1500 / $5000
            </Title>
            <Text ta={"right"} mr={4} fz={10}>
              RAISED
            </Text>
          </Box>
        </Center>
      </Group>
      <Divider />
      <Group my={20} w={"100%"} grow spacing={0}>
        <Center>
          <Box>
            <Title order={6} ta={"center"}>
              Feb 12, 2023
            </Title>
            <Text fz={10} ta={"center"}>
              TRAVEL DATE
            </Text>
          </Box>
        </Center>
        <Center
          sx={{
            borderLeft: "3px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box>
            <Title order={4} ta={"center"}>
              15
            </Title>
            <Text ta={"center"} mr={4} fz={10}>
              DAYS LEFT
            </Text>
          </Box>
        </Center>
        <Center
          py={3}
          sx={{
            borderLeft: "3px solid rgba(255,255,255,0.2)",
          }}
        >
          <Button variant="light" size="sm">
            VIEW <IconPlayerPlay size={17} />
          </Button>
        </Center>
      </Group>
      <Flex my={10} pos={"relative"}>
        <Box
          w={"100%"}
          position="relative"
          sx={{
            overflow: "hidden",
          }}
        >
          <Donations />
        </Box>
      </Flex>
    </Box>
  );
}
