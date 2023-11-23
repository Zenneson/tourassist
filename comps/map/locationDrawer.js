import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Group,
  Drawer,
  Select,
  NavLink,
} from "@mantine/core";
import { CustomAutoComplete } from "./mymap";
import {
  IconArrowBadgeRightFilled,
  IconChevronRight,
  IconMapPinSearch,
  IconCaretDownFilled,
  IconPlane,
  IconTextPlus,
  IconAlertTriangle,
  IconMapPinFilled,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { addEllipsis } from "../../libs/custom";
import classes from "./locationDrawer.module.css";

export default function LocationDrawer(props) {
  const {
    places,
    dark,
    area,
    prevArea,
    locationDrawer,
    setLocationDrawer,
    setMainMenuOpened,
    setListOpened,
    mapLoaded,
    topCities,
    setTopCities,
    placeSearchData,
    setPlaceSearchData,
    placeSearch,
    setPlaceSearch,
    handleChange,
    locationHandler,
  } = props;

  const [placeLocation, setPlaceLocation] = useState({});

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

  const resetMap = () => {
    mapRef.current.flyTo({
      zoom: 2.5,
      duration: 1000,
      pitch: 0,
      essential: true,
    });
  };

  const clearData = () => {
    setArea({ label: "" });
    setLocationDrawer(false);
    setLngLat([0, 0]);
    setTopCities([]);
    setPlaceSearchData([]);
    setCountrySearchData([]);
    setPlaceSearch("");
    setCountrySearch("");
    setShowStates(false);
    setShowMainMarker(false);
  };

  const resetGlobe = () => {
    resetMap();
    setTimeout(clearData, 200);
  };

  const usaArea = {
    type: "country",
    label: "United States",
    country: "United States",
    state: "",
    center: [-134.60444672669328, 43.26345898357005],
    shortcode: "us",
  };

  const addPlaces = (place) => {
    let newPlace = JSON.parse(JSON.stringify(place));
    newPlace.order = places.length + 1;
    let newPlaces = [...places, newPlace];
    setPlaces(newPlaces);
  };

  const checkPlace = (place) => {
    let placeExists = false;
    places.forEach((p) => {
      if (p.place === place.place && p.region === place.region) {
        placeExists = true;
      }
    });
    return placeExists;
  };

  const searchForState = (e) => {
    for (let item of listStates) {
      if (item.value === e) {
        return item.center;
      }
    }
    return null;
  };

  const choosePlace = (choice) => {
    setMainMenuOpened(false);
    const place = {
      label: area.label,
      place: area.label,
      type: area.type,
      coordinates: area.center,
      country: area.country,
      region:
        area.type === "city" && area.country === "United States"
          ? `${area.state || area.region}, ${area.country}`
          : area.country === area.label
          ? ""
          : area.country,
    };

    setPlaceLocation([place]);
    if (choice === "tour") {
      setListOpened(true);
      if (checkPlace(place)) {
        notifications.show({
          color: "orange",
          icon: <IconAlertTriangle size={20} />,
          style: {
            backgroundColor: dark ? "#2e2e2e" : "#fff",
          },
          title: "Location already added",
          message: `${area.label} was already added to your tour`,
        });
        return;
      }
      addPlaces(place);
      resetGlobe();
    }
    if (choice === "travel") {
      setShowModal(true);
    }
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
        text = `${area.region || area.state} | ${area.country}`;
        break;
    }
    return (
      <Text fw={100} fz={12} pl={22} c={dark ? "white" : "dark"}>
        {text}
      </Text>
    );
  };

  const closeLocationDrawer = () => {
    if (prevArea.label === "") {
      resetGlobe();
      return;
    }
    if (area.type === "region" && area.country === "United States") {
      goToLocation(usaArea);
      return;
    }
    if (area.type === "city" && area.country === "United States") {
      goToLocation(prevArea);
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
    goToLocation(prevArea);
  };

  return (
    <Drawer
      classNames={{ content: classes.locationDrawer }}
      zIndex={1}
      pos={"relative"}
      withinPortal={false}
      size={390}
      position="right"
      opened={locationDrawer}
      withOverlay={false}
      withCloseButton={false}
      onClose={() => setLocationDrawer(false)}
    >
      <Box pt={80}>
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
            borderRadius: "0 0 3px 3px",
          }}
        >
          {mapLoaded &&
            area.type !== "city" &&
            !(area.type === "region" && area.country !== "United States") && (
              <CustomAutoComplete
                version={"place"}
                area={area}
                dark={dark}
                placeSearchData={placeSearchData}
                placeSearch={placeSearch}
                setPlaceSearch={setPlaceSearch}
                handleChange={handleChange}
                locationHandler={locationHandler}
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
                locationHandler(location);
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
            fs={"italic"}
            variant="filled"
            leftSection={<IconTextPlus size={18} />}
            onClick={() => choosePlace("tour")}
          >
            TOUR LIST
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
