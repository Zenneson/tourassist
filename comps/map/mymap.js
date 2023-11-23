"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import centerOfMass from "@turf/center-of-mass";
import { useSessionStorage } from "@mantine/hooks";
import {
  useComputedColorScheme,
  Center,
  Box,
  Button,
  Text,
  Group,
  Modal,
  LoadingOverlay,
  InputBase,
  Combobox,
  useCombobox,
  Tooltip,
  Transition,
} from "@mantine/core";
import {
  IconList,
  IconWorldSearch,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { addEllipsis } from "../../libs/custom";
import { getNewCenter } from "../../public/data/getNewCenter";
import MapComp from "./mapComp";
import LocationDrawer from "./locationDrawer";
import classes from "./mymap.module.css";

const fadeOut = { opacity: 0 };
const fadeIn = { opacity: 1 };

export default function Mymap(props) {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const {
    listOpened,
    setListOpened,
    searchOpened,
    dropDownOpened,
    mapLoaded,
    setMapLoaded,
    mainMenuOpened,
    setMainMenuOpened,
    panelShow,
    setPanelShow,
    country_center,
  } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const router = useRouter();

  const mapRef = useRef();
  const fullMapRef = mapRef.current?.getMap();
  const [area, setArea] = useState({ label: "" });
  const [locationDrawer, setLocationDrawer] = useState(false);
  const [lngLat, setLngLat] = useState([0, 0]);
  const [showStates, setShowStates] = useState(false);
  const [showMainMarker, setShowMainMarker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeSearchData, setPlaceSearchData] = useState([]);
  const [countrySearchData, setCountrySearchData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [topCities, setTopCities] = useState([]);
  const [listStates, setListStates] = useState([]);
  const [placeLocation, setPlaceLocation] = useState({});
  const [places, setPlaces] = useSessionStorage({
    key: "places",
    defaultValue: [],
  });

  useEffect(() => {
    router.prefetch("/tripPlanner");
    area.label === "United States" && setShowStates(true);
    (area.type === "city" ||
      (area.type === "region" && area.country !== "United States")) &&
      setShowMainMarker(true);
  }, [area, router]);

  const animateLayerOpacity = (
    map,
    layerId,
    layerType,
    startOpacity,
    endOpacity,
    duration
  ) => {
    const startTime = performance.now();
    const opacityProperty =
      layerType === "line" ? "line-opacity" : "fill-opacity";
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = elapsed / duration;
      const opacity = Math.max(
        0,
        Math.min(1, progress * (endOpacity - startOpacity) + startOpacity)
      );
      map.setPaintProperty(layerId, opacityProperty, opacity);
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const getFogProperties = (dark) => {
    return {
      color: dark ? "#0f2e57" : "#fff",
      "high-color": dark ? "#000" : "#245cdf",
      "space-color": dark
        ? ["interpolate", ["linear"], ["zoom"], 4, "#010b19", 7, "#367ab9"]
        : ["interpolate", ["linear"], ["zoom"], 4, "#fff", 7, "#fff"],
    };
  };

  useEffect(() => {
    if (fullMapRef && mapLoaded) {
      const fogProperties = getFogProperties(dark);
      fullMapRef.setFog(fogProperties);

      // Animate Fill layer
      animateLayerOpacity(
        fullMapRef,
        "country-boundaries-fill",
        "fill",
        0,
        1,
        500
      );
      animateLayerOpacity(fullMapRef, "states", "fill", 0, 1, 250);
      animateLayerOpacity(fullMapRef, "clicked-state", "fill", 0, 1, 250);

      // Animate Line layer
      animateLayerOpacity(
        fullMapRef,
        "country-boundaries-lines",
        "line",
        0,
        1,
        500
      );
      animateLayerOpacity(fullMapRef, "states-boundaries", "line", 0, 1, 250);
      animateLayerOpacity(fullMapRef, "state-borders", "line", 0, 1, 250);
    }
  }, [fullMapRef, mapLoaded, dark]);

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

  const getCords = (feature) => {
    let center = feature.center;
    if (feature && feature.geometry && feature.geometry.type) {
      center = centerOfMass(feature);
    }
    return center?.geometry.coordinates;
  };

  const selectTopCity = (city) => {
    setTopCities([]);
    const cityData = {
      label: city[0],
      type: "city",
      country: area.country,
      center: city[1],
      region: city[2],
    };
    setLngLat(city[1]);
    goToLocation(cityData);
  };

  const locationHandler = (feature, mapRef) => {
    setTopCities([]);
    if (feature == null) return;
    let locationObj = {};
    locationObj.type =
      feature.group ||
      (feature.source === "country-boundaries" ? "country" : "region") ||
      "city";
    locationObj.type = locationObj.type.toLowerCase();
    locationObj.label =
      feature.label ||
      feature.properties?.name_en ||
      feature.properties?.name ||
      feature.properties?.NAME ||
      "";
    locationObj.country =
      feature.country ||
      (feature.properties?.NAME && "United States") ||
      feature.properties?.name_en ||
      "";
    locationObj.state = feature.region || feature.properties?.NAME || "";
    locationObj.center = feature.center || getCords(feature);
    locationObj.shortcode =
      feature.shortcode ||
      feature.isoName ||
      feature.properties?.iso_3166_1 ||
      "";
    locationObj.shortcode = locationObj.shortcode.toLowerCase();
    if (locationObj.label === "Czech Republic") locationObj.label = "Czechia";
    if (locationObj.label === "Aland Islands")
      locationObj.label = "Åland Islands";
    if (locationObj.label === "East Timor") locationObj.label = "Timor-Leste";
    if (locationObj.label === "Myanmar") locationObj.label = "Myanmar (Burma)";
    if (locationObj.label === "Réunion") locationObj.label = "Reunion";
    if (locationObj.label === "Saint Barthélemy")
      locationObj.label = "Saint-Barthélemy";

    setCountrySearch("");
    setPlaceSearch("");
    setCountrySearchData([]);
    setPlaceSearchData([]);
    setLocationDrawer(true);
    setLngLat(locationObj.center);

    goToLocation(locationObj, mapRef);
  };

  const calcView = (place) => {
    const { country, type, label } = place;
    let zoom = getNewCenter(place).maxZoom;
    let pitch = 40;
    setArea(place);

    if ((country === "United States" && type === "region") || type !== "city") {
      fetchCities(place);
    }
    if (country === "United States" && type === "country") {
      usStates(place);
      pitch = 25;
    }
    if (type === "city" || (country !== "United States" && type === "region")) {
      zoom = 12;
      pitch = 75;
      if (label === "District of Columbia") {
        zoom = 10;
      }
    }
    return { zoom, pitch };
  };

  const goToLocation = (place) => {
    const { zoom, pitch } = calcView(place);
    const coords =
      place.type === "country" ? getNewCenter(place).newCenter : place.center;

    setShowStates(false);
    setShowMainMarker(false);

    let newCoords = coords;
    if (newCoords && Array.isArray(newCoords)) {
      newCoords = { lng: newCoords[0], lat: newCoords[1] };
    } else if (newCoords && newCoords.lon) {
      newCoords = { lng: newCoords.lon, lat: newCoords.lat };
    }

    place.type === "country" &&
      mapRef.current.flyTo({
        center: newCoords,
        zoom: 3,
        duration: 800,
        pitch: 0,
      });

    const moveTime = place.type === "country" ? 400 : 200;
    const moveDuration = place.type === "country" ? 1500 : 2200;

    setTimeout(() => {
      mapRef.current.flyTo({
        center: coords,
        duration: moveDuration,
        zoom: zoom,
        pitch: pitch,
        essential: true,
      });
    }, moveTime);
  };

  const placeType = (place) => {
    if (place === "country" || place.type === "country") return "Country";
    if (place === "region" || place.type === "region") return "Region";
    if (place === "place" || place.type === "place") return "City";
  };

  const handleChange = useCallback(
    async (field) => {
      let shortCode = area.shortcode;
      if (field === "place" && area.country === "United States")
        shortCode = "us";

      let endpoint;
      if (field === "country") {
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&autocomplete=true&fuzzyMatch=true&limit=5&types=country%2Cregion%2Cplace&language=en&access_token=${mapboxAccessToken}`;
      } else {
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearch}.json?country=${shortCode}&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion&limit=5&language=en&access_token=${mapboxAccessToken}`;
      }

      try {
        const response = await fetch(endpoint);
        const results = await response.json();
        const data = results.features.map((feature) => ({
          label: feature.text,
          value: feature.id,
          id: feature.id,
          type: feature.place_type[0],
          group: placeType(feature.place_type[0]),
          country: feature.place_name.split(", ").pop(),
          region: feature.place_name.split(", ", 2)[1],
          center: feature.center,
          shortcode: feature.properties?.short_code,
        }));

        const searchData = data.map((item) => {
          if (item.value === "place.345549036") {
            return {
              ...item,
              label: "Washington D.C.",
            };
          }
          return item;
        });

        if (field === "country") setCountrySearchData(searchData);
        if (field === "place") setPlaceSearchData(searchData);
      } catch (error) {
        console.error("Error fetching data for Country Autocomplete: ", error);
      }
    },
    [area, countrySearch, placeSearch, mapboxAccessToken]
  );

  const fetchCities = async (location) => {
    try {
      const path =
        location.country === "United States"
          ? "/data/uscitiesdata.json"
          : "/data/worldcitiesdata.json";
      const res = await fetch(path);
      const data = await res.json();

      if (!data) {
        return {
          notFound: true,
        };
      }

      const filterKey =
        location.country === "United States" && location.type === "region"
          ? "state"
          : "country";
      const dataArray = data.filter((region) => {
        if (!region[filterKey]) return;
        const filterKeyLower = region[filterKey].toLowerCase();
        const labelLower = location.label.toLowerCase();
        return filterKeyLower === labelLower;
      });
      const regionCities = dataArray[0]?.cities;
      let topFive = [];
      regionCities &&
        regionCities.map((city) => {
          topFive.push([city.name, city.center, location.label]);
        });
      setTopCities(topFive);
    } catch (error) {
      console.error("Error:", error);
      return {
        notFound: true,
      };
    }
  };

  const usStates = async () => {
    try {
      const res = await fetch("/data/uscitiesdata.json");
      const data = await res.json();

      if (!data) {
        return {
          notFound: true,
        };
      }

      let states = [];
      data.map((state) => {
        states.push({
          value: state.state,
          label: state.state,
          center: state.center,
          country: "United States",
        });
      });
      setListStates(states);
    } catch (error) {
      console.error("Error:", error);
      return {
        notFound: true,
      };
    }
  };

  const openTourList = () => {
    setListOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const placeChoosen = () => {
    setShowModal(false);
  };

  const [buttonAnimation, setButtonAnimation] = useState(fadeIn);
  const [buttonPosition, setButtonPosition] = useState(0);

  useEffect(() => {
    setButtonAnimation(fadeOut);

    const timeout = setTimeout(() => {
      setButtonPosition(
        panelShow && mainMenuOpened ? 920 : mainMenuOpened ? 310 : 0
      );
      setButtonAnimation(fadeIn);
    }, 10);

    return () => clearTimeout(timeout);
  }, [panelShow, mainMenuOpened]);

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

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded}
        loaderProps={{ color: dark ? "#0d3f82" : "#2dc7f3", type: "bars" }}
        overlayProps={{
          backgroundOpacity: 1,
          color: dark ? "#0b0c0d" : "#f8f9fa",
        }}
      />
      <Modal
        classNames={{
          root: classes.destinationModal,
          content: classes.destinationModalContent,
          overlay: classes.destinationModalOverlay,
        }}
        size={"auto"}
        zIndex={130}
        opened={showModal}
        onClose={setShowModal}
        withCloseButton={false}
        padding={"md"}
        centered
      >
        <Text fz={14} ta={"center"} mb={10}>
          {places && places.length > 0 ? "Clear the Tour List and c" : "C"}
          ontinue with{" "}
          <Text fw={700} span>
            {area.label}
          </Text>{" "}
          as your destination?
        </Text>
        <Group grow gap={10}>
          <Button
            className={classes.clearListButton}
            size="lg"
            color="green.9"
            variant="light"
            leftSection={<IconCheck stroke={4} />}
            onClick={() => {
              placeChoosen();
              setPlaces(placeLocation);
              router.push("/tripPlanner");
            }}
          >
            YES
          </Button>
          <Button
            className={classes.clearListButton}
            size="lg"
            color="red.9"
            variant="light"
            leftSection={<IconCheck stroke={4} />}
            onClick={() => setShowModal(false)}
          >
            NO
          </Button>
        </Group>
      </Modal>
      <LocationDrawer
        dark={dark}
        area={area}
        locationDrawer={locationDrawer}
        setLocationDrawer={setLocationDrawer}
        mapLoaded={mapLoaded}
        topCities={topCities}
        setTopCities={setTopCities}
        placeSearchData={placeSearchData}
        placeSearch={placeSearch}
        setPlaceSearch={setPlaceSearch}
        handleChange={handleChange}
        locationHandler={locationHandler}
        listStates={listStates}
        goToLocation={goToLocation}
        selectTopCity={selectTopCity}
        choosePlace={choosePlace}
        resetGlobe={resetGlobe}
      />
      {places && places.length >= 1 && !listOpened && (
        <motion.div
          initial={fadeIn}
          animate={buttonAnimation}
          transition={{ duration: 0.01 }}
        >
          {/* Tour List Button */}
          <Tooltip
            classNames={{ tooltip: "toolTip" }}
            position="bottom"
            label={"Tour List"}
            openDelay={500}
          >
            <Button
              className={classes.tourListButton}
              onClick={openTourList}
              style={{
                left: buttonPosition,
                color: dark ? "#fff" : "#000",
              }}
            >
              <IconList
                size={15}
                style={{
                  color: dark ? "#fff" : "#000",
                }}
              />
            </Button>
          </Tooltip>
        </motion.div>
      )}
      <Transition
        mounted={!searchOpened && !dropDownOpened && !locationDrawer}
        transition="slide-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Center
            className={classes.countryAutoCompleteZIndex}
            pos={"absolute"}
            top={"30px"}
            w={"100%"}
            style={styles}
          >
            {/* Main Place Search */}
            <Box pos={"relative"}>
              <CustomAutoComplete
                version={"country"}
                mapRef={mapRef}
                dark={dark}
                countrySearchData={countrySearchData}
                countrySearch={countrySearch}
                setCountrySearch={setCountrySearch}
                handleChange={handleChange}
                locationHandler={locationHandler}
              />
            </Box>
          </Center>
        )}
      </Transition>
      <MapComp
        mapRef={mapRef}
        setMapLoaded={setMapLoaded}
        area={area}
        places={places}
        setPlaces={setPlaces}
        listOpened={listOpened}
        setListOpened={setListOpened}
        topCities={topCities}
        setTopCities={setTopCities}
        searchOpened={searchOpened}
        country_center={country_center}
        lngLat={lngLat}
        setLngLat={setLngLat}
        setLocationDrawer={setLocationDrawer}
        goToLocation={goToLocation}
        showMainMarker={showMainMarker}
        showStates={showStates}
        getFogProperties={getFogProperties}
        locationHandler={locationHandler}
        mapboxAccessToken={mapboxAccessToken}
        choosePlace={choosePlace}
        selectTopCity={selectTopCity}
      />
    </>
  );
}

