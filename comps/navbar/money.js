import { useEffect } from "react";
import { useRouter } from "next/router";
import { IconPlayerPlay } from "@tabler/icons-react";
import {
  useMantineTheme,
  Box,
  Center,
  Flex,
  Group,
  Title,
  Text,
  Divider,
  Progress,
  Select,
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
  const theme = useMantineTheme();
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
    <>
      <Select
        w={"95%"}
        mt={7}
        variant="filled"
        placeholder="Help me raise money to go on a Music Tour"
        data={["Help me raise money to go on a Music Tour"]}
      />
      <Box pr={20}>
        <Box
          my={15}
          w="100%"
          px={10}
          pb={10}
          h={"250px"}
          sx={(theme) => ({
            borderLeft: `2px solid ${
              theme.colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)"
            }`,
          })}
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
          className="pagePanel"
          mb={20}
          sx={(theme) => ({
            borderRadius: 3,
          })}
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
              sx={(theme) => ({
                borderLeft: `2px solid ${
                  theme.colorScheme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)"
                }`,
              })}
            >
              <Box>
                <Progress
                  color="blue"
                  value={30}
                  mb={5}
                  size={"xs"}
                  w={"100%"}
                />
                <Title order={3} ta={"center"}>
                  $1500 / $5000
                </Title>
                <Text ta={"right"} mr={4} fz={10}>
                  RAISED
                </Text>
              </Box>
            </Center>
          </Group>
          <Divider
            size={"xs"}
            c={`2px solid ${
              theme.colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)"
            }`}
          />
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
              sx={(theme) => ({
                borderLeft: `2px solid ${
                  theme.colorScheme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)"
                }`,
              })}
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
              fw={600}
              bg={
                theme.colorScheme === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : theme.colors.gray[4]
              }
              sx={(theme) => ({
                transition: "all 0.2s ease",
                "&:hover": {
                  cursor: "pointer",
                  color: theme.colorScheme === "dark" ? "#000" : "#fff",
                },
              })}
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
            className="pagePanel"
            w={"100%"}
            position="relative"
            sx={{
              overflow: "hidden",
            }}
          >
            <Donations dHeight={"calc(100vh - 635px)"} />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
