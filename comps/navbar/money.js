import { useEffect } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { IconAppWindow } from "@tabler/icons-react";
import { useSessionStorage } from "@mantine/hooks";
import { daysBefore } from "../../libs/custom";
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

  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  const [allTrips, setAllTrips] = useSessionStorage({
    key: "allTrips",
    defaultValue: [],
  });

  const [currentTrip, setCurrentTrip] = useSessionStorage({
    key: "currentTrip",
    defaultValue: allTrips[0],
  });

  useEffect(() => {
    const grabAllTrips = async (user) => {
      const queryData = collection(firestore, "users", user, "trips");

      try {
        const querySnapshot = await getDocs(queryData);
        const tripsData = querySnapshot.docs.map((doc) =>
          doc.data(
            setAllTrips((prevTrip) => {
              const newTrips = [...prevTrip, doc.data()]; // create new images array
              return newTrips; // return new images array to update state
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
  }, [user, allTrips, setAllTrips, setCurrentTrip]);

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
        onChange={(e) => {
          setCurrentTrip(
            allTrips.find((trip) => trip.tripTitle === e.tripTitle)
          );
        }}
      />
      <Box pr={20}>
        <Box my={20} w="100%" h={"250px"}>
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            data={data}
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
                  color="blue"
                  value={30}
                  mb={5}
                  size={"xs"}
                  w={"100%"}
                />
                <Title order={3} ta={"center"}>
                  $0 / $ {currentTrip?.costsSum}
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
            <Donations dHeight={"calc(100vh - 635px)"} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
