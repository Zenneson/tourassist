import { useState, useEffect } from "react";
import {
  IconCurrencyDollar,
  IconCirclePlus,
  IconRowInsertBottom,
  IconTrash,
  IconRefreshDot,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useSessionStorage } from "@mantine/hooks";
import {
  useComputedColorScheme,
  Title,
  Box,
  Text,
  NumberInput,
  Group,
  Divider,
  Button,
  Flex,
  Badge,
  ActionIcon,
  Popover,
  TextInput,
  Tooltip,
} from "@mantine/core";
import classes from "./useTickets.module.css";

export default function UseTickets(props) {
  const { roundTrip, placeData, setPlaceData, handleReset } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const [totalCost, setTotalCost] = useSessionStorage({
    key: "totalCost",
    defaultValue: 0,
  });

  const [savedFormValues, setSavedFormValues] = useSessionStorage({
    key: "formValues",
    defaultValue: placeData.map((place) => ({
      place: place.place,
      region: place.region,
      costs: {
        flight: 0,
        hotel: 0,
      },
    })),
  });

  const form = useForm({
    initialValues: {
      places: savedFormValues,
    },
  });

  useEffect(() => {
    const allValuesAreZero = form.values.places.every((place) =>
      Object.values(place.costs).every((cost) => cost === 0)
    );

    if (!allValuesAreZero) {
      setSavedFormValues(form.values.places);
      setPlaceData(form.values.places);
    }
  }, [form.values.places, setSavedFormValues, setPlaceData]);

  const handleCostChange = (placeIndex, costKey, value) => {
    value = Number(value) || 0;
    form.setFieldValue(`places.${placeIndex}.costs.${costKey}`, value);
  };

  const removeCost = (placeIndex, costKey) => {
    const updatedCosts = { ...form.values.places[placeIndex].costs };
    delete updatedCosts[costKey];
    form.setFieldValue(`places.${placeIndex}.costs`, updatedCosts);
  };

  const calcTotalCost = () => {
    const total = form.values.places.reduce((total, place) => {
      const placeCost = Object.values(place.costs || {}).reduce(
        (costTotal, costValue) => costTotal + Number(costValue || 0),
        0
      );
      return total + placeCost;
    }, 0);

    setTotalCost(total);
  };

  let tabIndexCounter = 1;
  const [newCostName, setNewCostName] = useState(
    Array(placeData.length).fill("")
  );
  const [popoverOpened, setPopoverOpened] = useState(
    Array(placeData.length).fill(false)
  );

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      const update = addCost(index, newCostName[index]);
      setPlaceData(update);
      setSavedFormValues(update);
      setPopoverOpened({ ...popoverOpened, [index]: false });
    }
  };

  const addCost = (placeIndex, costName) => {
    const newPlaces = [...placeData];
    let adjustedCostName = costName || "NEW COST";
    if (newPlaces[placeIndex]) {
      let count = 2;
      while (newPlaces[placeIndex].costs.hasOwnProperty(adjustedCostName)) {
        adjustedCostName = `${costName || "NEW COST"} #${count}`;
        count++;
      }
      newPlaces[placeIndex].costs = {
        ...newPlaces[placeIndex].costs,
        [adjustedCostName]: 0,
      };
      setNewCostName("");
      return newPlaces;
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      {placeData.map((place, index) => {
        return (
          <Box
            key={index}
            p={10}
            pb={20}
            mb={20}
            pos={"relative"}
            className="pagePanel"
          >
            <Group pt={10} pl={10} justify="space-between">
              <Box
                pl={10}
                style={{
                  borderLeft: "2px solid rgba(137, 137, 137, 0.4)",
                }}
              >
                <Title order={4}>{place.place}</Title>
                <Text fz={12}>{place.region}</Text>
              </Box>
              <Flex
                gap={10}
                mr={10}
                w={"100%"}
                maw={335}
                align={"center"}
                justify={"flex-end"}
              >
                <Divider
                  color={dark && "gray.9"}
                  size={"xs"}
                  w={roundTrip && placeData.length === 1 ? "60%" : "100%"}
                />
                {roundTrip && (
                  <Badge mr={5} variant="dot" size="xs">
                    Return flight
                  </Badge>
                )}
                {roundTrip && placeData.length === 1 && (
                  <Badge mr={5} variant="dot" size="xs">
                    Round Trip
                  </Badge>
                )}
              </Flex>
            </Group>
            {place.costs &&
              Object.keys(place.costs).map((cost, subIndex) => (
                <Group justify="flex-end" key={subIndex} gap={10} p={10}>
                  <Text
                    style={{
                      textTransform: "uppercase",
                      fontStyle: "italic",
                      fontSize: 12,
                    }}
                  >
                    {cost}
                  </Text>
                  <Divider
                    my="xs"
                    w={"50%"}
                    variant="dotted"
                    color={dark && "gray.9"}
                  />
                  <NumberInput
                    classNames={{ input: classes.costInput }}
                    id="cost"
                    tabIndex={tabIndexCounter++}
                    min={0}
                    w={130}
                    size="md"
                    onClick={(e) => {
                      if (
                        e.target.value === 0 ||
                        e.target.value === "0" ||
                        e.target.value === "0.00"
                      ) {
                        e.target.select();
                      }
                    }}
                    value={place.costs[cost] ?? 0}
                    onChange={(value) => {
                      handleCostChange(index, cost, value);
                      if (value === "") {
                        value = "0.00";
                      }
                    }}
                    onBlur={() => {
                      calcTotalCost();
                      handleCostChange(
                        index,
                        cost,
                        form.values.places[index].costs[cost] ?? 0,
                        true
                      );
                    }}
                    hideControls={true}
                    leftSection={<IconCurrencyDollar />}
                  />
                  <ActionIcon
                    className={classes.removeCostButton}
                    py={20}
                    variant={dark ? "default" : "light"}
                    onClick={() => removeCost(index, cost)}
                  >
                    <IconTrash
                      size={15}
                      color={dark ? "rgba(255, 0, 0, 0.4)" : "red"}
                    />
                  </ActionIcon>
                </Group>
              ))}
            {/* {place.returning && (
                  <Group justify="flex-end" gap={10} p={10}>
                    <Text
                      style={{
                        textTransform: "uppercase",
                        fontStyle: "italic",
                        fontSize: 12,
                      }}
                    >
                      FLIGHT
                    </Text>
                    <Divider
                      my="xs"
                      w={"50%"}
                      variant="dotted"
                      color={dark && "gray.9"}
                    />
                    <NumberInput
                      className={classes.costInput}
                      id="cost"
                      tabIndex={tabIndexCounter++}
                      min={0}
                      w={130}
                      size="md"
                      value={form.values.places[index].costs[cost] || 0}
                      onClick={(e) => {
                        if (e.target.value === 0 || e.target.value === "0") {
                          e.target.select();
                        }
                      }}
           						onChange={(value) => handleCostChange(index, cost, value)}
                      onBlur={() => handleCostChange(index, cost, form.values.places[index].costs[cost], true)}
											hideControls={true}
                      leftSection={<IconCurrencyDollar />}
                    />
                  </Group>
                )} */}
            {
              <Group justify="flex-end" gap={10} p={10}>
                <Divider
                  my="xs"
                  w={"65%"}
                  opacity={0.3}
                  color={dark && "gray.9"}
                />
                <Popover
                  trapFocus
                  position="left"
                  withArrow={true}
                  shadow="md"
                  opened={popoverOpened[index]}
                  styles={{
                    dropdown: {
                      padding: 3,
                    },
                  }}
                  onClose={() =>
                    setPopoverOpened({ ...popoverOpened, [index]: false })
                  }
                >
                  <Popover.Target>
                    <Button
                      className={classes.brightenButton}
                      size="xs"
                      variant="default"
                      opacity={0.2}
                      leftSection={<IconRowInsertBottom size={17} />}
                      onClick={() =>
                        setPopoverOpened({
                          ...popoverOpened,
                          [index]: true,
                        })
                      }
                    >
                      NEW COST
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <TextInput
                      size="xs"
                      placeholder="NEW COST"
                      value={newCostName[index] || ""}
                      onKeyDown={(e) => handleKeyPress(e, index)}
                      onChange={(e) =>
                        setNewCostName({
                          ...newCostName,
                          [index]: e.target.value,
                        })
                      }
                      rightSection={
                        <ActionIcon
                          variant="transparent"
                          c={dark ? "gray.0" : "dark.8"}
                          onClick={() => {
                            const update = addCost(index, newCostName[index]);
                            setPlaceData(update);
                            setSavedFormValues(update);
                            setPopoverOpened({
                              ...popoverOpened,
                              [index]: false,
                            });
                          }}
                        >
                          <IconCirclePlus size={15} />
                        </ActionIcon>
                      }
                    />
                  </Popover.Dropdown>
                </Popover>
              </Group>
            }
            {index === 0 && (
              <Group pos={"absolute"} gap={10} top={0} left={-50} mt={10}>
                <Tooltip
                  classNames={{ tooltip: "toolTip" }}
                  label="Reset fields"
                >
                  <ActionIcon
                    className={classes.brightenButton}
                    variant="transparent"
                    size="xl"
                    color={dark ? "gray.3" : "gray.7"}
                    onClick={handleReset}
                  >
                    <IconRefreshDot size={40} stroke={1} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Box>
        );
      })}
    </form>
  );
}
