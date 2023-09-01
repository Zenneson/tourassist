import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import {
  IconAppWindow,
  IconCurrencyDollar,
  IconSlash,
} from "@tabler/icons-react";
import { useSessionStorage } from "@mantine/hooks";
import {
  daysBefore,
  sumAmounts,
  parseCustomDate,
  formatDateFullMonth,
} from "../../libs/custom";
import {
  useMantineColorScheme,
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

export default function Money(props) {
  const { setMainMenuOpened, setPanelShow } = props;
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const router = useRouter();

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const [allTrips, setAllTrips] = useSessionStorage({
    key: "allTrips",
    defaultValue: [],
  });

  const [currentTrip, setCurrentTrip] = useSessionStorage({
    key: "currentTrip",
    defaultValue: allTrips[0],
  });

  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  const [donationSum, setDonationSum] = useState(0);

  useEffect(() => {
    const grabAllTrips = async (user) => {
      const queryData = collection(firestore, "users", user, "trips");

      try {
        const querySnapshot = await getDocs(queryData);
        const tripsData = querySnapshot.docs.map((doc) =>
          doc.data(
            setAllTrips((prevTrip) => {
              const newTrips = [...prevTrip, doc.data()];
              return newTrips;
            })
          )
        );

        return tripsData;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (allTrips.length === 0 && user) {
      grabAllTrips(user.email);
    }
  }, [user, allTrips, setAllTrips]);

  useEffect(() => {
    if (allTrips.length === 0) return;
    if (currentTrip === undefined) return;
    if (currentTrip.donations?.length === 0) return;
    setDonations(currentTrip.donations);
    const dSum = Math.floor(sumAmounts(currentTrip.donations));
    setDonationSum(dSum);
  }, [currentTrip, allTrips, setDonations]);

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

  const getChartData = (n) => {
    let dateRange;

    if (n !== 7 && n !== 30) {
      dateRange = getDatesFromCreationToNow(n);
    } else {
      dateRange = getLastNDays(n);
    }

    const dSums = {};
    const donationCounts = {};

    dateRange.matchFormat.forEach((day) => {
      dSums[day] = 0;
      donationCounts[day] = 0;
    });

    if (currentTrip && currentTrip.donations?.length !== 0) {
      currentTrip.donations?.forEach((donation) => {
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
    const newTrip = allTrips.find((trip) => trip.tripTitle === event.tripTitle);
    if (newTrip.tripId === currentTrip.tripId) return;
    if (newTrip.donations?.length === 0) {
      setDonations([]);
      return;
    }
    setCurrentTrip(newTrip);
    setDonations(newTrip.donations);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={allTrips.length === 0 || currentTrip === undefined}
        overlayBlur={10}
        overlayOpacity={1}
        overlayColor={dark ? "#0b0c0d" : "#F8F9FA"}
      />
      <Select
        w={"95%"}
        mt={7}
        variant="filled"
        placeholder={currentTrip?.tripTitle || "No Trips found..."}
        data={allTrips.map((trip) => {
          return { value: trip, label: trip.tripTitle, key: trip.tripTitle };
        })}
        sx={{
          pointerEvents: allTrips.length > 1 ? "all" : "none",
          ".mantine-Select-rightSection": {
            opacity: allTrips.length > 1 ? 1 : 0,
          },
        }}
        onChange={(e) => changeTrip(e)}
      />
      <Box pr={20}>
        <Box my={20} w="100%" h={"250px"} pos={"relative"}>
          <Select
            pos={"absolute"}
            top={-10}
            right={-5}
            opacity={0.6}
            w={110}
            size="xs"
            placeholder={
              graphSpan === 7 || graphSpan === 30
                ? `Last ${graphSpan} days`
                : "All days"
            }
            defaultValue={7}
            data={[
              { value: 7, label: "Last 7 days" },
              { value: 30, label: "Last 30 days" },
              {
                value: parseCustomDate(currentTrip?.creationTime),
                label: "All days",
              },
            ]}
            onChange={(e) => setGraphSpan(e)}
            sx={{
              transform: "scale(0.8)",
              transition: "all 1s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
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
          sx={{
            borderRadius: 3,
            border: `2px solid ${dark}`
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <Group w={"100%"} grow spacing={0}>
            <Center>
              <Box>
                <Title order={6} ta={"center"}>
                  {/* Feb 12, 2023 */}
                  {currentTrip && currentTrip.travelDate}
                </Title>
                <Text fz={10} ta={"center"}>
                  TRAVEL DATE
                </Text>
              </Box>
            </Center>
            <Center
              py={10}
              sx={{
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
                variant="subtle"
                bg={dark ? "dark.8" : "gray.3"}
                c={dark ? "#fff" : "#000"}
                sx={{
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.1)",
                    color: "#fff",
                  },
                }}
                onClick={() => {
                  router.push("/" + currentTrip?.tripId);
                  setMainMenuOpened(false);
                  setPanelShow(false);
                }}
              >
                VIEW{" "}
                <IconAppWindow
                  size={23}
                  style={{
                    marginLeft: 4,
                  }}
                />
              </Button>
            </Center>
          </Group>
          <Divider size={"sm"} color={dark ? "dark.8" : "gray.3"} />
          <Group w={"100%"} spacing={0} grow>
            <Center>
              <Box>
                <Title order={3} ta={"center"}>
                  $0
                </Title>
                <Text fz={10}>AVAILABLE FUNDS</Text>
              </Box>
            </Center>
            <Center
              py={10}
              bg={dark ? "dark.8" : "gray.3"}
              sx={{
                borderRadius: "0 0 3px 3px",
                borderLeft: `2px solid ${dark}`
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
            >
              <Box>
                <Progress
                  color={dark ? "blue.9" : "blue.4"}
                  bg={dark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,1)"}
                  value={(donationSum / currentTrip?.costsSum) * 100}
                  mb={5}
                  size={"sm"}
                  w={"100%"}
                  sx={{
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
                    {donationSum}{" "}
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
                    {currentTrip?.costsSum}
                  </Flex>
                </Title>
                <Text ta={"right"} mr={4} fz={10}>
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
            sx={{
              overflow: "hidden",
            }}
          >
            <Donations
              menu={true}
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
