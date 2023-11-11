"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  IconAppWindow,
  IconCurrencyDollar,
  IconChevronDown,
  IconSlash,
} from "@tabler/icons-react";
import { useSessionStorage } from "@mantine/hooks";
import {
  addComma,
  daysBefore,
  sumAmounts,
  parseCustomDate,
  formatDateFullMonth,
} from "../../libs/custom";
import {
  useComputedColorScheme,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Title,
  Text,
  Divider,
  Progress,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { Bar } from "react-chartjs-2";
import Donations from "../trip/donations";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
} from "chart.js";
import classes from "./tripInfo.module.css";

export default function TripInfo(props) {
  const { allTrips, setMainMenuOpened, setPanelShow, setDropDownOpened } =
    props;

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const router = useRouter();

  const [donationSum, setDonationSum] = useState(0);
  const [spentFunds, setSpentFunds] = useState(0);
  const [currentTrip, setCurrentTrip] = useSessionStorage({
    key: "currentTrip",
    defaultValue: [],
  });
  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  useEffect(() => {
    if (currentTrip?.spentFunds > 0) setSpentFunds(currentTrip.spentFunds);
    if (currentTrip && Array.isArray(currentTrip.donations)) {
      setDonations(currentTrip.donations);
      const dSum = Math.floor(sumAmounts(currentTrip.donations));
      setDonationSum(dSum);
    } else {
      setDonations([]);
    }
  }, [currentTrip, setCurrentTrip, allTrips, setDonations]);

  useEffect(() => {
    router.prefetch("/trippage");
  }, [router]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip
  );

  const getLastNDays = (n) => {
    const result = {
      matchFormat: [],
      displayFormat: [],
    };

    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const matchString = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const displayString = `${d.getMonth() + 1}/${d.getDate()}`;

      result.matchFormat.unshift(matchString);
      result.displayFormat.unshift(displayString);
    }

    return result;
  };

  const getDatesFromCreationToNow = (creationTime) => {
    const result = {
      matchFormat: [],
      displayFormat: [],
    };

    const startDate = new Date(creationTime);
    const endDate = new Date();
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const matchString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      const displayString = `${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}`;

      result.matchFormat.push(matchString);
      result.displayFormat.push(displayString);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  const addExtraDay = (date) => {
    const lastDateStr = date.matchFormat.slice(-1)[0];
    const [year, month, day] = lastDateStr.split("-").map(Number);
    const lastDate = new Date(year, month - 1, day);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    const nextDateStr = `${nextDate.getFullYear()}-${String(
      nextDate.getMonth() + 1
    ).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;
    const nextDateDisplayStr = `${
      nextDate.getMonth() + 1
    }/${nextDate.getDate()}`;
    date.matchFormat.push(nextDateStr);
    date.displayFormat.push(nextDateDisplayStr);
    return date;
  };

  const getChartData = (n) => {
    let dateRange;
    if (n !== 7 && n !== 30) {
      dateRange = getDatesFromCreationToNow(n);
    } else {
      dateRange = getLastNDays(n);
    }
    dateRange = addExtraDay(dateRange);
    const dSums = {};
    const donationCounts = {};
    dateRange.matchFormat.forEach((day) => {
      dSums[day] = 0;
      donationCounts[day] = 0;
    });
    if (donations && donations.length > 0) {
      donations.forEach((donation) => {
        const donationDay = donation.time.split("T")[0];
        if (dateRange.matchFormat.includes(donationDay)) {
          dSums[donationDay] += donation.amount;
          donationCounts[donationDay]++;
        }
      });
    }
    const labels = dateRange.displayFormat;
    const data = dateRange.matchFormat.map((day) => ({
      total: dSums[day],
      times: donationCounts[day],
    }));
    return {
      data,
      labels,
      datasets: [
        {
          data: data.map((item) => item.total),
          backgroundColor: dark ? "#0D3F82" : "#2DC7F3",
          borderColor: dark ? "#0D3F82" : "#2DC7F3",
        },
        {
          data: data.map((item) => item.times),
          hidden: true,
        },
      ],
    };
  };

  const [graphSpan, setGraphSpan] = useState(7);
  const graphData = getChartData(graphSpan);

  ChartJS.defaults.borderColor = dark
    ? "rgba(255, 255, 255, 0.02)"
    : "rgba(0, 0, 0, 0.05)";
  ChartJS.defaults.elements.bar.borderRadius = 3;
  ChartJS.defaults.plugins.tooltip.displayColors = false;
  ChartJS.defaults.plugins.tooltip.backgroundColor = dark ? "#000" : "#DEE2E6";
  ChartJS.defaults.plugins.tooltip.titleColor = dark ? "#fff" : "#000";
  ChartJS.defaults.plugins.tooltip.bodyColor = dark ? "#fff" : "#000";
  ChartJS.defaults.plugins.tooltip.titleAlign = "center";
  ChartJS.defaults.plugins.tooltip.bodyAlign = "center";
  ChartJS.defaults.plugins.tooltip.callbacks.title = function (tooltipItem) {
    return formatDateFullMonth(tooltipItem[0].label);
  };
  if (graphData.length !== 0) {
    ChartJS.defaults.plugins.tooltip.callbacks.label = function (tooltipItem) {
      return `$${tooltipItem.formattedValue} ( ${
        graphData.data[tooltipItem.dataIndex].times
      } Donor${graphData.data[tooltipItem.dataIndex].times === 1 ? "" : "s"} )`;
    };
  }

  const changeTrip = (event) => {
    const newTrip = allTrips.find((trip) => trip.tripTitle === event);
    if (newTrip && newTrip.tripId === currentTrip.tripId) return;
    if (newTrip && newTrip.donations?.length === 0) {
      setDonations([]);
      return;
    }
    setCurrentTrip(newTrip);
    if (newTrip && newTrip.donations) setDonations(newTrip.donations);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={!allTrips || currentTrip === undefined}
        overlayProps={{
          backgroundOpacity: 1,
          blur: 10,
          color: dark ? "#0b0c0d" : "#F8F9FA",
        }}
      />
      <Select
        classNames={{ input: classes.tripSelect }}
        w={"95%"}
        mt={7}
        variant="filled"
        placeholder={currentTrip?.tripTitle || "No Trips found..."}
        onChange={(e) => changeTrip(e)}
        checkIconPosition="right"
        value={currentTrip?.tripTitle}
        data={
          allTrips?.length > 0 &&
          allTrips.map((trip) => {
            return {
              value: trip.tripTitle,
              label: trip.tripTitle,
              key: trip.tripTitle,
            };
          })
        }
        rightSection={
          <IconChevronDown
            size={17}
            opacity={allTrips && allTrips.length >= 2 ? 1 : 0}
          />
        }
        style={{
          pointerEvents: allTrips.length > 1 ? "all" : "none",
        }}
      />
      <Box pr={20}>
        <Box my={20} w="100%" h={"250px"} pos={"relative"}>
          <Select
            className={classes.graphLengthSelect}
            pos={"absolute"}
            top={10}
            right={0}
            w={110}
            size="xs"
            defaultValue={7}
            onChange={(e) => setGraphSpan(e)}
            placeholder={
              graphSpan === 7 || graphSpan === 30
                ? `Last ${graphSpan} days`
                : "All days"
            }
            data={[
              { value: "7", label: "Last 7 days" },
              { value: "30", label: "Last 30 days" },
              {
                value: String(parseCustomDate(currentTrip?.creationTime)),
                label: "All days",
              },
            ]}
          />
          <Bar
            key={colorScheme}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            data={graphData}
          />
        </Box>
        <Box
          mb={10}
          style={{
            borderRadius: 3,
            border: `2px solid ${dark}`
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <Group w={"100%"} grow gap={0}>
            <Center>
              <Box>
                <Title order={6} ta={"center"}>
                  {currentTrip && currentTrip.travelDate}
                </Title>
                <Text fz={10} ta={"center"}>
                  TRAVEL DATE
                </Text>
              </Box>
            </Center>
            <Center
              py={10}
              style={{
                borderLeft: `2px solid ${dark}`
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
            >
              <Box>
                <Title order={4} ta={"center"}>
                  {currentTrip && daysBefore(currentTrip.travelDate)}
                </Title>
                <Text ta={"center"} mr={4} fz={10}>
                  DAYS LEFT
                </Text>
              </Box>
            </Center>
            {/* Sends User to Trip Page */}
            <Center py={19} fw={600} fz={20}>
              <Button
                className={classes.viewPageLink}
                variant="subtle"
                onClick={() => {
                  setMainMenuOpened(false);
                  setPanelShow(false);
                  setDropDownOpened(false);
                  router.push("/" + currentTrip?.tripId);
                }}
              >
                View Page{" "}
                <IconAppWindow
                  size={20}
                  stroke={1}
                  style={{
                    marginLeft: 4,
                  }}
                />
              </Button>
            </Center>
          </Group>
          <Divider
            size={"sm"}
            color={dark ? "dark.6" : "#fff"}
            className={classes.shadow}
          />
          <Group w={"100%"} gap={0} grow>
            <Center>
              <Box>
                <Flex align={"center"}>
                  <IconCurrencyDollar
                    stroke={1}
                    style={{
                      marginRight: -3,
                    }}
                  />
                  <Title order={3} ta={"center"}>
                    {addComma(donationSum - spentFunds)}
                  </Title>
                </Flex>
                <Text fz={10}>AVAILABLE FUNDS</Text>
              </Box>
            </Center>
            <Center className={classes.fundsTally}>
              <Box>
                <Progress
                  color={dark ? "blue.9" : "blue.4"}
                  bg={dark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,1)"}
                  value={(donationSum / currentTrip?.costsSum) * 100}
                  mb={5}
                  size={"sm"}
                  w={"100%"}
                  style={{
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
                <Title order={3} ta={"center"}>
                  <Flex align={"center"}>
                    <IconCurrencyDollar
                      stroke={1}
                      style={{
                        marginRight: -4,
                      }}
                    />
                    {addComma(donationSum)}{" "}
                    <IconSlash
                      stroke={1}
                      style={{
                        transform: "rotate(-20deg) scale(1.4)",
                        marginRight: -6,
                      }}
                    />
                    <IconCurrencyDollar
                      stroke={1}
                      style={{
                        marginRight: -4,
                      }}
                    />
                    {addComma(currentTrip?.costsSum)}
                  </Flex>
                </Title>
                <Text ta={"right"} mr={4} mt={-4} fz={10}>
                  RAISED
                </Text>
              </Box>
            </Center>
          </Group>
        </Box>
        <Flex my={10} pos={"relative"}>
          <Box
            // className="pagePanel"
            w={"100%"}
            position="relative"
            style={{
              overflow: "hidden",
            }}
          >
            <Donations
              donations={currentTrip?.donations || []}
              setDonations={setDonations}
              donationSectionLimit={6}
              dHeight={"calc(100vh - 635px)"}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
