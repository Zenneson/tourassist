import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Box, Center, Flex, Button, Group, Title, Text } from "@mantine/core";
import { Line } from "react-chartjs-2";
import { profileLinkState } from "../libs/atoms";
import Donations from "./donations";
import { IconBuildingBank } from "@tabler/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

export default function Money() {
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
    <>
      <Box mt={20} w="100%">
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          data={data}
        />
      </Box>
      <Group my={20} w={"100%"} grow spacing={0}>
        <Center>
          <Box>
            <Title order={2}>$1000</Title>
            <Text ta={"center"} fz={10}>
              RAISED
            </Text>
          </Box>
        </Center>
        <Center
          sx={{
            borderLeft: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box>
            <Title order={2} ta={"center"}>
              2
            </Title>
            <Text fz={10}>TRIPS</Text>
          </Box>
        </Center>
        <Button leftIcon={<IconBuildingBank />} variant="light" size="lg">
          <Text fz={12} lh={1.3}>
            ADD BANKING
            <br />
            INFORMATION
          </Text>
        </Button>
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
    </>
  );
}
