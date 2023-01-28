import { useRef } from "react";
import { useRecoilState } from "recoil";
import { useIntersection } from "@mantine/hooks";
import {
  Avatar,
  Tabs,
  Box,
  Divider,
  Flex,
  Group,
  Text,
  Table,
  Button,
  Center,
} from "@mantine/core";
import { IconCashBanknote, IconBuildingBank, IconReload } from "@tabler/icons";
import { Line } from "react-chartjs-2";
import { moneyTabState } from "../libs/atoms";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

export default function Money() {
  const [activeTab, setActiveTab] = useRecoilState(moneyTabState);
  const donationsRef = useRef();
  const { ref, entry } = useIntersection({
    root: donationsRef.current,
    threshold: 1,
  });

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

  const donateData = [
    {
      name: "Anonymus",
      amount: 100,
    },
    {
      name: "Jill Jailbreaker",
      amount: 50,
    },
    {
      name: "Henry Silkeater",
      amount: 20,
    },
    {
      name: "Bill Horsefighter",
      amount: 150,
    },
    {
      name: "Anonymus",
      amount: 200,
    },
    {
      name: "Anonymus",
      amount: 100,
    },
    {
      name: "Jill Jailbreaker",
      amount: 50,
    },
    {
      name: "Henry Silkeater",
      amount: 20,
    },
    {
      name: "Bill Horsefighter",
      amount: 150,
    },
    {
      name: "Anonymus",
      amount: 200,
    },
  ];

  const rows = donateData.map((item, index) => (
    <tr key={index}>
      <td>
        <Text size="sm" weight={500}>
          {item.name}
        </Text>
      </td>
      <td>
        <Text size="sm" fw={300} ta="right">
          ${item.amount}
        </Text>
      </td>
    </tr>
  ));

  return (
    <Tabs defaultValue="finances" value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List position="right">
        <Tabs.Tab icon={<IconCashBanknote size={17} />} value="finances">
          Funding Metrics
        </Tabs.Tab>
        <Tabs.Tab icon={<IconBuildingBank size={17} />} value="banking">
          Banking Info
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="finances">
        <Box mt={20} h={200} w="100%">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            data={data}
          />
        </Box>
        <Flex my={10}>
          <Box w="80%" mr={20}>
            <Divider label="Donations" mb={10} />
            <Box
              bg="rgba(255, 255, 255, 0.01)"
              p={10}
              m={0}
              h={320}
              ref={donationsRef}
              type="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "0",
                },
                overflow: "auto",
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
                borderRadius: 3,
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
              <Table verticalSpacing="md" highlightOnHover>
                <tbody>
                  {" "}
                  {rows.length !== 0 ? (
                    rows
                  ) : (
                    <Text color="dimmed" ta="center" fz={12}>
                      Your trips will be listed here...
                    </Text>
                  )}
                </tbody>
              </Table>
              <Box ref={ref}></Box>
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
            </Box>
          </Box>
          <Flex direction="column" justify="center" align="center" gap={10}>
            <Flex
              direction="column"
              bg="rgba(255, 255, 255, 0.01)"
              h="100%"
              w="100%"
              px={15}
              justify="center"
              align="center"
              ta="center"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={300} size={25}>
                $150
              </Text>
              <Text size="xs" color="dimmed">
                Upcoming Payout
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="rgba(255, 255, 255, 0.01)"
              h="100%"
              w="100%"
              px={15}
              justify="center"
              align="center"
              ta="center"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={700} size={40} color="dimmed">
                3
              </Text>
              <Text size="xs" color="dimmed">
                Trips Started
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="rgba(255, 255, 255, 0.01)"
              h="100%"
              px={15}
              justify="center"
              align="center"
              ta="center"
              w="100%"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={300} size={22}>
                $2,345
              </Text>
              <Text size="xs" color="dimmed">
                Total Earned
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Tabs.Panel>
      <Tabs.Panel value="banking">Bank Info</Tabs.Panel>
    </Tabs>
  );
}
