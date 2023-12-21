"use client";
import {
  areaAtom,
  listAtom,
  mainMenuAtom,
  panelAtom,
  placesAtom,
  searchOpenedAtom,
} from "@libs/atoms";
import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  Text,
  Tooltip,
  Transition,
  useComputedColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconList } from "@tabler/icons-react";
import centerOfMass from "@turf/center-of-mass";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getNewCenter } from "../../../public/data/getNewCenter";
import classes from "../styles/mymap.module.css";
import CustomAutoComplete from "./customAutoComplete";
import LocationDrawer from "./locationDrawer";
import MapComp from "./mapComp";

const fadeOut = { opacity: 0 };
const fadeIn = { opacity: 1 };

export default function Mymap(props) {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const searchOpened = useAtomValue(searchOpenedAtom);
  const [listOpened, setListOpened] = useAtom(listAtom);
  const [mainMenuOpened, setMainMenuOpened] = useAtom(mainMenuAtom);
  const [panelShow, setPanelShow] = useAtom(panelAtom);

  const [area, setArea] = useAtom(areaAtom);
  const [places, setPlaces] = useAtom(placesAtom);
  const { latitude, longitude } = props;

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const router = useRouter();
  const mapRef = useRef();
  const fullMapRef = mapRef.current?.getMap();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationDrawer, setLocationDrawer] = useState(false);
  const [bbox, setBbox] = useState(null);
  const [showStates, setShowStates] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeSearchData, setPlaceSearchData] = useState([]);
  const [countrySearchData, setCountrySearchData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [topCities, setTopCities] = useState([]);
  const [listStates, setListStates] = useState([]);
  const [placeLocation, setPlaceLocation] = useState({});

  useEffect(() => {
    area.label === "United States" && setShowStates(true);
  }, [area]);

  const resetMap = () => {
    mapRef.current.flyTo({
      zoom: 2.5,
      duration: 1000,
      pitch: 0,
      bearing: 0,
      essential: true,
    });
  };

  const clearData = () => {
    setArea({ label: "" });
    setLocationDrawer(false);
    setTopCities([]);
    setPlaceSearchData([]);
    setCountrySearchData([]);
    setPlaceSearch("");
    setCountrySearch("");
    setShowStates(false);
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
    goToLocation(cityData);
  };

  const locationHandler = (feature) => {
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
    locationObj.region = feature.region || feature.properties?.NAME || "";
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

    goToLocation(locationObj);
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
      zoom = 15.5;
      pitch = 70;
      if (label.includes("District of Columbia")) {
        zoom = 12;
      }
    }
    return { zoom, pitch };
  };

  const goToLocation = (place) => {
    setShowStates(false);
    const { zoom, pitch } = calcView(place);
    const coords =
      place.type === "country" ? getNewCenter(place).newCenter : place.center;

    let newCoords = coords;
    if (newCoords && Array.isArray(newCoords)) {
      newCoords = { lng: newCoords[0], lat: newCoords[1] };
    } else if (newCoords && newCoords.lon) {
      newCoords = { lng: newCoords.lon, lat: newCoords.lat };
    }

    mapRef.current.flyTo({
      center: newCoords,
      zoom: zoom,
      pitch: pitch,
      curve: 2,
      speed: 0.8,
      bearing: 0,
      essential: true,
    });
  };

  const placeType = (place) => {
    if (place === "country" || place.type === "country") return "Country";
    if (place === "region" || place.type === "region") return "Region";
    if (place === "place" || place.type === "place") return "City";
  };

  const encodeBbox = (bbox) => {
    return `&bbox=${bbox.join(",")}`;
  };

  const handleChange = useCallback(
    async (field) => {
      let shortCode = area.shortcode;
      let border = bbox && encodeBbox(bbox);
      if (field === "place" && area.country === "United States") {
        shortCode = "us";
      } else {
        border = "";
      }

      let endpoint;
      if (field === "country") {
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&fuzzyMatch=true&autocomplete=true&limit=5&types=country%2Cregion%2Cplace&language=en&access_token=${mapboxAccessToken}`;
      } else {
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearch}.json?country=${shortCode}&fuzzyMatch=true${border}&autocomplete=true&&types=place%2Cregion&limit=5&language=en&access_token=${mapboxAccessToken}`;
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
      setBbox(dataArray[0]?.bbox);

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
    setPlaces(placeLocation);
    router.push("/tripPlanner");
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
    newPlace.id = place.id;
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
      region: area.region || area.country,
      type: area.type,
      coordinates: area.center,
      country: area.country,
      costs: {
        flight: 0,
        hotel: 0,
      },
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

  let rotateFrameId;
  let startTimestamp;
  const rotationSpeed = 0.02;
  const rotateCamera = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const elapsedTime = timestamp - startTimestamp;
    const angle = (elapsedTime * rotationSpeed) % 360;
    mapRef.current.rotateTo(angle, { duration: 100, easing: (t) => t });
    rotateFrameId = requestAnimationFrame(rotateCamera);
  };

  const endRotation = () => {
    cancelAnimationFrame(rotateFrameId);
  };

  useEffect(() => {
    router.prefetch("/tripPlanner");
  }, [router]);

  return (
    <>
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
              setShowModal(false);
              setTimeout(() => {
                placeChoosen();
              }, 200);
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
        endRotation={endRotation}
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
        mounted={!searchOpened && !locationDrawer}
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
                dark={dark}
                mapRef={mapRef}
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
        fullMapRef={fullMapRef}
        mapLoaded={mapLoaded}
        setMapLoaded={setMapLoaded}
        area={area}
        places={places}
        setPlaces={setPlaces}
        topCities={topCities}
        setTopCities={setTopCities}
        searchOpened={searchOpened}
        setLocationDrawer={setLocationDrawer}
        goToLocation={goToLocation}
        showStates={showStates}
        locationHandler={locationHandler}
        mapboxAccessToken={mapboxAccessToken}
        choosePlace={choosePlace}
        selectTopCity={selectTopCity}
        latitude={latitude}
        longitude={longitude}
        rotateCamera={rotateCamera}
      />
    </>
  );
}
