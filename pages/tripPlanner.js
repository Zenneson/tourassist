import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
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
import { notifications } from "@mantine/notifications";
import LoginComp from "../comps/loginComp";
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
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { DatePicker } from "@mantine/dates";
import TripContent from "../comps/tripinfo/tripContent";

export default function TripPlannerPage(props) {
  const theme = useMantineTheme();
  let auth = props.auth;
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });
  const [images, setImages] = useSessionStorage({
    key: "images",
    defaultValue: [],
  });
  const [startLocaleSearch, setStartLocaleSearch] = useState("");
  const [startLocaleData, setStartLocaleData] = useState([]);
  const [startLocale, setStartLocale] = useState("");
  const [travelers, setTravelers] = useState(1);
  const travelersHandlerRef = useRef(null);
  const [travelDates, setTravelDates] = useState(null);
  const [checked, setChecked] = useState(false);
  const forceUpdate = useForceUpdate();
  const startLocaleRef = useRef(null);
  const [newCost, setNewCost] = useState([]);
  const newCostRef = useRef(null);
  const [tripTitle, setTripTitle] = useState("");
  const [costList, setCostList] = useState({});
  const [costsSum, setCostsSum] = useState(0);
  const router = useRouter();
  const [placeData, setPlaceData] = useSessionStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const dayjs = require("dayjs");
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  const [active, setActive] = useState(0);

  useEffect(() => {
    router.prefetch("/trippage");
  }, [router]);

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const Costs = ({ cost, costid }) => (
    <div key={index}>
      <Group position="right" mr={20}>
        <Text size={12} fs="italic" color="dimmed" mt={-25}>
          <Badge variant="default">{cost || "NEW COST"}</Badge>
        </Text>
        <div
          style={{
            marginTop: -25,
            width: "50%",
            border: `1px dotted ${
              theme.colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.234)"
            }`,
          }}
        ></div>
        <NumberInput
          costid={costid}
          onChange={(value) => handleInputChange(value, costid)}
          defaultValue={costList[costid] || 0}
          icon={<IconCurrencyDollar />}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""
          }
          stepHoldDelay={500}
          stepHoldInterval={100}
          precision={2}
          min={0}
          size="md"
          w={150}
          mb={20}
          variant="filled"
          sx={{
            ".mantine-NumberInput-input": {
              textAlign: "right",
              fontWeight: 700,
              paddingRight: 40,
            },
          }}
        />
      </Group>
    </div>
  );

  let formValue = "";
  const AddCost = (event) => {
    let index =
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.id ||
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    newCost[index]?.push(formValue.toUpperCase());
    forceUpdate();
  };

  useWindowEvent("keydown", (event) => {
    if (event.key === "Enter" && newCostRef.current) {
      AddCost(event);
    }
  });

  const Places = () =>
    placeData.map((place, index) => {
      newCost[index] = newCost[index] || [];
      return (
        <Box
          id={index}
          key={index}
          p={20}
          mb={20}
          radius={3}
          className="pagePanel"
        >
          <Group position="apart">
            <Stack
              spacing={0}
              pl={10}
              pt={5}
              pb={10}
              sx={{
                borderLeft: "5px solid rgba(150,150,150,0.1)",
              }}
            >
              <Title
                order={4}
                fw={600}
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {place.place}
              </Title>
              <Text size="xs" color="dimmed">
                {place.region}
              </Text>
            </Stack>
            <Divider
              w={"40%"}
              labelPosition="right"
              label={
                placeData.length === 1 &&
                checked && (
                  <Text color="dimmed" fz={10} fs={"italic"}>
                    ROUND TRIP
                  </Text>
                )
              }
            />
          </Group>
          <Box id={index}>
            {place.costs &&
              place.costs.map(
                (cost, index) =>
                  (cost === "FLIGHT" || cost === "HOTEL") && (
                    <Box key={index} pos="relative" pr={10}>
                      {/* Remove Cost Button */}
                      <ActionIcon
                        pos="absolute"
                        variant="default"
                        opacity={0.2}
                        right={-3}
                        top={-1}
                        h={43}
                        onClick={(event) => {
                          const placeIndex =
                            event.target.parentElement.parentElement?.id;
                          const costId = place.place + "_" + cost;
                          handleCostRemoval(
                            costId,
                            placeIndex,
                            index,
                            placeData,
                            setPlaceData
                          );
                        }}
                      >
                        <IconTrash size={17} pointerEvents="none" />
                      </ActionIcon>
                      <Costs costid={place.place + "_" + cost} cost={cost} />
                    </Box>
                  )
              )}
            {newCost[index] &&
              newCost[index].map((cost, index) => (
                <Box key={index} pos="relative" pr={10}>
                  {/* Remove Cost Button */}
                  <ActionIcon
                    pos="absolute"
                    variant="default"
                    opacity={0.2}
                    right={-3}
                    top={-1}
                    h={43}
                    onClick={(event) => {
                      const placeIndex =
                        event.target.parentElement.parentElement?.id;
                      const costId = place.place + "_" + cost;
                      handleCostRemoval(
                        costId,
                        placeIndex,
                        index,
                        newCost,
                        setNewCost
                      );
                    }}
                  >
                    <IconTrash size={17} pointerEvents="none" />
                  </ActionIcon>
                  <Costs costid={place.place + "_" + cost} cost={cost} />
                </Box>
              ))}
          </Box>
          <Divider
            opacity={0.2}
            color={
              theme.colorScheme === "dark" ? "rgba(255, 255, 255, 0.4)" : "#000"
            }
          />
          <Group position="right">
            <Popover
              width={250}
              position="left"
              shadow="xl"
              trapFocus
              radius="xl"
            >
              <Popover.Target>
                <Button
                  id={index}
                  variant="subtle"
                  size="xs"
                  color="gray"
                  leftIcon={<IconPlus size={15} />}
                  sx={{
                    opacity: 0.25,
                    transition: "opacity 0.2s ease-in-out",
                    "&:hover": {
                      opacity: 0.5,
                    },
                  }}
                >
                  <span id={index}>ADD COST</span>
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Input
                  placeholder="NEW COST"
                  variant="unstyled"
                  ref={newCostRef}
                  size="xs"
                  pl={10}
                  maxLength={25}
                  onChange={(value) => (formValue = value.target.value)}
                  sx={{
                    ".mantine-Input-input": {
                      textTransform: "uppercase",
                    },
                  }}
                  rightSection={
                    // Add New Cost Button
                    <ActionIcon
                      onClick={(event) => {
                        AddCost(event);
                      }}
                    >
                      <IconCirclePlus />
                    </ActionIcon>
                  }
                />
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Box>
      );
    });

  const index = startLocale?.indexOf(",");
  const startCity = startLocale.substring(0, index);
  const startRegion = startLocale?.substring(index + 1);

  const today = new Date();
  const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  let delayTimer = null;
  const handleInputChange = (value, costid) => {
    if (delayTimer) {
      clearTimeout(delayTimer);
    }

    delayTimer = setTimeout(() => {
      let updatedCosts = { ...costList, [costid]: parseFloat(value) };
      let sum = Object.values(updatedCosts).reduce(
        (acc, current) => acc + current,
        0
      );
      setCostList(updatedCosts);
      setCostsSum(sum);
    }, 300);
  };

  const handleCostRemoval = (
    costId,
    placeIndex,
    costIndex,
    originalArray,
    setOriginalArray
  ) => {
    let copyData = JSON.parse(JSON.stringify(originalArray));
    let newCostList = { ...costList };

    // remove the cost from the original array
    if (Array.isArray(copyData[placeIndex])) {
      copyData[placeIndex] = copyData[placeIndex].filter(
        (_, i) => i !== costIndex
      ); // If it's an array, remove the cost
    } else if (
      typeof copyData[placeIndex] === "object" &&
      copyData[placeIndex] !== null &&
      Array.isArray(copyData[placeIndex].costs)
    ) {
      copyData[placeIndex].costs = copyData[placeIndex].costs.filter(
        (_, i) => i !== costIndex
      ); // If it's an object, remove the cost from the `costs` array
    }

    // remove the cost from costList
    if (newCostList[costId] !== undefined) {
      delete newCostList[costId];
    }

    setOriginalArray(copyData);
    setCostList(newCostList);

    // recalculate the total cost
    let sum = Object.values(newCostList).reduce(
      (acc, current) => acc + current,
      0
    );
    setCostsSum(sum);
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));

  const changeNextStep = () => {
    if (active !== 3) {
      nextStep();
    }
    if (active === 3) {
      // sessionStorage.removeItem("placeDataState");
      setImages([]);
      router.push("/trippage");
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

  const placeCheck = () => {
    placeData.map((place) => {
      if (place.fullName === startLocale) {
        const wrongPlace = startLocale;
        notifications.show({
          title: "Already set as destination",
          message: `You already have ${wrongPlace} in your list.`,
          color: "red",
          style: { backgroundColor: "#2e2e2e" },
          icon: <IconAlertTriangle size={17} />,
          autoClose: 2500,
          style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
        });
        setStartLocale("");
        setStartLocaleSearch("");
        setStartLocaleData([]);
      }
    });
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
            {/* TODO   */}
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
                                color={
                                  theme.colorScheme === "dark"
                                    ? "rgb(255,255,255)"
                                    : "rgb(0,0,0)"
                                }
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
                            color={
                              theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                            }
                            c={
                              theme.colorScheme === "dark" ? "gray.0" : "dark.9"
                            }
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
                            color={
                              theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                            }
                            c={
                              theme.colorScheme === "dark" ? "gray.0" : "dark.9"
                            }
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
                                      theme.colorScheme === "dark"
                                        ? "rgb(255,255,255)"
                                        : "rgb(0,0,0)"
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
                              checked={checked}
                              onChange={() => setChecked(!checked)}
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
                            bg={
                              theme.colorScheme === "dark" ? "dark.5" : "gray.1"
                            }
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
                                {checked && startLocale && (
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
                                    color={
                                      theme.colorScheme === "dark"
                                        ? "red"
                                        : "blue"
                                    }
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
                      defaultDate={today}
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
                            color={
                              theme.colorScheme === "dark" ? "red" : "blue"
                            }
                            offset={-3}
                            disabled={!isSpecificDay}
                          >
                            <div>{day}</div>
                          </Indicator>
                        );
                      }}
                      sx={{
                        ".mantine-DatePicker-day[data-disabled]": {
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[6]
                              : theme.colors.gray[2],
                        },
                        ".mantine-DatePicker-day[data-weekend]": {
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.blue[2]
                              : theme.colors.red[3],
                        },
                        ".mantine-DatePicker-day[data-outside]": {
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[3]
                              : theme.colors.gray[5],
                        },
                        ".mantine-DatePicker-day[data-selected]": {
                          border: `1px solid ${
                            theme.colorScheme === "dark"
                              ? theme.colors.blue[1]
                              : theme.colors.red[2]
                          }`,
                          backgroundColor:
                            theme.colorScheme === "dark"
                              ? theme.colors.gray[5]
                              : theme.colors.red[0],
                          borderTop: `4px solid ${
                            theme.colorScheme === "dark"
                              ? theme.colors.blue[7]
                              : theme.colors.red[9]
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
            {active === 1 && (
              <motion.div {...animation}>
                <Places />
                {checked && placeData.length > 1 && (
                  <Box className="pagePanel" p={20} mb={20}>
                    <Group position="apart">
                      <Stack
                        spacing={0}
                        pl={10}
                        pt={5}
                        pb={10}
                        sx={{
                          borderLeft: "5px solid rgba(150,150,150,0.1)",
                        }}
                      >
                        <Title
                          order={4}
                          fw={600}
                          sx={{
                            textTransform: "uppercase",
                          }}
                        >
                          {startCity}
                        </Title>
                        <Text size="xs" color="dimmed">
                          {startRegion}
                        </Text>
                      </Stack>
                      <Divider
                        w={"40%"}
                        labelPosition="right"
                        label={
                          <Text color="dimmed" fz={10} fs={"italic"}>
                            RETURN FLIGHT
                          </Text>
                        }
                      />
                    </Group>
                    <Costs costid={"RETURN_FLIGHT"} cost={"Flight"} />
                  </Box>
                )}
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
                  spacing={25}
                >
                  <Input
                    size={"xl"}
                    placeholder="Title..."
                    w="100%"
                    onChange={(e) => setTripTitle(e.target.value)}
                    sx={{
                      ".mantine-Input-input": {
                        background:
                          theme.colorScheme === "dark" ? "#101113" : "#ced4da",
                        "&:focus": {
                          background:
                            theme.colorScheme === "dark"
                              ? "#383a3f"
                              : "#f1f3f5",
                        },
                        "&::placeholder": {
                          fontWeight: 700,
                          fontStyle: "italic",
                        },
                      },
                    }}
                  />
                  <TripContent images={images} setImages={setImages} />
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
                        <LoginComp auth={auth} />
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
                  icon={<IconCurrencyDollar />}
                  size="xl"
                  w={225}
                  value={costsSum}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (!Number.isNaN(numericValue)) {
                      setCostsSum(numericValue);
                    }
                  }}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  variant="filled"
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  precision={2}
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
              <Button
                fullWidth
                variant={"filled"}
                bg={theme.colorScheme === "dark" ? "dark.9" : "gray.3"}
                c={"white"}
                mb={10}
                onClick={prevStep}
              >
                <IconChevronUp />
              </Button>
            )}
            {startLocale && travelDates && (
              // Move Down Sections Button
              <Button
                fullWidth
                variant={"filled"}
                bg={
                  active === 3
                    ? "primary"
                    : theme.colorScheme === "dark"
                    ? "dark.9"
                    : "gray.3"
                }
                c={"white"}
                onClick={changeNextStep}
              >
                {active === 3 ? "DONE" : <IconChevronDown />}
              </Button>
            )}
          </Box>
        </Flex>
      </Center>
    </Box>
  );
}
