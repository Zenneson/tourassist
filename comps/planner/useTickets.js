import { useState, useEffect } from "react";
import {
  IconCurrencyDollar,
  IconCirclePlus,
  IconRowInsertBottom,
  IconTrash,
  IconRefreshDot,
} from "@tabler/icons-react";
import { useDidUpdate } from "@mantine/hooks";
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
import { useFormContext } from "../../pages/tripPlanner";
import classes from "./useTickets.module.css";

export default function UseTickets(props) {
  const {
    roundTrip,
    placeData,
    setPlaceData,
    setSavedFormValues,
    disallowEmptyField,
  } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const form = useFormContext();

  useDidUpdate(() => {
    setSavedFormValues(form.values);
  }, [form.values, setSavedFormValues]);

  const handleCostChange = (placeIndex, costKey, value) => {
    value = Number(value) || 0;
    const places = form.values.places || [];
    const newPlaces = places.length > 0 ? [...places] : [...placeData];
    newPlaces[placeIndex].costs = {
      ...newPlaces[placeIndex].costs,
      [costKey]: value,
    };
    return {
      places: newPlaces,
    };
  };

  const handleReset = () => {
    form.setValues({ places: placeData });
    // setSavedFormValues([]);
  };

  const removeCost = (placeIndex, costKey) => {
    const places = form.values.places || [];
    const newPlaces = places.length > 0 ? [...places] : [...placeData];
    delete newPlaces[placeIndex].costs[costKey];
    return {
      places: newPlaces,
    };
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
      form.setValues(update);
      setSavedFormValues(update);
      setPopoverOpened({ ...popoverOpened, [index]: false });
    }
  };

  const addCost = (placeIndex, costName) => {
    const places = form.values.places || [];
    const newPlaces = places.length > 0 ? [...places] : [...placeData];
    let tempName = "";
    if (!costName) {
      tempName = "NEW COST";
    } else {
      tempName = costName.trim() === "" ? "NEW COST" : costName;
    }

    // Adds preface to make it the last item
    tempName = `ZZZZ_${tempName}`;
    if (newPlaces[placeIndex]) {
      let count = 2;
      while (newPlaces[placeIndex].costs.hasOwnProperty(tempName)) {
        tempName = `${tempName} #${count}`;
        count++;
      }
      newPlaces[placeIndex].costs = {
        ...newPlaces[placeIndex].costs,
        [tempName]: 0,
      };
      setNewCostName("");
      return {
        places: newPlaces,
      };
    }
  };

  const newCostLastIndex = (value) => {
    const index = value.indexOf("_");
    const trueCostName = value.substring(index + 1, value.length);
    return trueCostName;
  };

  return placeData.map((place, index) => {
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
          Object.keys(place.costs).map((costKey, subIndex) => (
            <Group justify="flex-end" key={subIndex} gap={10} p={10}>
              <Text
                style={{
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  fontSize: 12,
                }}
              >
                {newCostLastIndex(costKey)}
              </Text>
              <Divider
                my="xs"
                w={"50%"}
                variant="dotted"
                color={dark && "gray.9"}
              />
              <NumberInput
                {...form.getInputProps(`${place}_${costKey}`)}
                data-autofocus
                classNames={{ input: classes.costInput }}
                clampBehavior="strict"
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
                isAllowed={disallowEmptyField}
                value={form.values.places[index]?.costs[costKey] || 0}
                onChange={(value) => {
                  const update = handleCostChange(index, costKey, value);
                  form.setValues(update);
                }}
                onBlur={(e) => {
                  setSavedFormValues(form.values);
                }}
                hideControls={true}
                leftSection={<IconCurrencyDollar />}
              />
              <ActionIcon
                className={classes.removeCostButton}
                py={20}
                variant={dark ? "default" : "light"}
                onClick={() => {
                  const update = removeCost(index, costKey);
                  form.setValues(update);
                }}
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
            <Divider my="xs" w={"65%"} opacity={0.3} color={dark && "gray.9"} />
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
                        form.setValues(update);
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
              label="Reset Cost Calculator"
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
  });
}
