"use client";
import LoginComp from "@globalComps/login/loginComp";
import TripContent from "@globalComps/trip/tripContent";
import { useUser } from "@libs/context";
import { dateFormat, dateId, saveToDB } from "@libs/custom";
import {
  createTrip,
  descIsShort,
  noAccountInfo,
  noCosts,
  noDesc,
  noTitle,
  titleIsShort,
  tripFailed,
  tripMade,
} from "@libs/notifications";
import { useTripPlannerState } from "@libs/store";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  Input,
  Portal,
  Space,
  Stack,
  Stepper,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { createFormContext } from "@mantine/form";
import { useSessionStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingBank,
  IconCalculator,
  IconCalendarMonth,
  IconChevronDown,
  IconChevronUp,
  IconChevronsRight,
  IconId,
  IconListCheck,
  IconListNumbers,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classes from "../styles/tripPlanner.module.css";
import FirstPanel from "./firstPanel";
import SumInput from "./sumInput";
import TripDetailsDrawer from "./tripDetailsDrawer";
import UseTickets from "./useTickets";

const [FormProvider, useFormContext, useForm] = createFormContext();

export default function TripPlannerWrapper(props) {
  const { placeData = [], setPlaceData } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const [startLocaleSearch, setStartLocaleSearch] = useState("");
  const [startLocaleData, setStartLocaleData] = useState([]);
  const [travelDates, setTravelDates] = useState(null);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [destinations, setDestinations] = useState([]);
  const [infoAdded, setInfoAdded] = useState(false);
  const [showTripInfo, setShowTripInfo] = useState(false);
  const startLocaleRef = useRef(null);
  const titleRef = useRef(null);

  const {
    roundTrip,
    travelers,
    setTravelers,
    plannerImages,
    setPlannerImages,
    setPlannerTripDesc,
    plannerTripTitle,
    setPlannerTripTitle,
    plannerTripDesc,
    startLocale,
    setStartLocale,
  } = useTripPlannerState();

  const splitLocale = (e) => {
    const index = e.indexOf(",");
    const subCity = e.substring(0, index);
    const subRegion = e.substring(index + 2, e.length);

    return [subCity, subRegion];
  };

  const [startCity, setStartCity] = useState(splitLocale(startLocale)[0] || "");
  const [startRegion, setStartRegion] = useState(
    splitLocale(startLocale)[1] || ""
  );

  const [savedFormValues, setSavedFormValues] = useSessionStorage({
    key: "formValues",
    defaultValue: {
      places: placeData.map((place) => ({
        place: place.place,
        region: place.region,
        costs: {
          flight: 0,
          hotel: 0,
        },
      })),
    },
  });

  const handleRoundTrip = () => {
    if (placeData.length > 0 && startLocale !== "") {
      let tempData = JSON.parse(JSON.stringify(placeData));
      const lastIndex = tempData.length - 1;
      const lastPlace = tempData[lastIndex];
      const isReturnFlight = lastPlace && lastPlace.returnFlight;

      if (roundTrip) {
        if (isReturnFlight) {
          // Update the last place if it doesn't match startLocale or if place is empty
          let lastPlaceLocale = `${lastPlace.place}, ${lastPlace.region}`;
          if (startLocale !== lastPlaceLocale || lastPlace.place === "") {
            tempData[lastIndex] = {
              place: startCity,
              region: startRegion,
              returnFlight: true,
              costs: { flight: 0 },
            };
          }
        } else {
          // Add a return flight if it doesn't exist
          tempData.push({
            place: startCity,
            region: startRegion,
            returnFlight: true,
            costs: { flight: 0 },
          });
        }
      } else if (isReturnFlight) {
        // Remove the return flight for a one-way trip
        tempData.pop();
      }

      setPlaceData(tempData);
    }
  };

  useEffect(() => {
    handleRoundTrip();
  }, [roundTrip]);

  const form = useForm({
    initialValues: savedFormValues,
    transformValues: (values) => {
      let totalCost = 0;

      values.places.forEach((place) => {
        Object.values(place.costs).forEach((cost) => {
          totalCost += cost;
        });
      });

      return totalCost;
    },
  });

  dayjs.extend(localizedFormat);

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const [costsObj, setCostsObj] = useState([]);

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

  const [costsSum, setCostsSum] = useState(form.values.totalCost || 0);
  const tripSum = form.values.totalCost || form.getTransformedValues() || 0;
  const changeNextStep = async () => {
    if (active === 1) {
      setCostsSum(form.values.totalCost || 0);
      if (tripSum === 0 || tripSum === "0") {
        return notifications.show(noCosts);
      }
      setCostsObj(savedFormValues);
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
      if (!user && !infoAdded && pathname === "/tripPlanner") {
        notifications.show(noAccountInfo);
        return;
      }
      const travel_date = dateFormat(travelDates.toString());
      const createdId = generateTripId();
      notifications.show(createTrip);
      saveToDB(
        plannerTripTitle,
        plannerImages,
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
          router.push("/" + createdId);
        })
        .catch((error) => {
          notifications.update(tripFailed);
          console.error("Failed to save to database:", error);
        });
    }
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

  const disallowEmptyField = ({ value }) => {
    return value !== "";
  };

  return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Box px={20} pb={50}>
          <Space h={110} />
          <Center ml={-40}>
            <Divider
              className={classes.divider}
              w={"100%"}
              maw={1260}
              mb={20}
              labelPosition="left"
              label={
                <Flex>
                  <IconChevronsRight size={20} />
                  <Text fz={14}>
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
                    <FirstPanel
                      dark={dark}
                      placeData={placeData}
                      clearAutoComplete={clearAutoComplete}
                      startLocaleRef={startLocaleRef}
                      startLocale={startLocale}
                      setStartLocale={setStartLocale}
                      setStartCity={setStartCity}
                      setStartRegion={setStartRegion}
                      startLocaleSearch={startLocaleSearch}
                      setStartLocaleSearch={setStartLocaleSearch}
                      startLocaleData={startLocaleData}
                      setStartLocaleData={setStartLocaleData}
                      travelDates={travelDates}
                      setTravelDates={setTravelDates}
                      travelers={travelers}
                      setTravelers={setTravelers}
                    />
                  </motion.div>
                )}
                {active === 1 && (
                  <motion.div {...animation}>
                    <Box mt={35} maw={940}>
                      <UseTickets
                        form={form}
                        placeData={placeData}
                        setPlaceData={setPlaceData}
                        startLocale={startLocale}
                        startCity={startCity}
                        startRegion={startRegion}
                        setSavedFormValues={setSavedFormValues}
                        disallowEmptyField={disallowEmptyField}
                      />
                    </Box>
                  </motion.div>
                )}
                {active === 2 && (
                  <motion.div {...animation}>
                    <Stack
                      className="pagePanel"
                      pos={"relative"}
                      mt={35}
                      maw={940}
                      p={30}
                      align="center"
                      gap={20}
                    >
                      <TripTitle />
                      <TripContent
                        titleRef={titleRef}
                        active={active}
                        images={plannerImages}
                        setImages={setPlannerImages}
                        setTripDesc={setPlannerTripDesc}
                      />
                    </Stack>
                  </motion.div>
                )}
                {active === 3 && (
                  <motion.div {...animation}>
                    <Space h={20} />
                    <Center h={"50vh"}>
                      <Stack
                        className="pagePanel"
                        pt={10}
                        pb={30}
                        px={30}
                        maw={600}
                        h={user ? 220 : "auto"}
                        w={"100%"}
                      >
                        {!user && (
                          <Box w={"100%"} mb={5}>
                            <Box id="container">
                              <Portal target={"#container"}>
                                <LoginComp />
                              </Portal>
                            </Box>
                          </Box>
                        )}
                        {!user && (
                          <Divider
                            w={"100%"}
                            my={5}
                            opacity={0.3}
                            color={dark && "gray.9"}
                          />
                        )}
                        <Center mt={user ? 20 : 0}>
                          <Button.Group w={"100%"}>
                            <Button
                              leftSection={
                                <IconBuildingBank size={20} opacity={0.5} />
                              }
                              bg={dark ? "blue.7" : "blue.4"}
                              variant="filled"
                              h={50}
                              w={"80%"}
                            >
                              <Title order={4}>ADD BANKING INFORMATION</Title>
                            </Button>
                            <Button
                              className={classes.brightenButton}
                              bg={dark ? "blue.8" : "blue.4"}
                              variant="filled"
                              h={50}
                              w={"20%"}
                              opacity={0.75}
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
                              Note that you can still use raised funds for
                              flight and hotel bookings on our platform before
                              adding your banking info.
                            </Text>
                          </Box>
                          <Image
                            src="/img/logos/stripe.svg"
                            fill={"contain"}
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
              <Box pos={"sticky"} top={155}>
                <Stepper
                  classNames={{
                    stepIcon: classes.stepperIcon,
                    stepCompletedIcon: classes.stepperCompleteIcon,
                    verticalSeparator: classes.verticalSeparator,
                  }}
                  iconSize={40}
                  active={active}
                  onStepClick={setActive}
                  orientation="vertical"
                  allowNextStepsSelect={false}
                  miw={205}
                  mt={45}
                  mb={-20}
                  mr={20}
                  size="xs"
                  w="20%"
                >
                  <Stepper.Step
                    withIcon={true}
                    completedIcon={<IconCalendarMonth size={22} />}
                    icon={<IconCalendarMonth size={18} stroke={1} />}
                    label="Travel Starting Info"
                    description="Travel date and starting location"
                  />
                  <Stepper.Step
                    withIcon={true}
                    completedIcon={<IconCalculator size={22} />}
                    icon={<IconCalculator size={18} stroke={1} />}
                    label="Cost Calculator"
                    description="Calculate all your travel costs"
                  />
                  <Stepper.Step
                    withIcon={true}
                    completedIcon={<IconListCheck size={22} />}
                    icon={<IconListCheck size={18} stroke={1} />}
                    label="Travel Details"
                    description="Information for your supporters"
                  />
                  <Stepper.Step
                    withIcon={true}
                    completedIcon={<IconId size={22} />}
                    icon={<IconId size={18} stroke={1} />}
                    label="Account Info"
                    description="Provide account details"
                  />
                </Stepper>
                {(travelDates || startLocale) && (
                  <Button
                    className={classes.panelBtns}
                    hidden={true}
                    size="sm"
                    fullWidth
                    variant="default"
                    color={dark ? "#fff" : "#000"}
                    leftSection={
                      <IconListNumbers size={18} stroke={1} opacity={0.7} />
                    }
                    onClick={() => setShowTripInfo(!showTripInfo)}
                  >
                    Trip Details
                  </Button>
                )}
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
                    <SumInput
                      form={form}
                      disallowEmptyField={disallowEmptyField}
                    />
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
                    <IconChevronUp stroke={3} />
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
                    {active === 3 ? "DONE" : <IconChevronDown stroke={3} />}
                  </Button>
                )}
              </Box>
            </Flex>
          </Center>
        </Box>
      </form>
      <TripDetailsDrawer
        showTripInfo={showTripInfo}
        setShowTripInfo={setShowTripInfo}
        dark={dark}
        placeData={placeData}
        roundTrip={roundTrip}
        startLocale={startLocale}
        splitLocale={splitLocale}
        travelDates={travelDates}
        travelers={travelers}
      />
    </FormProvider>
  );
}
