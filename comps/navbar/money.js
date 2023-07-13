import { useEffect } from "react";
import { useRouter } from "next/router";
import { IconPlayerPlay } from "@tabler/icons-react";
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
import Donations from "../tripinfo/donations";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

export default function Money() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/trippage");
  }, [router]);

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
        my={15}
        w="100%"
        px={10}
        h={"250px"}
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
      <Box
        sx={{
          border: "2px solid rgba(204, 204, 204, 0.05)",
          borderRadius: 3,
        }}
      >
        <Group w={"100%"} spacing={0} grow>
          <Center>
            <Box>
              <Title order={3} ta={"center"}>
                $1234
              </Title>
              <Text fz={10}>AVAILABLE FUNDS</Text>
            </Box>
          </Center>
          <Center
            py={10}
            sx={{
              borderLeft: "2px solid rgba(255,255,255,0.05)",
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
        <Divider size={"md"} color="rgba(255,255,255,0.05)" />
        <Group w={"100%"} grow spacing={0}>
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
            py={10}
            sx={{
              borderLeft: "2px solid rgba(255,255,255,0.05)",
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
          {/* Sends User to Trip Page */}
          <Center
            py={19}
            bg={"rgba(255,255,255,0.05)"}
            fw={600}
            sx={{
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={() => {
              router.push("/trippage");
            }}
          >
            VIEW <IconPlayerPlay size={17} />
          </Center>
        </Group>
      </Box>
      <Flex my={10} pos={"relative"}>
        <Box
          w={"100%"}
          position="relative"
          sx={{
            overflow: "hidden",
          }}
        >
          <Donations dHeight={"calc(100vh - 615px)"} />
        </Box>
      </Flex>
    </Box>
  );
}