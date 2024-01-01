import { addEllipsis, isEqual } from "@libs/custom";
import { useMapState } from "@libs/store";
import {
  Box,
  Button,
  Drawer,
  Group,
  NavLink,
  Select,
  Text,
} from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import {
  IconArrowBadgeRightFilled,
  IconCaretDownFilled,
  IconChevronRight,
  IconMapPinFilled,
  IconMapPinSearch,
  IconPlane,
  IconTextPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "../styles/locationDrawer.module.css";
import CustomAutoComplete from "./customAutoComplete";

export default function LocationDrawer(props) {
  const {
    dark,
    locationDrawer,
    setLocationDrawer,
    mapRef,
    mapLoaded,
    topCities,
    placeSearchData,
    placeSearch,
    setPlaceSearch,
    locationHandler,
    listStates,
    goToLocation,
    selectTopCity,
    choosePlace,
    resetGlobe,
    handleChange,
    setIsRotating,
  } = props;

  const { area } = useMapState();
  const topCitiesList = topCities.map((city, index) => (
    <Group
      key={index}
      style={{
        overflow: "hidden",
      }}
    >
      <NavLink
        classNames={{
          root: classes.topCitiesLink,
        }}
        label={city[0]}
        c={dark ? "white" : "dark"}
        onClick={() => selectTopCity(city)}
        leftSection={<IconMapPinFilled size={15} opacity={0.2} />}
      />
    </Group>
  ));

  const usaArea = {
    type: "country",
    label: "United States",
    country: "United States",
    state: "",
    center: [-134.60444672669328, 43.26345898357005],
    shortcode: "us",
  };

  const searchForState = (e) => {
    for (let item of listStates) {
      if (item.value === e) {
        return item.center;
      }
    }
    return null;
  };

  const renderRegion = (area) => {
    let text;
    switch (true) {
      case area.country === area.region:
      case area.country === area.state:
      case area.country === "United States" && area.type === "region":
        text = area.country;
        break;
      default:
        text = `${area.region} | ${area.country}`;
        break;
    }
    return (
      <Text fw={100} fz={12} pl={22} c={dark ? "white" : "dark"}>
        {text}
      </Text>
    );
  };

  const [prevArea, setPrevArea] = useState({ label: "" });
  const oldArea = usePrevious(area);
  useEffect(() => {
    if (isEqual(prevArea, oldArea)) return;
    setPrevArea(oldArea);
  }, [oldArea]);

  const closeLocationDrawer = () => {
    setIsRotating(false);
    if (prevArea.label === "" || prevArea.type === "city") {
      resetGlobe();
      return;
    }
    if (area.type === "region" && area.country === "United States") {
      goToLocation(usaArea, mapRef);
      return;
    }
    if (area.type === "city" && area.country === "United States") {
      goToLocation(prevArea, mapRef);
      return;
    }
    const shouldResetGlobe =
      area.type === "country" ||
      area.label === "" ||
      area.country !== prevArea.country ||
      area.country !== oldArea.country;
    if (shouldResetGlobe) {
      resetGlobe();
      return;
    }
    goToLocation(prevArea, mapRef);
  };

  return (
    <Drawer
      classNames={{ content: classes.locationDrawer }}
      zIndex={2}
      pos={"relative"}
      withinPortal={false}
      size={390}
      position="right"
      opened={locationDrawer}
      withOverlay={false}
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      onClose={() => setLocationDrawer(false)}
    >
      <Box pt={60}>
        <Group gap={2} ml={-5}>
          <IconArrowBadgeRightFilled
            size={25}
            style={{ color: dark ? "#004585" : "#00e8fc" }}
          />
          <Text
            className={classes.placeTitle}
            c={dark ? "white" : "dark"}
            fw={900}
          >
            {addEllipsis(area.label, 44)}
          </Text>
        </Group>
        {area && area.type !== "country" && (
          <Group gap={5}>{renderRegion(area)}</Group>
        )}
        <Box
          className={classes.placeBtns}
          pos={"relative"}
          w={"100%"}
          mt={10}
          style={{
            pointerEvents: "all",
            boxShadow: "var(--mantine-shadow-md)",
            borderRadius: "3px 3px 0 0",
          }}
        >
          {mapLoaded &&
            area.type !== "city" &&
            !(area.type === "region" && area.country !== "United States") && (
              <CustomAutoComplete
                version={"place"}
                area={area}
                dark={dark}
                handleChange={handleChange}
                locationHandler={locationHandler}
                placeSearchData={placeSearchData}
                placeSearch={placeSearch}
                setPlaceSearch={setPlaceSearch}
              />
            )}
          {area.country === "United States" && area.type === "country" ? (
            <Select
              classNames={{
                option: classes.selectOption,
                input: classes.select,
              }}
              data={listStates}
              leftSection={<IconMapPinSearch size={17} />}
              leftSectionWidth={40}
              rightSection={<IconCaretDownFilled size={17} />}
              rightSectionWidth={40}
              placeholder="Search for a state..."
              searchable
              onChange={(e) => {
                let location = {
                  label: e,
                  group: "region",
                  type: "region",
                  state: e,
                  region: e,
                  center: searchForState(e),
                  country: "United States",
                };
                locationHandler(location, mapRef);
              }}
            />
          ) : (
            <Box
              hidden={area.type === "city"}
              style={{
                borderRadius: "0 0 3px 3px",
                overflow: "hidden",
              }}
            >
              {topCitiesList}
            </Box>
          )}
        </Box>
        <Button.Group
          className={classes.chooseLocationBox}
          orientation="vertical"
          mt={10}
        >
          <Button
            className={classes.locationBtns}
            justify={"left"}
            variant="filled"
            leftSection={<IconPlane size={18} />}
            onClick={() => choosePlace("travel")}
          >
            Travel to {area.label}
          </Button>
          <Button
            className={classes.locationBtns}
            justify={"left"}
            fw={400}
            variant="filled"
            leftSection={<IconTextPlus size={18} />}
            onClick={() => choosePlace("tour")}
          >
            Add to
            <Text span ml={5} fz={14} fw={700}>
              TOUR LIST
            </Text>
          </Button>
        </Button.Group>
        <Button
          className={classes.closeBtn}
          mt={10}
          size="xs"
          rightSection={<IconChevronRight stroke={4} size={18} />}
          onClick={closeLocationDrawer}
          justify={"center"}
          variant="transparent"
        >
          BACK
        </Button>
      </Box>
    </Drawer>
  );
}
