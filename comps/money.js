import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useIntersection } from "@mantine/hooks";
import {
  Tabs,
  Box,
  Divider,
  Flex,
  Text,
  Table,
  Button,
  Center,
  ColorSwatch,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { IconCashBanknote, IconBuildingBank, IconReload } from "@tabler/icons";
import { Line } from "react-chartjs-2";
import { moneyTabState, profileLinkState } from "../libs/atoms";
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
  const [profileLink, setProfileLink] = useRecoilState(profileLinkState);
  const [sorted, setSorted] = useState("time");
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

  let donateData = [
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

  const donateOrder =
    sorted === "time"
      ? donateData
      : donateData.sort((a, b) => (a.amount < b.amount ? 1 : -1));

  const rows = donateOrder.map((item, index) => (
    <tr key={index}>
      <td>
        <Text size="sm" weight={500}>
          {item.name}
        </Text>
      </td>
      <td>
        <Text size="xs" fw={400} color="dimmed" ta="right">
          ${item.amount}
        </Text>
      </td>
    </tr>
  ));

  return (
    <Tabs
      defaultValue="finances"
      pos="relative"
      value={activeTab}
      onTabChange={setActiveTab}
    >
      <Tabs.List position="right">
        <Tabs.Tab icon={<IconCashBanknote size={17} />} value="finances">
          Funding Metrics
        </Tabs.Tab>
        <Tabs.Tab icon={<IconBuildingBank size={17} />} value="banking">
          Banking Info
        </Tabs.Tab>
      </Tabs.List>
      {activeTab === "finances" && (
        <Group pos="absolute" opacity={0.4} top={10} spacing={5} fz={9}>
          <ColorSwatch color="red" size={5} /> Donors
          <ColorSwatch color="lime" size={5} /> Amount Received
        </Group>
      )}
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
          <Box
            w="100%"
            sx={{
              boxShadow:
                "0 2px 5px  rgba(0,0,0, 0.15), inset 0 -3px 10px 1px rgba(255,255,255, 0.005)",
            }}
          >
            <Flex gap={0}>
              <Divider w="100%" label="Donations" />
              <SegmentedControl
                color="dark"
                value={sorted}
                onChange={setSorted}
                data={[
                  { label: "Time", value: "time" },
                  { label: "Amount", value: "amount" },
                ]}
                size="xs"
                top={-4}
                right={-14}
                w="40%"
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  transform: "scale(0.8)",
                }}
              />
            </Flex>
            <Box
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
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.005)",
                boxShadow: `${
                  entry?.isIntersecting
                    ? "none"
                    : "rgba(0, 0, 0, 0.37) 0px -10px 10px -5px inset"
                }`,
                borderBottom: `${
                  entry?.isIntersecting ? "none" : "1px solid rgba(0, 0, 0, .4)"
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
          <Flex
            direction="column"
            justify="center"
            align="center"
            gap={10}
            ml={20}
          >
            <Flex
              direction="column"
              h="100%"
              w="100%"
              px={25}
              justify="center"
              align="center"
              ta="center"
              sx={{
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.005)",
                boxShadow:
                  "0 2px 5px  rgba(0,0,0, 0.15), inset 0 -3px 10px 1px rgba(255,255,255, 0.005)",
              }}
            >
              <Text fw={900} size={20} color="lime">
                $150
              </Text>
              <Text size="xs">Upcoming Payout</Text>
            </Flex>
            <Flex
              direction="column"
              h="100%"
              px={20}
              justify="center"
              align="center"
              ta="center"
              w="100%"
              sx={{
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.005)",
                boxShadow:
                  "0 2px 5px  rgba(0,0,0, 0.15), inset 0 -3px 10px 1px rgba(255,255,255, 0.005)",
              }}
            >
              <Text fw={900} size={20}>
                $2,345
              </Text>
              <Text size="xs" color="dimmed">
                Total Earned
              </Text>
            </Flex>
            <Flex
              direction="row"
              bg="rgba(0, 0, 0, 0.4)"
              h="20%"
              w="100%"
              px={20}
              justify="center"
              align="center"
              ta="center"
              onClick={() => setProfileLink(2)}
              sx={{
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 200ms ease-in-out",
                transform: "scale(1.05)",
                boxShadow:
                  "0 2px 5px  rgba(0,0,0, 0.15), inset 0 -2px 5px 1px rgba(0,0,0, 0.08)",
                "&:hover": {
                  background: "rgba(0, 0, 0, 1)",
                },
              }}
            >
              <Text fw={900} size={38} color="dimmed">
                7
              </Text>
              <Text size="xs" color="dimmed" ta="left" ml={5} lh={1.3}>
                Trips Started
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Tabs.Panel>
      <Tabs.Panel value="banking">Bank Info</Tabs.Panel>
    </Tabs>
  );
}
