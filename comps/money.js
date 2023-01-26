import {} from "react";
import {
  Avatar,
  Tabs,
  Box,
  Divider,
  Stack,
  Flex,
  Group,
  Text,
  Table,
  ScrollArea,
  Button,
  Center,
} from "@mantine/core";
import { IconCashBanknote, IconBuildingBank, IconReload } from "@tabler/icons";
import { Line } from "react-chartjs-2";
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.round(Math.random() * 100)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const donateData = [
    {
      avatar: "",
      name: "Anonymus",
      email: "",
      amount: 100,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jill Jailbreaker",
      email: "jj@breaker.com",
      amount: 50,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Henry Silkeater",
      email: "henry@silkeater.io",
      amount: 20,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Bill Horsefighter",
      email: "bhorsefighter@gmail.com",
      amount: 150,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar: "",
      name: "Anonymus",
      email: "",
      amount: 200,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar: "",
      name: "Anonymus",
      email: "",
      amount: 100,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jill Jailbreaker",
      email: "jj@breaker.com",
      amount: 50,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Henry Silkeater",
      email: "henry@silkeater.io",
      amount: 20,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Bill Horsefighter",
      email: "bhorsefighter@gmail.com",
      amount: 150,
      id: Math.round(Math.random() * 1000),
    },
    {
      avatar: "",
      name: "Anonymus",
      email: "",
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
            <Text color="dimmed" size="xs">
              {item.email}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Text size="xl" w={8}>
          {item.amount}
        </Text>
        <Text size="xs" color="dimmed" w={8}>
          Amount
        </Text>
      </td>
    </tr>
  ));

  return (
    <Tabs defaultValue="finances" opacity={0.5}>
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
        <Divider m={10} />
        <Flex mt={20}>
          <Box w="100%">
            <Divider label="Donations" mb={10} />
            <ScrollArea
              scrollbarSize={8}
              type="auto"
              w="100%"
              h="35vh"
              pr={10}
              bg="rgba(255, 255, 255, 0.02)"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
                overflowY: "hidden",
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
            </ScrollArea>
          </Box>
          <Stack gap={0} w="30%" pl={20}>
            <Flex
              h="33%"
              direction="column"
              justify="center"
              align="center"
              bg="rgba(255, 255, 255, 0.02)"
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
              h="33%"
              direction="column"
              justify="center"
              align="center"
              bg="rgba(255, 255, 255, 0.02)"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={900} size={25}>
                $ 2,345
              </Text>
              <Text size="xs" color="dimmed">
                Total Earned
              </Text>
            </Flex>
            <Flex
              h="33%"
              direction="column"
              justify="center"
              align="center"
              bg="rgba(255, 255, 255, 0.02)"
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 3px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Text fw={900} size={25}>
                $ 400
              </Text>
              <Text size="xs" color="dimmed">
                Total Donated
              </Text>
            </Flex>
          </Stack>
        </Flex>
      </Tabs.Panel>
      <Tabs.Panel value="banking">
        Second tab color is blue, it gets this value from props, props have the
        priority and will override context value
      </Tabs.Panel>
    </Tabs>
  );
}
