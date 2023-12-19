import {
  ActionIcon,
  Autocomplete,
  Center,
  Flex,
  Group,
  HoverCard,
  Indicator,
  NumberInput,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useElementSize } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "../styles/firstPanel.module.css";
import MultiSelect from "./multiSelect";

export default function FirstPanel(props) {
  const {
    placeData,
    placeExists,
    clearAutoComplete,
    startLocaleRef,
    startLocale,
    setStartLocale,
    setStartCity,
    setStartRegion,
    startLocaleSearch,
    setStartLocaleSearch,
    startLocaleData,
    setStartLocaleData,
    travelDates,
    setTravelDates,
    travelers,
    setTravelers,
    roundTrip,
    setRoundTrip,
  } = props;
  const { ref, width, height } = useElementSize();
  const today = new Date();
  const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

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

  const handleSubmit = (e) => {
    const index = e.indexOf(",");
    const subCity = e.substring(0, index);
    const subRegion = e.substring(index + 2, e.length);

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

  return (
    <Flex pb={30} px={30} maw={950} direction={"column"}>
      <Title order={5} fw={400} h={20} mb={20}>
        {startLocale && travelDates ? (
          "Continue..."
        ) : (
          <Text fw={700} opacity={0.8}>
            Provide the{" "}
            <Text inherit span hidden={startLocale}>
              Departure City{" "}
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
      <Flex w={"100%"} justify={"flex-start"} align={"flex-start"} gap={30}>
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
              root: classes.autoCompRoot,
              label: classes.labelSize,
              input: classes.startLocaleInput,
              option: classes.startLocaleOption,
            }}
            label="Departure City"
            placeholder="Add Departure City..."
            selectFirstOptionOnChange
            ref={startLocaleRef}
            limit={5}
            pt={20}
            px={10}
            size="xl"
            w={"100%"}
            value={startLocale || startLocaleSearch}
            data={startLocaleData}
            filter={optionsFilter}
            rightSection={
              startLocale && (
                <ActionIcon
                  size={"sm"}
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
          <Group justify="space-between" px={10} pt={15} pb={50}>
            <Group>
              <Text className={classes.labelSize}>Travelers: </Text>
              {/* Traveler Count  */}
              <NumberInput
                classNames={{
                  input: classes.travelersInput,
                  controls: classes.travelersControls,
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
                label: classes.labelSize,
                track: classes.switchTrack,
                thumb: classes.switchThumb,
              }}
              label="Round Trip?"
              labelPosition="left"
              onLabel="YES"
              offLabel="NO"
              size="xl"
              checked={roundTrip}
              onChange={() => {
                setRoundTrip(!roundTrip);
              }}
            />
          </Group>
        </Flex>
        <Center className="pagePanel" p={"xl"} w="100%" miw={365} ref={ref}>
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
                  arrowSize={12}
                  disabled={!isSpecificDay}
                  transitionProps={{ duration: 0 }}
                  styles={{
                    dropdown: {
                      marginLeft: 12,
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
  );
}