const AutoCompItem = React.forwardRef(function AutoCompItem(props, ref) {
  const {
    mapRef,
    label,
    region,
    country,
    group,
    center,
    border,
    locationHandler,
    ...rest
  } = props;
  const data = {
    label,
    region,
    country,
    group,
    center,
    border,
  };

  return (
    <Box ref={ref} {...rest}>
      <Box p={5} onClick={() => locationHandler(data, mapRef)}>
        <Text order={6} lineClamp={1} truncate="end">
          {label}
        </Text>
        <Text fz={12} lineClamp={1} truncate="end">
          {group === "City" ? `${region}, ${country}` : country}
        </Text>
      </Box>
    </Box>
  );
});

export const CustomAutoComplete = ({
  mapRef,
  version,
  area,
  countrySearchData,
  placeSearchData,
  countrySearch,
  setCountrySearch,
  placeSearch,
  setPlaceSearch,
  locationHandler,
  handleChange,
}) => {
  const prefaceThe = [
    "Bahamas",
    "Cayman Islands",
    "Falkland Islands",
    "Netherlands",
    "Philippines",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "US Virgin Islands",
    "Maldives",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Dominican Republic",
    "Central African Republic",
  ];

  const autoRef = useRef();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    },
  });

  const data = version === "country" ? countrySearchData : placeSearchData;
  let options;
  if (Array.isArray(data)) {
    options = data.map((item) => (
      <Combobox.Option value={item.label} key={item.id}>
        <AutoCompItem
          mapRef={mapRef}
          locationHandler={locationHandler}
          {...item}
        />
      </Combobox.Option>
    ));
  }

  useEffect(() => {
    combobox.selectFirstOption();
    const isInputFocused = autoRef.current === document.activeElement;
    if (!isInputFocused) combobox.closeDropdown();
    if (
      countrySearch &&
      countrySearch.length === 0 &&
      placeSearch &&
      placeSearch.length === 0
    ) {
      combobox.closeDropdown();
    } else if (isInputFocused) {
      if (
        (countrySearch && countrySearch.length > 2) ||
        (placeSearch && placeSearch.length > 2 && options.length > 0)
      ) {
        combobox.openDropdown();
      }
    } else if (options.length === 0) {
      combobox.closeDropdown();
    }
  }, [options, combobox, countrySearch, placeSearch]);

  return (
    <Combobox
      classNames={{
        dropdown:
          version === "country"
            ? classes.countryAutoCompleteDropdown
            : classes.placeAutoCompleteDropdown,
        option:
          version === "country"
            ? classes.countryAutoCompleteOption
            : classes.placeAutoCompleteOption,
      }}
      transitionProps={{
        transition: "fade",
        duration: 100,
        timingFunction: "ease",
      }}
      store={combobox}
      offset={3}
      onOptionSubmit={(value, optionProps) => {
        if (version === "country") {
          handleChange("country");
          setCountrySearch(value);
        } else {
          handleChange("place");
          setPlaceSearch(value);
        }
        locationHandler(optionProps.children.props, mapRef);
      }}
    >
      <Combobox.Target>
        <InputBase
          ref={autoRef}
          classNames={{
            root:
              version === "country"
                ? classes.countryAutoComplete
                : classes.placeAutoComplete,
            input:
              version === "country"
                ? classes.countryAutoCompleteInput
                : classes.placeAutoCompleteInput,
          }}
          size={version === "country" ? "lg" : "sm"}
          w={version === "country" ? 350 : "auto"}
          radius={version === "country" ? "xl" : "3px 3px 0 0"}
          pointer
          leftSection={<IconWorldSearch size={20} />}
          leftSectionWidth={35}
          rightSectionPointerEvents="none"
          value={version === "country" ? countrySearch : placeSearch}
          onBlur={() => combobox.closeDropdown()}
          onChange={(e) => {
            const search = e.target.value;
            if (version === "country") {
              handleChange("country");
              setCountrySearch(search);
            } else {
              handleChange("place");
              setPlaceSearch(search);
            }
            combobox.updateSelectedOptionIndex();
          }}
          placeholder={
            version === "country"
              ? "Where would you like to go?"
              : addEllipsis(
                  `Search in${prefaceThe.includes(area.label) ? " The" : ""} ${
                    area.country === "United States" ? area.country : area.label
                  }?`,
                  40
                )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
