import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
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
import { IconCashBanknote, IconBuildingBank } from "@tabler/icons";
import { Line } from "react-chartjs-2";
import { moneyTabState, profileLinkState } from "../libs/atoms";
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
  const [activeTab, setActiveTab] = useRecoilState(moneyTabState);
  const [profileLink, setProfileLink] = useRecoilState(profileLinkState);

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
        <Box mt={20} w="100%">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            data={data}
          />
        </Box>
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
      </Tabs.Panel>
      <Tabs.Panel value="banking">Bank Info</Tabs.Panel>
    </Tabs>
  );
}
