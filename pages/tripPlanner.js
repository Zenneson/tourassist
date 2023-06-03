import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
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
} from "@mantine/core";
import {
  useForceUpdate,
  useWindowEvent,
  useLocalStorage,
} from "@mantine/hooks";
import LoginComp from "../comps/loginComp";
import {
  IconCurrencyDollar,
  IconPlus,
  IconCirclePlus,
  IconChevronUp,
  IconChevronDown,
  IconBuildingBank,
  IconPlaneArrival,
  IconCheck,
  IconFlag,
  IconTrash,
  IconMapPin,
  IconCalendarEvent,
  IconChevronsRight,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { DatePicker } from "@mantine/dates";
import TripContent from "../comps/tripContent";

export default function TripPlannerPage() {
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });
  const [startLocaleSearch, setStartLocaleSearch] = useState("");
  const [startLocaleData, setStartLocaleData] = useState([]);
  const [startLocale, setStartLocale] = useState("");
  const [date, setDate] = useState(null);
  const [checked, setChecked] = useState(false);
  const forceUpdate = useForceUpdate();
  const startLocaleRef = useRef(null);
  const [newCost, setNewCost] = useState([]);
  const newCostRef = useRef(null);
  const router = useRouter();
  const [placeData, setPlaceData] = useLocalStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const dayjs = require("dayjs");
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  // TODO - Have create into a function that fetches the costs and adds them below
  const [fetchedCosts, setfetchedCosts] = useState([]);
  function createCosts() {
    let fetchedData = [{}];
    placeData.map((place) => {
      fetchedData[place.place + "_FLIGHT"] = 123;
      fetchedData[place.place + "_HOTEL"] = 234;
    });
    setfetchedCosts(fetchedData);
  }

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
            border: "1px dotted rgba(0,0,0,0.4)",
          }}
        ></div>
        <NumberInput
          costid={costid}
          onChange={(e) => {
            let data = fetchedCosts;
            data[costid] = e;
            setfetchedCosts(data);
            console.log(data);
          }}
          onClick={(e) => {
            e.target.select();
          }}
          defaultValue={fetchedCosts[costid] || 0}
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

  console.log(placeData);

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
          bg={"rgba(0,0,0,0.3)"}
          sx={{
            borderRadius: "3px",
            boxShadow: "0 7px 10px 0 rgba(0,0,0,0.1)",
            borderTop: "2px solid rgba(255,255,255,0.1)",
          }}
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
                          const costIndex = index;
                          let newPlaceData = [...placeData];
                          let copyData = JSON.parse(
                            JSON.stringify(newPlaceData)
                          );
                          copyData[placeIndex]?.costs.splice(costIndex, 1);
                          setPlaceData(copyData);
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
                      const costIndex = index;
                      let newPlaceData = [...newCost];
                      let copyData = JSON.parse(JSON.stringify(newPlaceData));
                      copyData[placeIndex] = copyData[placeIndex].filter(
                        (_, i) => i !== costIndex
                      );
                      setNewCost(copyData);
                    }}
                  >
                    <IconTrash size={17} pointerEvents="none" />
                  </ActionIcon>
                  <Costs costid={place.place + "_" + cost} cost={cost} />
                </Box>
              ))}
          </Box>
          <Divider opacity={0.2} color="#000" />
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
                      "&:focus": {
                        border: "none",
                      },
                    },
                  }}
                  rightSection={
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

  const handleChange = async (e) => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${startLocaleSearch}.json?&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion%2Ccountry&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;

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

  const handleSelect = (e) => {
    setStartLocale(e.value);
  };

  const index = startLocale?.indexOf(",");
  const startCity = startLocale?.substring(0, index);
  const startRegion = startLocale?.substring(index + 1);

  return (
    <>
      <Space h={110} />
      <Center>
        <Divider
          w={"100%"}
          maw={1200}
          mb={50}
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
          <Box w="100%" miw={500} px="xl">
            {active === 0 && (
              <motion.div {...animation}>
                <Box ml={"10%"} w={"80%"}>
                  <Title order={3} h={25} ml={5}>
                    {startLocale && date ? (
                      "Continue..."
                    ) : (
                      <Text opacity={0.4}>
                        Select{" "}
                        <Text inherit span hidden={date}>
                          Travel Start Date{startLocale && ":"}
                        </Text>{" "}
                        <Text inherit span hidden={startLocale || date}>
                          and
                        </Text>{" "}
                        <Text inherit span hidden={startLocale}>
                          {date && "Starting"} Location:
                        </Text>
                      </Text>
                    )}
                  </Title>
                  <Box h={100}>
                    <Box
                      py={10}
                      pl={5}
                      pb={15}
                      mt={15}
                      sx={{
                        borderRadius: "3px",
                        borderTop: "2px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Group spacing={5} w={"100%"} h={30}>
                        <IconMapPin size={18} opacity={0.4} />
                        {(startCity || startRegion) && (
                          <>
                            <Badge variant="outline" color="gray" size="xs">
                              {startCity ? startCity : startRegion}
                            </Badge>
                            →
                          </>
                        )}
                        {placeData.map((place, index) => (
                          <Group key={index} spacing={5}>
                            <Badge variant="outline" color="gray" size="xs">
                              {place.place}
                            </Badge>
                            {placeData.length - 1 !== index && "→"}
                          </Group>
                        ))}
                        {checked && (startCity || startRegion) && (
                          <>
                            →
                            <Badge variant="outline" color="gray" size="xs">
                              {startCity ? startCity : startRegion}
                            </Badge>
                          </>
                        )}
                      </Group>
                      {date && (
                        <Group spacing={5} w={"100%"} fz={12} mt={5}>
                          <IconCalendarEvent size={18} opacity={0.4} />
                          {date}
                        </Group>
                      )}
                    </Box>
                  </Box>
                  <Center>
                    <Flex direction={"column"} align={"center"} gap={10}>
                      <Box
                        py={15}
                        px={20}
                        ml={40}
                        bg={"rgba(0,0,0,0.3)"}
                        sx={{
                          borderRadius: "3px",
                          borderTop: "2px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 7px 10px 0 rgba(0,0,0,0.3)",
                        }}
                      >
                        <Divider
                          label={
                            <Flex align={"center"} gap={5}>
                              <Box pos={"relative"} top={2}>
                                <IconFlag size={16} />
                              </Box>
                              <Text fz={12} m={0}>
                                Fundraiser ends the day before the travel start
                                date!
                              </Text>
                            </Flex>
                          }
                          mb={10}
                          w={"100%"}
                        />
                        <DatePicker
                          value={date}
                          size={"xl"}
                          mx={20}
                          mb={20}
                          allowDeselect
                          firstDayOfWeek={0}
                          getDayProps={() => {
                            return {
                              style: {
                                fontWeight: "bold",
                              },
                            };
                          }}
                          sx={{
                            ".mantine-DatePicker-day[data-weekend]": {
                              color: "#74C0FC",
                            },
                            ".mantine-DatePicker-day[data-selected]": {
                              backgroundColor: "#74C0FC",
                              color: "#000",
                            },
                          }}
                          onChange={(e) => {
                            if (date === null) {
                              setDate(dayjs(e).format("LL"));
                            } else {
                              setDate(null);
                            }
                          }}
                        />
                        <Autocomplete
                          size="sm"
                          mt={10}
                          w={"100%"}
                          dropdownPosition="top"
                          variant="filled"
                          defaultValue=""
                          value={startLocaleSearch}
                          placeholder="Starting Location..."
                          onItemSubmit={(e) => handleSelect(e)}
                          ref={startLocaleRef}
                          data={startLocaleData}
                          filter={(value, item) => item}
                          onClick={function (event) {
                            event.preventDefault();
                            startLocaleRef.current.select();
                          }}
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
                        <Group pos={"relative"}>
                          <Divider
                            w={"100%"}
                            mt={15}
                            mb={5}
                            labelPosition="right"
                            label={
                              <Switch
                                label={<Text fz={12}>Round Trip?</Text>}
                                labelPosition="left"
                                onLabel="YES"
                                offLabel="NO"
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                              />
                            }
                          />
                        </Group>
                      </Box>
                    </Flex>
                  </Center>
                </Box>
              </motion.div>
            )}
            {active === 1 && (
              <motion.div {...animation}>
                <Places />
                {checked && placeData.length > 1 && (
                  <Box
                    p={20}
                    mb={20}
                    radius={3}
                    bg={"rgba(0,0,0,0.3)"}
                    sx={{
                      borderRadius: "3px",
                      boxShadow: "0 7px 10px 0 rgba(0,0,0,0.1)",

                      borderTop: "2px solid rgba(255,255,255,0.1)",
                    }}
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
                          {startCity ? startCity : startRegion}
                        </Title>
                        <Text size="xs" color="dimmed">
                          {startCity ? startRegion : ""}
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
                    <Costs cost={"Flight"} />
                  </Box>
                )}
              </motion.div>
            )}
            {active === 2 && (
              <motion.div {...animation}>
                <Stack
                  align="center"
                  py={25}
                  bg={"rgba(0,0,0,0.4)"}
                  sx={{
                    borderRadius: "3px",
                    boxShadow: "0 7px 10px 0 rgba(0,0,0,0.4)",

                    borderTop: "2px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Input
                    size={"xl"}
                    placeholder="Title..."
                    bg={"dark.7"}
                    variant="filled"
                    w="100%"
                    maw={800}
                    sx={{
                      ".mantine-Input-input": {
                        borderTop: "2px solid rgba(255,255,255,0.2)",
                        background: "#0b0c0d",
                        "&::placeholder": {
                          fontWeight: 700,
                          fontStyle: "italic",
                          color: "rgba(255,255,255,0.0.08)",
                        },
                      },
                    }}
                  />
                  <TripContent />
                </Stack>
              </motion.div>
            )}
            {active === 3 && (
              <motion.div {...animation}>
                <Center w={"100%"} h={"50vh"}>
                  <Stack w={"70%"}>
                    <Box hidden={user}>
                      <Box px={30}>
                        <LoginComp />
                      </Box>
                    </Box>
                    <Center>
                      <Button
                        leftIcon={<IconBuildingBank size={34} />}
                        variant="gradient"
                        gradient={{
                          from: "green.8",
                          to: "green.9",
                          deg: 180,
                        }}
                        color="gray.0"
                        size="xl"
                        w={"90%"}
                        sx={{
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        <Title order={3}>ADD BANKING INFORMATION</Title>
                      </Button>
                    </Center>
                    <Divider my={3} opacity={0.7} />
                    <Group spacing={0}>
                      <Text fz={12} w={"70%"} pl={20} pr={10}>
                        We use Stripe, a trusted payment processor, to securely
                        handle transactions and disburse funds, ensuring the
                        protection of your sensitive banking information.
                      </Text>
                      <Image
                        src="img/stripe.png"
                        fit="contain"
                        display={"block"}
                        opacity={0.3}
                        style={{
                          width: "30%",
                          borderLeft: "2px solid rgba(255,255,255,0.3)",
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
                  mt={-20}
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
                  mb={20}
                  w={225}
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
                    },
                  }}
                />
              </>
            )}
            {active !== 0 && (
              <Button
                fullWidth
                variant="default"
                mb={10}
                onClick={() => {
                  prevStep();
                }}
              >
                <IconChevronUp />
              </Button>
            )}
            {startLocale && date && (
              <Button
                fullWidth
                variant={active === 3 ? "light" : "default"}
                bg={active === 3 ? "blue" : "primary"}
                onClick={() => {
                  if (active !== 3) {
                    nextStep();
                  }
                  if (active === 0 && fetchedCosts.length === 0) {
                    createCosts();
                  }
                  if (active === 3) {
                    // localStorage.removeItem("placeDataState");
                    router.push("/trippage");
                  }
                }}
              >
                {active === 3 ? "DONE" : <IconChevronDown />}
              </Button>
            )}
          </Box>
        </Flex>
      </Center>
    </>
  );
}
