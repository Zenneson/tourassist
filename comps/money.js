import { useState } from "react";
import { useRecoilState } from "recoil";
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
      avatar: "",
      name: "Anonymus",
      amount: 100,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jill Jailbreaker",
      amount: 50,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Henry Silkeater",
      amount: 20,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Bill Horsefighter",
      amount: 150,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar: "",
      name: "Anonymus",
      amount: 200,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar: "",
      name: "Anonymus",
      amount: 100,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jill Jailbreaker",
      amount: 50,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Henry Silkeater",
      amount: 20,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Bill Horsefighter",
      amount: 150,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar: "",
      name: "Anonymus",
      amount: 200,
      id: Math.round(Math.random() * 1000),
    },
  ];

  const rows = donateData.map((item) => (
    <tr key={item.id}>
      <td>
        <Group spacing="xs">
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Text size="md" ta="right">
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
        <Box mt={20} h={250} w="100%">
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
              bg="rgba(255, 255, 255, 0.02)"
              px={10}
              m={0}
              h={350}
              type="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "0",
                },
                overflow: "auto",
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
                borderRadius: 3,
              }}
            >
              <Table verticalSpacing="xs">
                <tbody>{rows}</tbody>
              </Table>
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
              bg="rgba(255, 255, 255, 0.02)"
              h="100%"
              w="100%"
              p="xl"
              justify="center"
              align="center"
              ta="center"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={900} size={25} color="lime">
                $150
              </Text>
              <Text size="xs" color="dimmed">
                Payout on the way
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="rgba(255, 255, 255, 0.02)"
              h="100%"
              w="100%"
              p="xl"
              justify="center"
              align="center"
              ta="center"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={900} size={40}>
                3
              </Text>
              <Text size="xs" color="dimmed">
                Trips Started
              </Text>
            </Flex>
            <Flex
              direction="column"
              bg="rgba(255, 255, 255, 0.02)"
              h="100%"
              p="xl"
              justify="center"
              align="center"
              ta="center"
              w="100%"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={900} size={25}>
                $2,345
              </Text>
              <Text size="xs" color="dimmed">
                Total Earned
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Tabs.Panel>
      <Tabs.Panel value="banking">
        Second tab color is blue, it gets this value from props, props have the
        priority and will override context value
      </Tabs.Panel>
    </Tabs>
  );
}
