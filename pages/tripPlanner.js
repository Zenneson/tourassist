"use client";
import "@mantine/dates/styles.css";
import { useState, useRef, useEffect } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconBuildingBank,
  IconMapPin,
  IconChevronsRight,
  IconAlertTriangle,
  IconCheck,
  IconFileInfo,
  IconX,
} from "@tabler/icons-react";
import {
  useComputedColorScheme,
  Autocomplete,
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
  Flex,
  Badge,
  Switch,
  Indicator,
  ActionIcon,
  Popover,
  Timeline,
  HoverCard,
} from "@mantine/core";
import { useSessionStorage, useElementSize } from "@mantine/hooks";
import { motion } from "framer-motion";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { DatePicker } from "@mantine/dates";
import { dateFormat, dateId, saveToDB } from "../libs/custom";
import { useUser } from "../libs/context";
import { MultiSelect } from "../comps/trip/multiSelect";
import LoginComp from "../comps/loginComp";
import TripContent from "../comps/trip/tripContent";
import UseTickets from "../comps/trip/useTickets";
import SumInput from "../comps/trip/sumInput";
import classes from "./tripplanner.module.css";

export default function TripPlanner(props) {
  let { auth, mapLoaded } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const [isClient, setIsClient] = useState(false);
  const [startLocaleSearch, setStartLocaleSearch] = useState("");
  const [startLocaleData, setStartLocaleData] = useState([]);
  const [startCity, setStartCity] = useState("");
  const [startRegion, setStartRegion] = useState("");
  const [travelDates, setTravelDates] = useState(null);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { ref, width, height } = useElementSize();
  const dayjs = require("dayjs");
  const { user } = useUser();

  const [placeData, setPlaceData] = useSessionStorage({
    key: "places",
    defaultValue: [],
  });

  const [destinations, setDestinations] = useState([]);
  const [infoAdded, setInfoAdded] = useState(false);
  const [showTripInfo, setShowTripInfo] = useState(false);
  const startLocaleRef = useRef(null);
  const titleRef = useRef(null);

  const [images, setImages] = useSessionStorage({
    key: "images",
    defaultValue: [],
  });
  const [startLocale, setStartLocale] = useSessionStorage({
    key: "startLocale",
    defaultValue: "",
  });
  const [travelers, setTravelers] = useSessionStorage({
    key: "travelers",
    defaultValue: 1,
  });
  const [roundTrip, setRoundTrip] = useSessionStorage({
    key: "roundTrip",
    defaultValue: false,
  });
  const [plannerTripTitle, setPlannerTripTitle] = useSessionStorage({
    key: "plannerTripTitle",
    defaultValue: "",
  });
  const [plannerTripDesc, setPlannerTripDesc] = useSessionStorage({
    key: "plannerTripDesc",
    defaultValue: "",
  });

  const setCostsToZero = (trips) => {
    return trips.map((trip) => ({
      ...trip,
      costs: {
        flight: 0,
        hotel: 0,
      },
    }));
  };

  const handleReset = () => {
    const newData = [...placeData];
    const resetVals = setCostsToZero(newData);
    setPlaceData(resetVals);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const [costsObj, setCostsObj] = useState([]);

  const today = new Date();
  const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

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

  const placeExists = {
    title: "Already set as destination",
    message: `${startLocale} is set as a destination. Please choose another location.`,
    color: "orange",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
  };

  const noCosts = {
    title: "Trip Cost Missing",
    message: "Add your trip costs.",
    color: "red",
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    icon: <IconAlertTriangle size={17} />,
    autoClose: 2500,
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

  const tripFailed = {
    id: "creating-trip",
    title: "Failed to Create Trip Campaign",
    message:
      "There was an error while creating your trip campaign. Please try again later.",
    color: "red",
    loading: false,
    autoClose: 5000,
    icon: <IconCheck size={17} />,
  };

  const placeCheck = () => {
    placeData.map((place) => {
      if (`${place.place}, ${place.region}` === startLocale) {
        notifications.show(placeExists);
        setStartLocale("");
        setStartLocaleSearch("");
        setStartLocaleData([]);
        return true;
      }
    });
  };

  useEffect(() => {
    if (!startLocaleRef.current?.value) {
      setStartLocaleSearch("");
      setStartLocale("");
    }
  }, [setStartLocale, setStartLocaleSearch]);

  const generateTripId = () => {
    const trip_title = plannerTripTitle
      .replace(/ /g, "")
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();
    let date_time_string = dateId(travelDates.toString());
    let name = user.email.match(/^(.*?)@/);
    let trip_id = `${name[1]}_${trip_title}${date_time_string}`;
    return trip_id;
  };

  const changeNextStep = async () => {
    if (active === 1) {
      if (
        sessionStorage.getItem("totalCost") === "0" ||
        sessionStorage.getItem("totalCost") === 0
      ) {
        return notifications.show(noCosts);
      }
      setCostsObj(sessionStorage.getItem("places"));
    }
    if (active === 2) {
      if (plannerTripTitle === "") {
        notifications.show(noTitle);
        return;
      }
      if (plannerTripTitle.length < 11) {
        notifications.show(titleIsShort);
        return;
      }
      if (plannerTripDesc && plannerTripDesc.length === 0) {
        notifications.show(noDesc);
        return;
      }
      if (plannerTripDesc && plannerTripDesc.length < 11) {
        notifications.show(descIsShort);
        return;
      }
      setDestinations(formatPlaces(placeData));
    }
    if (active !== 3) {
      nextStep();
    }
    if (active === 3) {
      if (!user && !infoAdded && router.pathname === "/tripPlanner") {
        notifications.show(noAccountInfo);
        return;
      }
      const travel_date = dateFormat(travelDates.toString());
      const createdId = generateTripId();
      const costsSum = sessionStorage.getItem("totalCost");
      notifications.show(createTrip);
      saveToDB(
        plannerTripTitle,
        images,
        plannerTripDesc,
        startLocale,
        travelers,
        travel_date,
        roundTrip,
        costsObj,
        createdId,
        costsSum,
        destinations,
        user.email
      )
        .then(() => {
          notifications.update(tripMade);
          router.push("/" + generateTripId());
        })
        .catch((error) => {
          notifications.update(tripFailed);
          console.error("Failed to save to database:", error);
        });
    }
  };

  const handleChange = async () => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${startLocaleSearch}.json?&autocomplete=true&&fuzzyMatch=true&types=place&limit=5&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

    if (startLocaleSearch?.length > 0) {
      try {
        const response = await fetch(endpoint);
        const results = await response.json();
        const data = results.features.map((feature) => ({
          label: feature.place_name,
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
        console.error("Error fetching data for Country Autocomplete: ", error);
      }
    }
  };

  const handleSubmit = (e) => {
    const index = e.indexOf(",");
    const subCity = e.substring(0, index);
    const subRegion = e.substring(index + 1, e.length);

    if (placeCheck() === true) return;
    setStartLocale(e);
    setStartCity(subCity);
    setStartRegion(subRegion);
  };

  const optionsFilter = ({ options, search }) => {
    const searchWords = search.toLowerCase().trim().split(/\s+/);
    return options.filter((option) =>
      searchWords.every((searchWord) =>
        option.label.toLowerCase().includes(searchWord)
      )
    );
  };

  const TripTitle = () => {
    const [value, setValue] = useState(plannerTripTitle);

    return (
      <Input
        classNames={{ input: classes.plannerTripTitleInput }}
        ref={titleRef}
        size={"xl"}
        w="100%"
        placeholder="Title..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          setPlannerTripTitle(e.target.value);
        }}
      />
    );
  };

  const clearAutoComplete = () => {
    setStartLocale("");
    setStartLocaleSearch("");
    setStartLocaleData([]);
  };

  return (
    isClient && (
      <Box px={20} pb={50}>
        <Space h={110} />
        <Center ml={-40}>
          <Divider
            w={"100%"}
            maw={1200}
            mb={20}
            opacity={0.4}
            labelPosition="left"
            color={dark ? "gray.7" : "dark.1"}
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
            <Box w="100%">
              {active === 0 && (
                <motion.div {...animation}>
                  <Flex pb={30} px={30} maw={950} direction={"column"}>
                    <Title order={5} fw={400} h={20} mb={20}>
                      {startLocale && travelDates ? (
                        "Continue..."
                      ) : (
                        <Text fw={700} opacity={1}>
                          Provide the{" "}
                          <Text inherit span hidden={startLocale}>
                            Departure City{" "}
                          </Text>
                          <Text
                            inherit
                            span
                            hidden={startLocale || travelDates}
                          >
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
                      gap={30}
                    >
                      <Flex
                        className="pagePanel"
                        direction={"column"}
                        justify={"center"}
                        gap={20}
                        p={"xl"}
                        w="100%"
                        miw={"470px"}
                        mih={height + 64}
                      >
                        <Autocomplete
                          classNames={{
                            label: classes.labelSize,
                            input: classes.startLocaleInput,
                            option: classes.startLocaleOption,
                          }}
                          label="Departure City"
                          placeholder="Add Departure City..."
                          selectFirstOptionOnChange
                          ref={startLocaleRef}
                          limit={5}
                          size="xl"
                          w={"100%"}
                          value={startLocaleSearch}
                          data={startLocaleData}
                          filter={optionsFilter}
                          rightSection={
                            startLocaleSearch.length > 0 && (
                              <ActionIcon
                                variant="subtle"
                                className={classes.clearAutoCompleteBtn}
                                onClick={clearAutoComplete}
                              >
                                <IconX />
                              </ActionIcon>
                            )
                          }
                          onChange={(e) => {
                            setStartLocaleSearch(e);
                            handleChange(e);
                            if (startLocaleRef.current.value === "") {
                              setStartLocaleSearch("");
                              setStartLocale("");
                            }
                          }}
                          onOptionSubmit={(e) => handleSubmit(e)}
                        />
                        <MultiSelect />
                        <Group
                          justify="space-around"
                          pb={50}
                          mb={5}
                          style={{
                            borderBottom: "2px solid rgba(84, 84, 84, 0.1)",
                          }}
                        >
                          <Group py={10}>
                            <Text fz={12}>Travelers: </Text>
                            {/* Traveler Count  */}
                            <NumberInput
                              classNames={{
                                label: classes.labelSize,
                                input: classes.travelersInput,
                                controls: classes.travelersContorls,
                              }}
                              size="sm"
                              w={"77px"}
                              radius={"25px"}
                              type="number"
                              suffix={""}
                              value={travelers}
                              onChange={(e) => setTravelers(e)}
                              defaultValue={1}
                              min={1}
                            />
                          </Group>
                          <Switch
                            classNames={{
                              track: classes.switchTrack,
                              label: classes.labelSize,
                            }}
                            styles={{
                              thumb: {
                                borderColor: dark ? "#262626" : "#d7d7d7",
                                background: dark ? "#282a2d" : "#fff",
                              },
                            }}
                            label="Round Trip?"
                            labelPosition="left"
                            onLabel="YES"
                            offLabel="NO"
                            size="xl"
                            color={dark ? "#0d3f82" : "#2dc7f3"}
                            checked={roundTrip}
                            onChange={() => {
                              setRoundTrip(!roundTrip);
                            }}
                          />
                        </Group>
                      </Flex>
                      <Center
                        className="pagePanel"
                        p={"xl"}
                        w="100%"
                        miw={365}
                        ref={ref}
                      >
                        <DatePicker
                          classNames={{
                            day: classes.datePicker,
                          }}
                          allowDeselect
                          firstDayOfWeek={0}
                          defaultDate={travelDates || dayjs().add(7, "day")}
                          minDate={weekAhead}
                          value={travelDates}
                          size={"md"}
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
                              <HoverCard
                                shadow="md"
                                position="top"
                                withArrow="true"
                                offset={7}
                                arrowSize={15}
                                disabled={!isSpecificDay}
                                transitionProps={{ duration: 0 }}
                                styles={{
                                  dropdown: {
                                    marginLeft: 9,
                                  },
                                }}
                              >
                                <HoverCard.Target>
                                  <Indicator
                                    size={7}
                                    color={"red.7"}
                                    offset={-4}
                                    disabled={!isSpecificDay}
                                  >
                                    <div>{day}</div>
                                  </Indicator>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                  <Text fz={12} ta={"center"}>
                                    Fundraiser Ends
                                    <br />
                                    Day Before Travel
                                  </Text>
                                </HoverCard.Dropdown>
                              </HoverCard>
                            );
                          }}
                        />
                      </Center>
                    </Flex>
                  </Flex>
                </motion.div>
              )}
              {active === 1 && (
                <motion.div {...animation}>
                  <Box mt={40} maw={950}>
                    <UseTickets
                      handleReset={handleReset}
                      roundTrip={roundTrip}
                      placeData={placeData}
                      setPlaceData={setPlaceData}
                    />
                  </Box>
                </motion.div>
              )}
              {active === 2 && (
                <motion.div {...animation}>
                  <Stack
                    className="pagePanel"
                    pos={"relative"}
                    maw={950}
                    p={30}
                    align="center"
                    gap={20}
                  >
                    <TripTitle />
                    <TripContent
                      titleRef={titleRef}
                      active={active}
                      images={images}
                      setImages={setImages}
                    />
                  </Stack>
                </motion.div>
              )}
              {active === 3 && (
                <motion.div {...animation}>
                  <Center h={"50vh"}>
                    <Stack
                      className="pagePanel"
                      pt={10}
                      pb={30}
                      px={30}
                      maw={700}
                      h={user ? 205 : "auto"}
                      w={"100%"}
                    >
                      {!user && (
                        <Box w={"100%"} mb={5}>
                          <Box>
                            <LoginComp mapLoaded={mapLoaded} auth={auth} />
                          </Box>
                        </Box>
                      )}
                      <Center mt={user ? 20 : 0}>
                        <Button.Group w={"100%"}>
                          <Button
                            leftSection={
                              <IconBuildingBank size={20} opacity={0.5} />
                            }
                            variant="filled"
                            h={50}
                            w={"80%"}
                          >
                            <Title order={4}>ADD BANKING INFORMATION</Title>
                          </Button>
                          <Button
                            className={classes.brightenButton}
                            variant="filled"
                            h={50}
                            w={"20%"}
                            opacity={0.8}
                          >
                            <Title fz={10}>ADD LATER</Title>
                          </Button>
                        </Button.Group>
                      </Center>
                      <Divider
                        w={"100%"}
                        my={5}
                        opacity={0.3}
                        color={dark && "gray.9"}
                      />
                      <Group gap={0}>
                        <Box w={"80%"}>
                          <Text fw={700} fz={12}>
                            Banking Info is needed to disburse raised funds.
                            Stripe securely handles this process.
                          </Text>
                          <Text fz={11}>
                            Note that you can still use raised funds for flight
                            and hotel bookings on our platform before adding
                            your banking info.
                          </Text>
                        </Box>
                        <Image
                          src="img/stripe.svg"
                          fit="contain"
                          display={"block"}
                          opacity={0.3}
                          pl={20}
                          alt="Stripe Logo"
                          style={{
                            filter: dark && "invert(50%)",
                            width: "20%",
                            borderRadius: "3px",
                          }}
                        />
                      </Group>
                    </Stack>
                  </Center>
                </motion.div>
              )}
            </Box>
            <Box pos={"relative"}>
              <Stepper
                active={active}
                onStepClick={setActive}
                iconjustify="flex-end"
                orientation="vertical"
                allowNextStepsSelect={false}
                color={dark ? "blue.9" : "blue.4"}
                miw={205}
                mt={45}
                mb={-20}
                mr={20}
                size="xs"
                w="20%"
                styles={{
                  stepIcon: {
                    overflow: "hidden",
                    backgroundColor: dark && "#050506",
                  },
                  stepCompletedIcon: {
                    backgroundColor: dark && "#0D3F82",
                  },
                }}
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
              <Popover
                withArrow
                arrowSize={15}
                offset={3}
                position="top-end"
                shadow="xl"
                transitionProps={{
                  duration: 300,
                  transition: "skew-down",
                }}
              >
                <Popover.Target>
                  <Box>
                    {(travelDates || startLocale) && (
                      <Button
                        className={classes.tripInformationBtn}
                        hidden={true}
                        mt={10}
                        pl={7}
                        fw={100}
                        size="xs"
                        fullWidth
                        variant="default"
                        color={dark ? "#fff" : "#000"}
                        rightSection={
                          <IconFileInfo
                            style={{ marginLeft: -5 }}
                            size={16}
                            opacity={0.2}
                          />
                        }
                        onClick={() => setShowTripInfo(true)}
                      >
                        Trip Information
                      </Button>
                    )}
                  </Box>
                </Popover.Target>
                <Popover.Dropdown p={"xl"} py={20}>
                  {startLocale && (
                    <Divider
                      label="Trip Information"
                      labelPosition="left"
                      mb={10}
                    />
                  )}
                  <Stack gap={3}>
                    {startLocale && (
                      <PlaceTimeline
                        dark={dark}
                        placeData={placeData}
                        roundTrip={roundTrip}
                        startCity={startCity}
                        startRegion={startRegion}
                        startLocale={startLocale}
                      />
                    )}
                    {travelDates && (
                      <>
                        {startLocale && travelDates && <Divider my={10} />}
                        <Badge
                          variant="dot"
                          size="xs"
                          color="green.9"
                          classNames={{ root: classes.badge }}
                        >
                          {dayjs(travelDates).format("LL")}
                        </Badge>
                        <Badge
                          variant="dot"
                          size="xs"
                          color="green.6"
                          classNames={{ root: classes.badge }}
                        >
                          {roundTrip ? "Round Trip" : "One Way"}
                        </Badge>
                        <Badge
                          variant="dot"
                          size="xs"
                          color="green.3"
                          classNames={{ root: classes.badge }}
                        >
                          {travelers === 1
                            ? "Solo Traveler"
                            : travelers + " Travelers"}
                        </Badge>
                      </>
                    )}
                  </Stack>
                </Popover.Dropdown>
              </Popover>
              {active > 0 && (
                <>
                  <Divider
                    my={5}
                    opacity={dark ? 0.3 : 0.7}
                    color={dark && "gray.5"}
                    size={"xs"}
                    variant="solid"
                    labelPosition="left"
                    label={"Total Cost"}
                    labeljustify="center"
                  />
                  <SumInput />
                </>
              )}
              {startLocale && travelDates && (
                <Divider
                  w={"100%"}
                  my={15}
                  opacity={dark ? 0.1 : 0.5}
                  color={dark && "gray.5"}
                />
              )}
              {active !== 0 && (
                // Move Up Sections Button
                <Button
                  className={classes.panelBtns}
                  fullWidth
                  variant={"filled"}
                  mb={10}
                  onClick={prevStep}
                >
                  <IconChevronUp />
                </Button>
              )}
              {startLocale && travelDates && (
                // Move Down Sections Button
                <Button
                  className={classes.panelBtns}
                  fullWidth
                  variant={"filled"}
                  onClick={changeNextStep}
                >
                  {active === 3 ? "DONE" : <IconChevronDown />}
                </Button>
              )}
            </Box>
          </Flex>
        </Center>
      </Box>
    )
  );
}

const PlaceTimeline = (props) => {
  const { dark, placeData, roundTrip, startCity, startRegion, startLocale } =
    props;

  if (!roundTrip && !startLocale) {
    return (
      <Timeline
        lineWidth={3}
        bulletSize={20}
        classNames={{
          item: classes.timelineItem,
          itemTitle: classes.timelineTitle,
        }}
      >
        {placeData.map((place, index) => (
          <Timeline.Item
            title={place.place}
            lineVariant="dashed"
            key={place.place + index}
            bullet={<IconMapPin />}
          >
            <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
              {place.region}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }

  if (!roundTrip && startCity) {
    return (
      <Timeline
        lineWidth={3}
        bulletSize={20}
        classNames={{
          item: classes.timelineItem,
          itemTitle: classes.timelineTitle,
        }}
      >
        <Timeline.Item
          title={startCity}
          lineVariant="dashed"
          bullet={<IconMapPin />}
        >
          <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
            {startRegion}
          </Text>
        </Timeline.Item>
        {placeData.map((place, index) => (
          <Timeline.Item
            title={place.place}
            key={place.place + index}
            lineVariant="dashed"
            bullet={<IconMapPin />}
          >
            <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
              {place.region}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }

  if (roundTrip && startCity) {
    return (
      <Timeline
        lineWidth={3}
        bulletSize={20}
        classNames={{
          item: classes.timelineItem,
          itemTitle: classes.timelineTitle,
        }}
      >
        <Timeline.Item
          title={startCity}
          lineVariant="dashed"
          bullet={<IconMapPin />}
        >
          <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
            {startRegion}
          </Text>
        </Timeline.Item>
        {placeData.map((place, index) => (
          <Timeline.Item
            title={place.place}
            key={place.place + index}
            lineVariant="dashed"
            bullet={<IconMapPin />}
          >
            <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
              {place.region}
            </Text>
          </Timeline.Item>
        ))}
        <Timeline.Item
          title={startCity}
          lineVariant="dashed"
          bullet={<IconMapPin />}
        >
          <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
            {startRegion}
          </Text>
        </Timeline.Item>
      </Timeline>
    );
  }
};
