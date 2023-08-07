import { useState, useRef, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { motion } from "framer-motion";
import {
  useMantineColorScheme,
  useMantineTheme,
  Autocomplete,
  ActionIcon,
  Space,
  Stepper,
  Title,
  Center,
  Box,
  Text,
  Image,
  NumberInput,
  Group,
  Divider,
  Stack,
  Button,
  Input,
  Popover,
  Flex,
  Badge,
  Switch,
  Indicator,
} from "@mantine/core";
import {
  useForceUpdate,
  useWindowEvent,
  useSessionStorage,
} from "@mantine/hooks";
import {
  IconCurrencyDollar,
  IconPlus,
  IconCirclePlus,
  IconChevronUp,
  IconChevronDown,
  IconBuildingBank,
  IconTrash,
  IconMapPin,
  IconCalendarEvent,
  IconChevronsRight,
  IconArrowRightTail,
  IconAlertTriangle,
  IconFriends,
  IconRotate360,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { DatePicker } from "@mantine/dates";
import { estTimeStamp, dateId } from "../libs/custom";
import LoginComp from "../comps/loginComp";
import TripContent from "../comps/tripinfo/tripContent";

export default function TripPlannerPage(props) {
  let { auth, mapLoaded } = props;
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [startLocaleSearch, setStartLocaleSearch] = useState("");
  const [startLocaleData, setStartLocaleData] = useState([]);
  const [startLocale, setStartLocale] = useState("");
  const [travelers, setTravelers] = useState(1);
  const travelersHandlerRef = useRef(null);
  const [travelDates, setTravelDates] = useState(null);
  const [roundTrip, setRoundTrip] = useState(false);
  const startLocaleRef = useRef(null);
  const [tripTitle, setTripTitle] = useState("");
  const [tripId, setTripId] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [active, setActive] = useState(0);
  const [infoAdded, setInfoAdded] = useState(false);
  const storage = getStorage();
  const router = useRouter();
  const dayjs = require("dayjs");
  const sumRef = useRef(null);

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });
  const [images, setImages] = useSessionStorage({
    key: "images",
    defaultValue: [],
  });
  const [tripDesc, setTripDesc] = useSessionStorage({
    key: "tripDesc",
    defaultValue: "",
  });
  const [placeData, setPlaceData] = useSessionStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const [loaded, setLoaded] = useSessionStorage({
    key: "loaded",
    defaultValue: false,
  });

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const index = startLocale?.indexOf(",");
  const startCity = startLocale.substring(0, index);
  const startRegion = startLocale?.substring(index + 1);

  const today = new Date();
  const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));

  const formatPlaces = (input) => {
    return input.map((item) => {
      return {
        place: item.place,
        region: item.region,
      };
    });
  };

  const placeCheck = () => {
    placeData.map((place) => {
      if (`${place.place}, ${place.region}` === startLocale) {
        notifications.show(placeExists);
        setStartLocale("");
        setStartLocaleSearch("");
        setStartLocaleData([]);
      }
    });
  };

  const placeExists = {
    title: "Already set as destination",
    message: `${startLocale} is set as a destination. Please choose another location.`,
    color: "orange",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
    style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
  };

  const noTitle = {
    title: "Missing Trip Title",
    message: "Please provide a title for your trip.",
    color: "red",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
    style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
  };

  const titleIsShort = {
    title: "Trip Title is Short",
    message: "Please provide a longer Title for your trip.",
    color: "orange",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
    style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
  };

  const noDesc = {
    title: "Add details about your trip",
    message: "Please provide a description of your trip below.",
    color: "red",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
    style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
  };

  const descIsShort = {
    title: "Description is Short",
    message: "Please provide more information about your trip.",
    color: "orange",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
    style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
  };

  const noAccountInfo = {
    title: "Account Information Required",
    message: "Please provide your account information below.",
    color: "orange",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
    style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
  };

  const createTrip = {
    id: "creating-trip",
    title: "Creating Trip Campaign...",
    message: "Please wait while we create your trip campaign.",
    color: "green",
    loading: true,
    withCloseButton: false,
    autoClose: false,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const tripMade = {
    id: "creating-trip",
    title: "Trip Campaign Created!",
    message: "Welcome to your trip Campaign!",
    color: "green",
    loading: false,
    autoClose: 5000,
    icon: <IconCheck size={17} />,
  };

  const generateTripId = () => {
    const trip_title = tripTitle
      .replace(/ /g, "")
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();
    let now = new Date();
    let date_time_string = dateId(now);
    let name = user.email.match(/^(.*?)@/);
    let trip_id = `${trip_title}${date_time_string}${name[1]}`;
    return trip_id;
  };

  // TODO - DB
  const saveToDB = async (user, campaignId) => {
    notifications.show(createTrip);
    try {
      const imageUploadPromises = images.map(async (imageDataUrl, index) => {
        if (imageDataUrl.startsWith("data:")) {
          const storageRef = ref(
            storage,
            `images/${user.email}/${campaignId}/trip_img_${index}.png`
          );
          const snapshot = await uploadString(
            storageRef,
            imageDataUrl,
            "data_url",
            {
              contentType: "image/png",
            }
          );
          const downloadURL = await getDownloadURL(snapshot.ref);
          return downloadURL;
        }
      });

      const imageURLs = await Promise.all(imageUploadPromises);

      const travel_date = travelDates.toString();
      await setDoc(doc(firestore, "users", user.email, "trips", campaignId), {
        creationTime: estTimeStamp(new Date()),
        tripTitle: tripTitle,
        images: imageURLs,
        tripDesc: tripDesc,
        startLocale: startLocale,
        travelers: travelers,
        travelDate: dateId(travel_date),
        roundTrip: roundTrip,
        costsObj: costsObj,
        costsSum: costsSum,
        destinations: destinations,
        tripId: campaignId,
        user: user.email,
      });
      notifications.update(tripMade);
      sessionStorage.removeItem("placeDataState");
      sessionStorage.removeItem("images");
      sessionStorage.removeItem("tripDesc");
      router.push("/" + campaignId);
    } catch (error) {
      console.error("Failed to save to database:", error);
      // Handle any errors that occurred during the image upload or database write
    }
  };

  const changeNextStep = () => {
    if (active === 2) {
      if (tripTitle === "") {
        notifications.show(noTitle);
        return;
      }
      if (tripTitle.length < 11) {
        notifications.show(titleIsShort);
        return;
      }
      if (tripDesc === "") {
        notifications.show(noDesc);
        return;
      }
      if (tripDesc.length < 11) {
        notifications.show(descIsShort);
        return;
      }
      setDestinations(formatPlaces(placeData));
    }
    if (active !== 3) {
      nextStep();
    }
    if (active === 3) {
      if (!user && !infoAdded && router.pathname === "/tripplanner") {
        notifications.show(noAccountInfo);
        return;
      }
      () => {
        setTripId(generateTripId());
      };
      saveToDB(user, generateTripId());
    }
  };

  const handleChange = async (e) => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${startLocaleSearch}.json?&autocomplete=true&&fuzzyMatch=true&types=place&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;

    if (startLocaleSearch.length > 1) {
      try {
        const response = await fetch(endpoint);
        const results = await response.json();
        const data = results.features.map((feature) => ({
          label: feature.label,
          value: feature.place_name,
          place_name: feature.place_name,
          place_type: feature.place_type,
          center: feature.center,
          geometry: feature.geometry,
          text: feature.text,
          bbox: feature.bbox,
          context: feature.context,
          all: feature,
        }));
        setStartLocaleData(data);
      } catch (error) {
        console.log("Error fetching data for Country Autocomplete: ", error);
      }
    }
  };

  return (
    <Box px={20} pb={50}>
      <Space h={110} />
      <Center pr={20}>
        <Divider
          w={"100%"}
          maw={1200}
          mb={20}
          opacity={0.4}
          label={
            <Flex>
              <IconChevronsRight size={20} />
              <Text>
                {active === 0
                  ? "Travel Starting Info"
                  : active === 1
                  ? "Cost Calculator"
                  : active === 2
                  ? "Travel Details"
                  : "Account Information"}
              </Text>
            </Flex>
          }
        />
      </Center>
      <Center>
        <Flex
          w="100%"
          maw={1200}
          justify="flex-start"
          align="flex-start"
          gap={10}
        >
          <Box w="100%" miw={500}>
            {active === 0 && (
              <motion.div {...animation}>
                <Flex
                  p={30}
                  maw={950}
                  direction={"column"}
                  className="pagePanel"
                >
                  <Title order={5} fw={400} h={20} mb={20}>
                    {startLocale && travelDates ? (
                      "Continue..."
                    ) : (
                      <Text opacity={0.7}>
                        Provide the{" "}
                        <Text inherit span hidden={startLocale}>
                          Departure Location{" "}
                        </Text>
                        <Text inherit span hidden={startLocale || travelDates}>
                          and
                        </Text>{" "}
                        <Text inherit span hidden={travelDates}>
                          Travel Start Date
                          {startLocale && ":"}
                        </Text>
                      </Text>
                    )}
                  </Title>
                  <Flex
                    w={"100%"}
                    justify={"flex-start"}
                    align={"flex-start"}
                    gap={0}
                  >
                    <Flex
                      className="pagePanel"
                      direction={"column"}
                      justify={"center"}
                      w={"58%"}
                      h={380}
                      p={20}
                      gap={10}
                    >
                      <Autocomplete
                        size="sm"
                        w={"100%"}
                        defaultValue=""
                        value={startLocaleSearch}
                        placeholder="Departure Location..."
                        onItemSubmit={(e) => setStartLocale(e.value)}
                        ref={startLocaleRef}
                        data={startLocaleData}
                        filter={(value, item) => item}
                        onSelect={() => placeCheck()}
                        onChange={function (e) {
                          setStartLocaleSearch(e);
                          handleChange(e);
                          if (startLocaleRef.current.value === "") {
                            setStartLocale("");
                          }
                        }}
                        sx={{
                          "& .mantine-Autocomplete-input": {
                            "&::placeholder": {
                              fontWeight: 400,
                            },
                          },
                        }}
                      />
                      <Group mt={15} spacing={0}>
                        <Divider
                          w={"60%"}
                          pr={10}
                          labelPosition="right"
                          variant="dashed"
                          label={
                            <Flex align={"center"}>
                              <IconFriends
                                size={16}
                                color={dark ? "rgb(255,255,255)" : "rgb(0,0,0)"}
                              />
                              <Text ta={"right"} ml={5} fz={13} opacity={0.4}>
                                Travelers:
                              </Text>
                            </Flex>
                          }
                        />
                        <Group spacing={5} w={"40%"} grow>
                          {/* Decrease Traveler Count  */}
                          <Button
                            variant="filled"
                            fz={15}
                            color={dark ? "dark.5" : "gray.1"}
                            c={dark ? "gray.0" : "dark.9"}
                            onClick={() =>
                              travelersHandlerRef.current.decrement()
                            }
                          >
                            -
                          </Button>
                          <NumberInput
                            hideControls
                            variant="filled"
                            type="number"
                            value={travelers}
                            onChange={(e) => setTravelers(e)}
                            handlersRef={travelersHandlerRef}
                            defaultValue={1}
                            min={1}
                            styles={{
                              input: {
                                textAlign: "center",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                              },
                            }}
                          />
                          {/* Increase Traveler Count  */}
                          <Button
                            variant="filled"
                            fz={15}
                            color={dark ? "dark.5" : "gray.1"}
                            c={dark ? "gray.0" : "dark.9"}
                            onClick={() =>
                              travelersHandlerRef.current.increment()
                            }
                          >
                            +
                          </Button>
                        </Group>
                      </Group>
                      <Group pos={"relative"}>
                        <Divider
                          w={"100%"}
                          my={15}
                          labelPosition="right"
                          variant="dashed"
                          label={
                            <Switch
                              label={
                                <Flex align={"center"}>
                                  <IconRotate360
                                    size={16}
                                    color={
                                      dark ? "rgb(255,255,255)" : "rgb(0,0,0)"
                                    }
                                  />
                                  <Text
                                    ta={"right"}
                                    ml={5}
                                    fz={12}
                                    opacity={0.4}
                                  >
                                    Round Trip?
                                  </Text>
                                </Flex>
                              }
                              labelPosition="left"
                              onLabel="YES"
                              offLabel="NO"
                              checked={roundTrip}
                              onChange={() => setRoundTrip(!roundTrip)}
                            />
                          }
                        />
                      </Group>
                      <Box>
                        <Box
                          sx={{
                            borderRadius: "3px",
                          }}
                        >
                          <Stack
                            align="center"
                            justify="center"
                            spacing={0}
                            p={20}
                            h={150}
                            bg={dark ? "dark.5" : "gray.1"}
                            sx={{
                              overflowX: "auto",
                              borderRadius: "3px",
                            }}
                          >
                            <Box>
                              <Group spacing={7} mb={15}>
                                <IconMapPin
                                  size={20}
                                  color="gray"
                                  opacity={0.4}
                                />
                                {startLocale && (
                                  <>
                                    <Badge
                                      variant="outline"
                                      color="gray"
                                      size="xs"
                                    >
                                      {startCity}
                                    </Badge>
                                    <IconArrowRightTail
                                      size={18}
                                      opacity={0.4}
                                    />
                                  </>
                                )}
                                {placeData.map((place, index) => (
                                  <Group key={index} spacing={5}>
                                    <Badge
                                      variant="outline"
                                      color="gray"
                                      size="xs"
                                    >
                                      {place.place}
                                    </Badge>
                                    {placeData.length - 1 !== index && (
                                      <IconArrowRightTail
                                        size={18}
                                        opacity={0.4}
                                      />
                                    )}
                                  </Group>
                                ))}
                                {roundTrip && startLocale && (
                                  <>
                                    <IconArrowRightTail
                                      size={18}
                                      opacity={0.4}
                                    />
                                    <Badge
                                      variant="outline"
                                      color="gray"
                                      size="xs"
                                    >
                                      {startCity}
                                    </Badge>
                                  </>
                                )}
                              </Group>
                            </Box>
                            {travelDates !== null && (
                              <Flex align={"center"} justify={"center"}>
                                <Group spacing={7} fz={14} fw={700}>
                                  <IconCalendarEvent size={20} opacity={0.4} />
                                  {dayjs(travelDates).format("LL")}
                                </Group>
                                <Divider
                                  orientation="vertical"
                                  ml={10}
                                  mr={7}
                                  opacity={0.7}
                                />
                                <Group spacing={5} fz={12}>
                                  <Title
                                    color={dark ? "red" : "blue"}
                                    order={3}
                                  >
                                    •
                                  </Title>
                                  {dayjs(travelDates)
                                    .subtract(1, "day")
                                    .format("LL")}
                                  <Flex
                                    align={"center"}
                                    gap={7}
                                    mt={-4}
                                    ml={-7}
                                    sx={{
                                      transform: "scale(0.85)",
                                    }}
                                  >
                                    <Text fz={25} opacity={0.2}>
                                      (
                                    </Text>
                                    <Text
                                      mt={4}
                                      fw={700}
                                      fz={9}
                                      lh={1}
                                      ta={"center"}
                                      color="gray.7"
                                      sx={{
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      <Text fz={".68rem"} span>
                                        Campgain Ends
                                      </Text>
                                      <br />
                                      Day Before Travel
                                    </Text>
                                    <Text fz={25} opacity={0.2}>
                                      )
                                    </Text>
                                  </Flex>
                                </Group>
                              </Flex>
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    </Flex>
                    <DatePicker
                      className="pagePanel"
                      allowDeselect
                      firstDayOfWeek={0}
                      defaultDate={dayjs().add(7, "day")}
                      minDate={weekAhead}
                      value={travelDates}
                      size={"md"}
                      mah={380}
                      ml={30}
                      p={20}
                      onChange={(e) => {
                        setTravelDates(e);
                      }}
                      getDayProps={() => {
                        return {
                          style: {
                            fontWeight: "bold",
                          },
                        };
                      }}
                      renderDay={(date) => {
                        const day = date.getDate();
                        const month = date.getMonth();
                        const year = date.getFullYear();

                        let isSpecificDay;
                        if (travelDates) {
                          const travelDate = dayjs(travelDates);
                          const prevDate = travelDate.subtract(1, "day");

                          isSpecificDay =
                            day === prevDate.date() &&
                            month === prevDate.month() &&
                            year === prevDate.year();
                        }
                        return (
                          <Indicator
                            size={5}
                            color={dark ? "red" : "blue"}
                            offset={-3}
                            disabled={!isSpecificDay}
                          >
                            <div>{day}</div>
                          </Indicator>
                        );
                      }}
                      sx={{
                        ".mantine-DatePicker-day[data-disabled]": {
                          color: dark
                            ? "rgba(36, 36, 36, 0.4)"
                            : "rgba(233, 233, 233, 0.5)",
                        },
                        ".mantine-DatePicker-day[data-weekend]": {
                          color: dark
                            ? theme.colors.blue[2]
                            : theme.colors.red[3],
                        },
                        ".mantine-DatePicker-day[data-selected]": {
                          border: `1px solid ${
                            dark ? theme.colors.blue[1] : theme.colors.red[2]
                          }`,
                          backgroundColor: dark
                            ? theme.colors.gray[5]
                            : theme.colors.red[0],
                          borderTop: `4px solid ${
                            dark ? theme.colors.blue[7] : theme.colors.red[9]
                          }`,
                          color: "#404040",
                          transition: "all 0.15s ease-in-out",
                          borderRadius: "0 0 3px 3px",
                          fontSize: "1.7rem",
                          "&:hover": {
                            backgroundColor: "#fff",
                          },
                        },
                      }}
                    />
                  </Flex>
                </Flex>
              </motion.div>
            )}
            {active === 1 && <motion.div {...animation}></motion.div>}
            {active === 2 && (
              <motion.div {...animation}>
                <Stack
                  className="pagePanel"
                  pos={"relative"}
                  maw={950}
                  p={30}
                  align="center"
                  spacing={25}
                >
                  <Input
                    size={"xl"}
                    w="100%"
                    placeholder="Title..."
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    sx={{
                      ".mantine-Input-input": {
                        background: dark ? "#101113" : "#E9ECEF",
                        "&:focus": {
                          background: dark ? "#383a3f" : "#f1f3f5",
                        },
                        "&::placeholder": {
                          fontWeight: 700,
                          fontStyle: "italic",
                        },
                      },
                    }}
                  />
                  <TripContent
                    active={active}
                    images={images}
                    setImages={setImages}
                  />
                </Stack>
              </motion.div>
            )}
            {active === 3 && (
              <motion.div {...animation}>
                <Center>
                  <Stack
                    className="pagePanel"
                    pt={10}
                    pb={30}
                    px={30}
                    maw={700}
                    w={"100%"}
                  >
                    <Box hidden={user} w={"100%"} mb={5}>
                      <Box>
                        <LoginComp
                          setInfoAdded={setInfoAdded}
                          mapLoaded={mapLoaded}
                          auth={auth}
                        />
                      </Box>
                    </Box>
                    <Center mt={user ? 20 : 0}>
                      <Button
                        leftIcon={<IconBuildingBank size={34} />}
                        variant="light"
                        color="green"
                        size="xl"
                        h={90}
                        w={"100%"}
                      >
                        <Title order={2}>ADD BANKING INFORMATION</Title>
                      </Button>
                    </Center>
                    <Divider w={"100%"} my={5} opacity={0.3} />
                    <Group spacing={0}>
                      <Text fz={12} w={"80%"} pr={5}>
                        We use Stripe, a trusted payment processor, to securely
                        handle transactions and disburse funds, ensuring the
                        protection of your sensitive banking information.
                      </Text>
                      <Image
                        src="img/stripe.png"
                        fit="contain"
                        display={"block"}
                        opacity={0.3}
                        px={20}
                        style={{
                          width: "20%",
                          borderRadius: "3px",
                          backgroundColor: "rgba(255,255,255,0.08)",
                        }}
                        alt=""
                      />
                    </Group>
                  </Stack>
                </Center>
              </motion.div>
            )}
          </Box>
          <Box>
            <Stepper
              active={active}
              onStepClick={setActive}
              iconPosition="right"
              orientation="vertical"
              allowNextStepsSelect={false}
              miw={205}
              mt={20}
              mb={-20}
              mr={20}
              size="xs"
              w="20%"
            >
              <Stepper.Step
                label="Travel Starting Info"
                description="Travel date and starting location"
              />
              <Stepper.Step
                label="Cost Calculator"
                description="Calculate all your travel costs"
              />
              <Stepper.Step
                label="Travel Details"
                description="Information for your supporters"
              />
              <Stepper.Step
                label="Account Info"
                description="Provide account details"
              />
            </Stepper>
            {active > 0 && (
              <>
                <Divider
                  mb={5}
                  opacity={0.5}
                  size={"xs"}
                  variant="solid"
                  label={"Total Cost"}
                  labelPosition="center"
                />
                <NumberInput
                  ref={sumRef}
                  icon={<IconCurrencyDollar />}
                  size="xl"
                  w={225}
                  onFocus={(event) => {
                    event.target.select();
                  }}
                  stepHoldDelay={600}
                  stepHoldInterval={400}
                  variant="filled"
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  min={0}
                  sx={{
                    ".mantine-NumberInput-input": {
                      textAlign: "right",
                      fontWeight: 700,
                      paddingRight: 50,
                    },
                  }}
                />
              </>
            )}
            {startLocale && travelDates && (
              <Divider w={"100%"} my={15} opacity={0.5} />
            )}
            {active !== 0 && (
              // Move Up Sections Button
              <Button fullWidth variant={"default"} mb={10} onClick={prevStep}>
                <IconChevronUp />
              </Button>
            )}
            {startLocale && travelDates && (
              // Move Down Sections Button
              <Button fullWidth variant={"default"} onClick={changeNextStep}>
                {active === 3 ? "DONE" : <IconChevronDown />}
              </Button>
            )}
          </Box>
        </Flex>
      </Center>
    </Box>
  );
}
