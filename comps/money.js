import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  Box,
  Center,
  Flex,
  Button,
  Group,
  Title,
  Text,
  Divider,
} from "@mantine/core";
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
            borderLeft: "3px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box>
            <Title order={2} ta={"center"}>
              2
            </Title>
            <Text fz={10}>TRIPS</Text>
          </Box>
        </Center>
        <Button
          leftIcon={<IconBuildingBank size={27} />}
          variant="gradient"
          gradient={{ from: "green.5", to: "green.9", deg: 180 }}
          color="gray.0"
          size="lg"
        >
          <Text fz={12} lh={1.1}>
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
    </Box>
  );
}
