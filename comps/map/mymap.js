"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import centerOfMass from "@turf/center-of-mass";
import { useSessionStorage } from "@mantine/hooks";
import {
  useComputedColorScheme,
  Center,
  Box,
  Button,
  InputBase,
  Text,
  Group,
  NavLink,
  Drawer,
  Transition,
  Select,
  Modal,
  LoadingOverlay,
  Combobox,
  useCombobox,
  Stack,
  Tooltip,
} from "@mantine/core";
import {
  IconList,
  IconX,
  IconMapPinFilled,
  IconArrowBadgeRightFilled,
  IconArrowBarRight,
  IconWorldSearch,
  IconMapPinSearch,
  IconCaretDownFilled,
  IconPlane,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getNewCenter } from "../../public/data/getNewCenter";
import { addEllipsis } from "../../libs/custom";
import TourList from "./tourList";
import classes from "./mymap.module.css";

const AutoCompItem = React.forwardRef(function AutoCompItem(props, ref) {
  const {
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
      <Box p={5} onClick={() => locationHandler(data)}>
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

const CustomAutoComplete = ({
  version,
  area,
  countryData,
  placeData,
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

  const data = version === "country" ? countryData : placeData;
  let options;
  if (Array.isArray(data)) {
    options = data.map((item) => (
      <Combobox.Option value={item.label} key={item.value}>
        <AutoCompItem locationHandler={locationHandler} {...item} />
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
  }, [options, combobox, countrySearch, placeSearch, countryData, placeData]);

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
        locationHandler(optionProps.children.props);
      }}
    >
      <Combobox.Target>
        <InputBase
          ref={autoRef}
          classNames={{
            input:
              version === "country"
                ? classes.countryAutoComplete
                : classes.placeAutoComplete,
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
  const mapRef = useRef();
  const fullMapRef = mapRef.current?.getMap();
  const router = useRouter();
  const [area, setArea] = useState({ label: "" });
  const [locationDrawer, setLocationDrawer] = useState(false);
  const [lngLat, setLngLat] = useState([]);
  const [showStates, setShowStates] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);
  const [showMainMarker, setShowMainMarker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeData, setPlaceData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [placeLocation, setPlaceLocation] = useState({});
  const [showChoice, setShowChoice] = useState(false);
  const [topCities, setTopCities] = useState([]);
  const [listStates, setListStates] = useState([]);
  const [places, setPlaces] = useSessionStorage({
    key: "placeData",
    defaultValue: [],
  });

  const latitude = country_center[1];
  const longitude = country_center[0];

  const initialViewState = {
    latitude: latitude,
    longitude: longitude,
    zoom: 2.5,
    pitch: 0,
  };

  const [viewState, setViewState] = useState(initialViewState);

  useEffect(() => {
    router.prefetch("/tripplanner");
    area.label === "United States" && setShowStates(true);
  }, [area.label, router]);

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
    }
  }, [fullMapRef, mapLoaded, dark]);

  const getCords = (feature) => {
    let center = feature.center;
    if (feature && feature.geometry && feature.geometry.type) {
      center = centerOfMass(feature);
    }
    return center?.geometry.coordinates;
  };

  const locationHandler = (feature) => {
    setTopCities([]);
    setShowChoice(false);
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

    setArea(locationObj);
    setLngLat(locationObj.center);
    setCountrySearch("");
    setPlaceSearch("");
    setCountryData([]);
    setPlaceData([]);
    setLocationDrawer(true);
    setShowMainMarker(
      locationObj.type === "city" ||
        (locationObj.type === "region" &&
          locationObj.country !== "United States")
    );
    setShowStates(
      locationObj.country === "United States" && locationObj.type === "country"
    );

    if (
      (locationObj.country === "United States" &&
        locationObj.type === "region") ||
      locationObj.type !== "city"
    ) {
      fetchCities(locationObj);
    }
    if (
      locationObj.country === "United States" &&
      locationObj.type === "country"
    ) {
      usStates(locationObj);
    }

    const coordinates =
      locationObj.type === "country"
        ? getNewCenter(locationObj).newCenter
        : locationObj.center;
    const maxZoom = getNewCenter(locationObj).maxZoom;
    goToLocation(
      locationObj.type,
      coordinates,
      maxZoom,
      locationObj.country,
      locationObj.label
    );
  };

  const goToLocation = (type, center, maxZoom, location, name) => {
    if (type === "country") setShowMainMarker(false);
    if (type !== "country" || location !== "United States")
      setShowStates(false);
    let zoom = maxZoom;
    let pitch = 40;
    if (
      type === "city" ||
      (location !== "United States" && type === "region")
    ) {
      zoom = 12;
      pitch = 75;
    }
    if (name === "District of Columbia") {
      zoom = 10;
    }

    mapRef.current.flyTo({
      center: center,
      zoom: 3,
      duration: 800,
      pitch: 0,
    });

    setTimeout(() => {
      mapRef.current?.flyTo({
        center: center,
        duration: 1500,
        zoom: zoom,
        pitch: pitch,
        linear: false,
      });
    }, 400);
  };

  const addPlaces = (place) => {
    let newPlace = JSON.parse(JSON.stringify(place));
    // newPlace.id = place.id;
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

  const placeType = (place) => {
    if (place === "country") return "Country";
    if (place === "region") return "Region";
    if (place === "place") return "City";
  };

  const searchForState = (e) => {
    for (let item of listStates) {
      if (item.value === e) {
        return item.center;
      }
    }
    return null;
  };

  const onZoomEnd = (e) => {
    if (e.target.getZoom() < 3.5) {
      mapRef.current?.flyTo({
        duration: 2000,
        pitch: 0,
      });
    }
  };

  const pins = useMemo(
    () =>
      topCities.map((city, index) => (
        <Transition
          key={`marker-${index}`}
          mounted={!showMainMarker && topCities}
          transition="fade"
          duration={300}
          timingFunction="ease"
        >
          {(styles) => (
            <Marker
              style={styles}
              longitude={city[1][0]}
              latitude={city[1][1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(city);
                setArea(city);
              }}
            >
              <IconMapPinFilled className={classes.miniMapPin} />
            </Marker>
          )}
        </Transition>
      )),
    [topCities, showMainMarker]
  );

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

        if (field === "country") setCountryData(searchData);
        if (field === "place") setPlaceData(searchData);
      } catch (error) {
        console.error("Error fetching data for Country Autocomplete: ", error);
      }
    },
    [
      area,
      countrySearch,
      placeSearch,
      mapboxAccessToken,
      setCountryData,
      setPlaceData,
    ]
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

  const selectTopCity = (city) => {
    setArea({
      label: city[0],
      type: "city",
      country: area.country,
      center: city[1],
      region: city[2],
    });
    setPopupInfo(null);
    setShowMainMarker(true);
    setLngLat(city[1]);
    goToLocation("city", city[1], 12, area.country, city[0]);
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
          title: "Loaction already added",
          message: `${area.label} was already added to your tour`,
        });
        return;
      }
      addPlaces(place);
      reset();
    }
    if (choice === "travel") {
      setShowModal(true);
    }
    setShowChoice(false);
  };

  const reset = () => {
    mapRef.current.flyTo({
      zoom: 2.5,
      duration: 1000,
      pitch: 0,
    });
    setLngLat([0, 0]);
    setShowMainMarker(false);
    setArea({ label: "" });
    setShowStates(false);
    setLocationDrawer(false);
    setTopCities([]);
    setPlaceData([]);
    setCountryData([]);
    setPlaceSearch("");
    setCountrySearch("");
    setShowChoice(false);
    setPopupInfo(null);
  };

  const filter = useMemo(
    () => ["in", "name_en", area.label?.toString()],
    [area]
  );

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

  const openTourList = () => {
    setListOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const placeChoosen = () => {
    setShowModal(false);
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

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded}
        overlayProps={{ backgroundOpacity: 1 }}
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
            variant="filled"
            size="xs"
            color="green.9"
            onClick={() => {
              placeChoosen();
              setPlaces(placeLocation);
              router.push("/tripplanner");
            }}
          >
            <IconCheck stroke={4} />
          </Button>
          <Button
            className={classes.clearListButton}
            variant="filled"
            size="xs"
            color="red.9"
            onClick={() => setShowModal(false)}
          >
            <IconX stroke={4} />
          </Button>
        </Group>
      </Modal>
      <Drawer
        classNames={{ content: classes.loactionDrawer }}
        zIndex={1}
        pos={"relative"}
        withinPortal={false}
        size={390}
        position="right"
        opened={locationDrawer}
        withOverlay={false}
        withCloseButton={false}
        onClose={reset}
      >
        <Box pt={80}>
          <Group gap={2} ml={-5}>
            <IconArrowBadgeRightFilled
              size={25}
              style={{ color: dark ? "#0d3f82" : "#00e8fc" }}
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
                  placeData={placeData}
                  placeSearch={placeSearch}
                  setPlaceSearch={setPlaceSearch}
                  handleChange={handleChange}
                  locationHandler={locationHandler}
                />
              )}
            {area.country === "United States" && area.type === "country" ? (
              <Select
                classNames={{
                  input: classes.select,
                }}
                data={listStates}
                leftSection={<IconMapPinSearch size={17} />}
                leftSectionWidth={40}
                rightSection={<IconCaretDownFilled size={17} />}
                rightSectionWidth={40}
                placeholder="Search for a state..."
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
                  setArea(location);
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
              Choose as destination
            </Button>
            <Button
              className={classes.locationBtns}
              justify={"left"}
              variant="filled"
              leftSection={<IconList size={18} />}
              onClick={() => choosePlace("tour")}
            >
              Add to Tour List
            </Button>
          </Button.Group>
          <Button
            className={classes.closeBtn}
            mt={10}
            fullWidth
            radius={"xl"}
            leftSection={<IconArrowBarRight size={18} />}
            onClick={reset}
            justify={"center"}
            variant="gradient"
            gradient={
              dark
                ? { from: "#004585", to: "#00376b", deg: 180 }
                : { from: "#93f3fc", to: "#00e8fc", deg: 180 }
            }
          >
            CLOSE
          </Button>
        </Box>
      </Drawer>
      {places && places.length >= 1 && !listOpened && (
        <motion.div
          animate={buttonAnimation}
          initial={fadeIn}
          transition={{ duration: 0.01 }}
        >
          {/* Tour List Button */}
          <Tooltip
            classNames={{ tooltip: classes.toolTip }}
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
      {!searchOpened && !dropDownOpened && !locationDrawer && (
        <Center
          pos={"absolute"}
          top={"30px"}
          w={"100%"}
          style={{
            zIndex: 1,
          }}
        >
          {/* Main Place Search */}
          <Box pos={"relative"}>
            <CustomAutoComplete
              version={"country"}
              area={area}
              dark={dark}
              countryData={countryData}
              countrySearch={countrySearch}
              setCountrySearch={setCountrySearch}
              handleChange={handleChange}
              locationHandler={locationHandler}
            />
          </Box>
        </Center>
      )}
      <Map
        id="mapRef"
        ref={mapRef}
        {...viewState}
        onMove={(e) => {
          setViewState(e.viewState);
        }}
        initialViewState={initialViewState}
        renderWorldCopies={true}
        styleDiffing={false}
        maxPitch={80}
        onZoomEnd={onZoomEnd}
        maxZoom={14}
        minZoom={2}
        reuseMaps={true}
        onLoad={(e) => {
          setMapLoaded(true);
          const fogProperties = getFogProperties(dark);
          e.target.setFog(fogProperties);
        }}
        touchPitch={false}
        onClick={(e) => {
          locationHandler(e.features[0]);
        }}
        projection="globe"
        doubleClickZoom={false}
        interactiveLayerIds={["states", "country-boundaries", "clicked-state"]}
        mapStyle={"mapbox://styles/zenneson/clm07y8pz01ur01qieykmcji3"}
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={mapboxAccessToken}
      >
        {!searchOpened && (
          <TourList
            listOpened={listOpened}
            setListOpened={setListOpened}
            setShowMainMarker={setShowMainMarker}
            places={places}
            setPlaces={setPlaces}
            goToLocation={goToLocation}
            setLngLat={setLngLat}
            setLocationDrawer={setLocationDrawer}
            setArea={setArea}
          />
        )}
        {computedColorScheme ? pins : {}}
        {popupInfo && (
          <Popup
            className={classes.popup}
            anchor="bottom"
            offset={[0, -30]}
            closeOnMove={false}
            closeButton={false}
            closeOnClick={false}
            longitude={popupInfo[1][0]}
            latitude={popupInfo[1][1]}
          >
            <Box py={10} px={20} onClick={() => selectTopCity(popupInfo)}>
              {popupInfo[0]}
            </Box>
          </Popup>
        )}
        {showChoice && (
          <Popup
            className={classes.popup}
            anchor="bottom"
            offset={[0, -30]}
            closeOnMove={false}
            closeButton={false}
            closeOnClick={false}
            longitude={lngLat[0]}
            latitude={lngLat[1]}
          >
            <Stack px={10} gap={0} className={classes.popupMenu}>
              <Box pt={10} pl={0}>
                {area.label}
              </Box>
              <Button.Group
                orientation="vertical"
                mt={5}
                style={{
                  borderLeft: dark
                    ? "1px solid rgba(255, 255, 255, 0.25)"
                    : "1px solid rgba(0, 0, 0, 0.25)",
                }}
              >
                <Button
                  className={classes.popupMenuBtn}
                  justify={"left"}
                  variant="subtle"
                  size="xs"
                  radius={"0 3px 3px 0"}
                  leftSection={<IconPlane size={15} />}
                  onClick={() => choosePlace("travel")}
                >
                  Choose as destination
                </Button>
                <Button
                  className={classes.popupMenuBtn}
                  justify={"left"}
                  variant="subtle"
                  size="xs"
                  radius={"0 3px 3px 0"}
                  leftSection={<IconList size={15} />}
                  onClick={() => choosePlace("tour")}
                >
                  Add to Tour List
                </Button>
              </Button.Group>
            </Stack>
          </Popup>
        )}
        <Transition
          mounted={showMainMarker}
          transition="fade"
          duration={300}
          timingFunction="ease"
        >
          {(styles) => (
            <Marker
              style={styles}
              longitude={lngLat[0]}
              latitude={lngLat[1]}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setShowChoice(true);
              }}
            >
              <IconMapPinFilled
                style={{
                  cursor: "pointer",
                  transform: "scale(5)",
                  color: dark ? "#0D3F82" : "#00e8fa",
                }}
              />
            </Marker>
          )}
        </Transition>
        <Source
          id="country-boundaries"
          type="vector"
          url="mapbox://mapbox.country-boundaries-v1"
        >
          <Layer
            id="country-boundaries"
            source="country-boundaries"
            source-layer="country_boundaries"
            type="fill"
            paint={{
              "fill-color": "rgba(0,0,0,0)",
            }}
          />
          <Layer
            id="country-boundaries-fill"
            source="country-boundaries"
            source-layer="country_boundaries"
            type="fill"
            filter={!showStates ? filter : ["in", "name", "United States"]}
            paint={{
              "fill-color": `${
                dark ? " rgba(13, 64, 130, 0.8)" : "rgba(0, 232, 250, 0.8)"
              }`,
            }}
          />
          <Layer
            id="country-boundaries-lines"
            source="country-boundaries"
            source-layer="country_boundaries"
            type="line"
            filter={filter}
            paint={{
              "line-color": "rgba(255, 255, 255, 1)",
              "line-width": 4,
            }}
          />
        </Source>
        <Source
          id="states-boundaries"
          type="geojson"
          data="data/states.geojson"
        >
          <Layer
            id="states"
            type="fill"
            source="states-boundaries"
            paint={{
              "fill-color": "rgba(0,0,0,0)",
            }}
            filter={!showStates ? filter : ["!", ["in", "name", ""]]}
          />
          <Layer
            id="states-boundaries"
            type="line"
            source="states-boundaries"
            paint={{
              "line-color": "rgba(255, 255, 255, 1)",
              "line-width": 4,
            }}
            filter={!showStates ? filter : ["!", ["in", "name", ""]]}
          />
        </Source>
        <Source id="clicked-state" type="geojson" data="data/states.geojson">
          <Layer
            id="clicked-state"
            type="fill"
            paint={{
              "fill-color": `${
                dark ? " rgba(13, 64, 130, 0.8)" : "rgba(0, 232, 250, 0.8)"
              }`,
            }}
            filter={["==", "NAME", area.label]}
          />
          <Layer
            id="state-borders"
            type="line"
            paint={{
              "line-color": "rgba(255, 255, 255, 1)",
              "line-width": 4,
            }}
            filter={["==", "NAME", area.label]}
          />
        </Source>
      </Map>
    </>
  );
}
