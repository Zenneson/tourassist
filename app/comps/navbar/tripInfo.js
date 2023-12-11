"use client";
import {
  addComma,
  dateRangeFunc,
  daysBefore,
  formatDateFullMonth,
  parseCustomDate,
  sumAmounts,
} from "@libs/custom";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Progress,
  Select,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconAppWindow,
  IconChevronDown,
  IconCurrencyDollar,
  IconSlash,
} from "@tabler/icons-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Donations from "../trip/donations";
import classes from "./styles/tripInfo.module.css";

export default function TripInfo(props) {
  const { allTrips, setMainMenuOpened, setPanelShow, setDropDownOpened } =
    props;

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [donationSum, setDonationSum] = useState(0);
  const [spentFunds, setSpentFunds] = useState(0);
  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: [],
  });
  const [currentTrip, setCurrentTrip] = useSessionStorage({
    key: "currentTrip",
    defaultValue: [],
  });
  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip
  );

  const getDates = (n) => {
    const result = {
      matchFormat: [],
      displayFormat: [],
    };

    const startDate = new Date(n);
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
    const lastDateStr = date.matchFormat[date.matchFormat.length - 1]; // Correctly fetch the last date
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
    const donations = currentTrip?.donations;
    let dateRange = getDates(n);
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

  const weekRange = dateRangeFunc(7);
  const monthRange = dateRangeFunc(30);

  const [graphSpan, setGraphSpan] = useState(
    String(parseCustomDate(weekRange))
  );
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
    if (newTrip) {
      setCurrentTrip(newTrip);
    }
    if (newTrip && newTrip.tripId === currentTrip.tripId) return;
    if (newTrip && newTrip.donations?.length === 0) {
      setDonations([]);
      return;
    }
    if (newTrip && newTrip.donations) setDonations(newTrip.donations);
  };

  useEffect(() => {
    router.prefetch("/" + currentTrip.tripId);
  }, [router]);

  return (
    isClient && (
      <Box pos="relative">
        <LoadingOverlay
          visible={!allTrips || currentTrip === undefined}
          loaderProps={{ color: dark ? "#0d3f82" : "#2dc7f3", type: "bars" }}
          overlayProps={{
            blur: 10,
            backgroundOpacity: 1,
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
          allowDeselect={false}
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
              classNames={{ input: classes.graphLengthSelect }}
              checkIconPosition="right"
              pos={"absolute"}
              top={10}
              right={0}
              w={120}
              size="xs"
              defaultValue={String(parseCustomDate(weekRange))}
              onChange={(e) => setGraphSpan(e)}
              placeholder={
                graphSpan === 7 || graphSpan === 30
                  ? `Last ${graphSpan} days`
                  : "All days"
              }
              rightSection={
                <IconChevronDown
                  size={12}
                  opacity={allTrips && allTrips.length >= 2 ? 1 : 0}
                />
              }
              data={[
                {
                  value: String(parseCustomDate(weekRange)),
                  label: "Last 7 days",
                },
                {
                  value: String(parseCustomDate(monthRange)),
                  label: "Last 30 days",
                },
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
                    setTripData(currentTrip);
                    router.push("/" + currentTrip.tripId);
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
              color={dark ? "dark.7" : "#fff"}
              opacity={dark && 0.6}
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
                    bg={dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.1)"}
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
              bg={dark ? "rgba(5, 5, 5, 0.5)" : "rgba(255, 255, 255, 0.9)"}
              w={"100%"}
              position="relative"
              mt={10}
              style={{
                overflow: "hidden",
                borderRadius: 3,
              }}
            >
              <Donations
                donations={currentTrip.donations ? currentTrip.donations : []}
                setDonations={setDonations}
                donationSectionLimit={6}
                dHeight={"calc(100vh - 670px)"}
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    )
  );
}
