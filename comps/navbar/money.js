import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { IconAppWindow } from "@tabler/icons-react";
import { useSessionStorage } from "@mantine/hooks";
import { daysBefore, sumAmounts } from "../../libs/custom";
import {
  useMantineColorScheme,
  Box,
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
import { Line } from "react-chartjs-2";
import Donations from "../trip/donations";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

export default function Money(props) {
  const { setMainMenuOpened, setPanelShow } = props;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
    LineElement,
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

  const getChartData = (n) => {
    const lastNDays = getLastNDays(n);
    const dSums = {};

    lastNDays.matchFormat.forEach((day) => {
      dSums[day] = 0;
    });

    if (currentTrip && currentTrip.donations?.length !== 0) {
      if (currentTrip.donations?.length === 0) return;
      currentTrip.donations?.forEach((donation) => {
        const donationDay = donation.time.split("T")[0];
        if (lastNDays.matchFormat.includes(donationDay)) {
          dSums[donationDay] += donation.amount;
        }
      });
    }

    const labels = lastNDays.displayFormat;

    return {
      labels,
      datasets: [
        {
          label: "Funds Raised",
          data: lastNDays.matchFormat.map((day) => dSums[day]),
          borderColor: "green",
        },
      ],
    };
  };

  const [graphSpan, setGraphSpan] = useState(7);
  const graphData = getChartData(graphSpan);

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
            right={-10}
            opacity={0.4}
            w={110}
            size="xs"
            placeholder={`Last ${graphSpan} days`}
            data={[
              { value: 7, label: "Last 7 days" },
              { value: 30, label: "Last 30 days" },
              { value: 90, label: "Last 90 days" },
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
          <Line
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
              sx={{
                borderLeft: `2px solid ${dark}`
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
            >
              <Box>
                <Progress
                  color="green"
                  value={(donationSum / currentTrip?.costsSum) * 100}
                  mb={5}
                  size={"xs"}
                  w={"100%"}
                />
                <Title order={3} ta={"center"}>
                  ${donationSum} / ${currentTrip?.costsSum}
                </Title>
                <Text ta={"right"} mr={4} fz={10}>
                  RAISED
                </Text>
              </Box>
            </Center>
          </Group>
          <Divider
            size={"xs"}
            c={`2px solid ${
              dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
            }`}
          />
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
            <Center
              py={19}
              fw={600}
              fz={20}
              sx={(theme) => ({
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              })}
              onClick={() => {
                router.push("/" + currentTrip?.tripId);
                setMainMenuOpened(false);
                setPanelShow(false);
              }}
            >
              <Group spacing={4}>
                VIEW <IconAppWindow size={23} />
              </Group>
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
