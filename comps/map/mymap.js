import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import centerOfMass from "@turf/center-of-mass";
import {
  createStyles,
  useMantineTheme,
  Center,
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Modal,
  Title,
  Flex,
  Text,
  Group,
  Divider,
  NavLink,
  Popover,
  LoadingOverlay,
  Drawer,
  Transition,
  Image,
  Select,
} from "@mantine/core";
import { useSessionStorage, usePrevious } from "@mantine/hooks";
import {
  IconPlaylistAdd,
  IconLocation,
  IconPlaneTilt,
  IconAlertTriangle,
  IconWorld,
  IconMapSearch,
  IconList,
  IconX,
  IconCheck,
  IconMapPin,
  IconChevronsLeft,
  IconMapPinFilled,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getNewCenter } from "../../public/data/getNewCenter";
import TourList from "./tourList";
import Loader from "../loader";
import { list } from "firebase/storage";

export default function Mymap({
  setPanelShow,
  setMainMenuOpened,
  listOpened,
  setListOpened,
  searchOpened,
  dropDownOpened,
  mapLoaded,
  setMapLoaded,
}) {
  const theme = useMantineTheme();
  const mapRef = useRef();
  const center = useRef();
  const router = useRouter();
  const [area, setArea] = useState({ label: "" });
  const returnRegion = usePrevious(area);
  const [headerEm, setHeaderEm] = useState(0);
  const [locationDrawer, setLocationDrawer] = useState(false);
  const [lngLat, setLngLat] = useState([]);
  const [showStates, setShowStates] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);
  const [showMainMarker, setShowMainMarker] = useState(false);
  const [citySubTitle, setCitySubTitle] = useState("");
  const [isoName, setIsoName] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cityData, setCityData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [borderBox, setBorderbox] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isCity, setIsCity] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const [placeLocation, setPlaceLocation] = useState({});
  const [tourListDropDown, setTourListDropDown] = useState(false);
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });
  const [topCities, setTopCities] = useState([]);
  const [listStates, setListStates] = useState([]);
  const [geoLat, setGeoLat] = useSessionStorage({
    key: "geoLatState",
    defaultValue: null,
  });
  const [geoLng, setGeoLng] = useSessionStorage({
    key: "geoLngState",
    defaultValue: null,
  });
  const [mapReady, setMapReady] = useState(false);
  const [places, setPlaces] = useSessionStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const [visible, setVisible] = useSessionStorage({
    key: "visible",
    defaultValue: false,
  });
  const [mapSpin, setMapSpin] = useSessionStorage({
    key: "mapSpin",
    defaultValue: true,
  });

  const initialViewState = {
    latitude: geoLat,
    longitude: geoLng,
    zoom: 2.5,
    pitch: 0,
  };

  const useStyles = createStyles((theme) => ({
    popup: {
      "& .mapboxgl-popup-content": {
        fontSize: "1rem",
        maxWidth: "20rem",
        fontWeight: 700,
        fontFamily: "Montserrat",
        cursor: "pointer",
        paddingTop: "0rem !important",
        paddingBottom: "0rem !important",
        paddingLeft: "0rem !important",
        paddingRight: "0rem !important",
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        borderRadius: theme.radius.sm,
        boxShadow: theme.shadows.sm,
        padding: theme.spacing.xs,
      },
      "& .mapboxgl-popup-tip": {
        borderTopColor:
          theme.colorScheme === "dark" ? `#000 !important` : `#fff !important`,
      },
    },
  }));

  const { classes } = useStyles();

  const filter = useMemo(
    () => ["in", "name_en", area.label.toString()],
    [area.label]
  );

  useEffect(() => {
    router.prefetch("/tripplanner");
  }, [router]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let { latitude, longitude } = position.coords;
          setGeoLat(latitude);
          setGeoLng(longitude);
        },
        function (error) {
          setGeoLat(37);
          setGeoLng(-95);
        }
      );
    }
    let rotationIntervalId;
    if (mapSpin && !user) {
      rotationIntervalId = setInterval(() => {
        mapRef.current?.easeTo({
          center: [
            mapRef.current?.getCenter().lng + 0.5,
            mapRef.current?.getCenter().lat,
          ],
          zoom: 3.5,
          pitch: 10,
          duration: 25,
        });
      }, 25);
    } else {
      clearInterval(rotationIntervalId);
      setMapSpin(false);
      if (geoLat && geoLng) {
        if (!mapReady) {
          mapRef.current?.flyTo({
            center: [geoLng, geoLat],
            zoom: 2.5,
            pitch: 0,
            duration: 1500,
          });
          setMapReady(true);
        }
      }
    }
    return () => clearInterval(rotationIntervalId);
  }, [
    visible,
    user,
    mapRef,
    mapSpin,
    setMapSpin,
    geoLat,
    geoLng,
    mapReady,
    router,
    setGeoLat,
    setGeoLng,
  ]);

  useEffect(() => {
    area.label === "United States" && setShowStates(true);
  }, [area.label]);

  function getCords(feature) {
    const center = centerOfMass(feature);
    return center.geometry.coordinates;
  }

  function calculateFontSize(text) {
    const containerWidthPx = 700;
    const stringLength = text.length;
    let fontSizePx = containerWidthPx / stringLength;
    let fontSizeEm = fontSizePx / 16;

    fontSizeEm = Math.max(fontSizeEm, 1.7);
    fontSizeEm = Math.min(fontSizeEm, 6);

    return fontSizeEm;
  }

  // TODO - locationHandler
  function locationHandler(feature) {
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
      feature.properties?.name ||
      feature.properties?.name_en ||
      "";
    locationObj.state = feature.region || feature.properties?.NAME || "";
    locationObj.center = feature.center || getCords(feature);

    setLngLat(locationObj.center);
    setArea(locationObj);
    setHeaderEm(calculateFontSize(locationObj.label));
    setCountrySearch("");
    setCitySearch("");
    setCountryData([]);
    setCityData([]);
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
  }

  const goToLocation = (type, center, maxZoom, location, name) => {
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
      mapRef.current.flyTo({
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

  function placeType(place) {
    if (place === "country") return "Country";
    if (place === "region") return "Region";
    if (place === "place") return "City";
  }

  const AutoCompItem = React.forwardRef(function AutoCompItem(props, ref) {
    const { label, region, country, group, center, border, fullname, ...rest } =
      props;
    const data = {
      label,
      region,
      country,
      group,
      center,
      border,
      fullname,
    };
    return (
      <Box ref={ref} {...rest} p={"5px 10px"}>
        <Box p={5} onClick={() => locationHandler(data)}>
          <Title order={6}>{label}</Title>
          <Text fz={12}>
            {group === "City" ? `${region}, ${country}` : country}
          </Text>
        </Box>
      </Box>
    );
  });

  const searchForState = (e) => {
    for (let item of listStates) {
      if (item.value === e) {
        return item.center;
      }
    }
    return null;
  };

  const SelectItem = React.forwardRef(function SelectItem(props, ref) {
    const { label, region, country, group, center, fullname, ...rest } = props;
    return (
      <Box ref={ref} {...rest} p={"5px 10px"}>
        <Flex gap={5} variant="subtle" align="center">
          <IconMapPinFilled opacity={0.1} size={15} /> {label}
        </Flex>
      </Box>
    );
  });

  const handleChange = async () => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&autocomplete=true&fuzzyMatch=true&limit=5&types=country%2Cregion%2Cplace&language=en&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;

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
        fullname: feature.place_name,
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

      setCountryData(searchData);
    } catch (error) {
      console.log("Error fetching data for Country Autocomplete: ", error);
    }
  };

  const onZoomEnd = (e) => {
    if (e.target.getZoom() < 3.5) {
      mapRef.current.flyTo({
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
              }}
            >
              <IconMapPinFilled
                style={{
                  cursor: "pointer",
                  opacity: 0.7,
                  transform: "scale(1.5)",
                  color: theme.colorScheme === "dark" ? " #121d47" : "#9c161c",
                }}
              />
            </Marker>
          )}
        </Transition>
      )),
    [topCities, theme.colorScheme, showMainMarker]
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
      const dataArray = data.filter(
        (region) => region[filterKey] === location.label
      );
      const regionCities = dataArray[0]?.cities;
      let topFive = [];
      regionCities &&
        regionCities.map((city) => {
          topFive.push([city.name, city.center]);
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
      position="right"
      pos={"relative"}
      left={15}
      sx={{
        transition: "all 150ms ease-in-out",
        "&:hover": {
          left: 13,
        },
      }}
    >
      <NavLink
        mb={5}
        fw={700}
        label={city[0]}
        c={theme.colorScheme === "dark" ? "white" : "dark"}
        icon={
          <IconMapPinFilled
            size={15}
            style={{
              position: "relative",
              top: 1,
              marginLeft: 3,
            }}
          />
        }
        onClick={() => selectTopCity(city)}
        bg={
          theme.colorScheme === "dark"
            ? "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0, 0, 0, 1) 100%)"
            : "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255, 255, 255, 1) 100%)"
        }
        sx={{
          borderRadius: "25px 0 0 25px",
          borderTop: `2px solid ${
            theme.colorScheme === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)"
          }`,
          boxShadow: `${
            theme.colorScheme === "dark"
              ? "rgba(0, 0, 0, 0.2) 0px 10px 7px -5px"
              : "rgba(0, 0, 0, 0.1) 0px 5px 7px -5px"
          }`,
        }}
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
    setHeaderEm(calculateFontSize(city[0]));
    setArea({ label: city[0], type: "city", country: area.country });
    setPopupInfo(null);
    setShowMainMarker(true);
    setLngLat(city[1]);
    goToLocation("city", city[1], 12, area.country, city[0]);
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
    setCityData([]);
    setCountryData([]);
    setCitySearch("");
    setCountrySearch("");
  };

  const returnToRegion = () => {
    if (returnRegion.center === undefined) {
      reset();
      return;
    }
    setLngLat(returnRegion.center);
    setPopupInfo(null);
    if (area.type === "city") {
      const ww = {
        label: returnRegion.label,
        group: returnRegion.country === "United States" ? "region" : "country",
        center: returnRegion.center,
        country: returnRegion.country,
        state: "",
      };
      setArea(ww);
      locationHandler(ww);
    } else if (area.type === "region" && area.country === "United States") {
      const us = {
        label: "United States",
        group: "country",
        type: "country",
        center: [-100.58542673380947, 34.91248268838714],
        country: "United States",
        state: "",
      };
      setShowStates(true);
      setArea(us);
      locationHandler(us);
    } else {
      reset();
    }
  };

  return (
    <>
      <Loader pageLoaded={mapLoaded} />
      {/* TODO - Drawer */}
      <Drawer
        size={"50%"}
        position="right"
        opened={locationDrawer}
        withOverlay={false}
        withCloseButton={false}
        styles={(theme) => ({
          content: {
            pointerEvents: "none",
            boxShadow: "none",
            paddingTop: 100,
            overflow: "visible",
            backgroundColor: "transparent",
          },
        })}
      >
        <Box>
          <Flex w={"100"} h={90} gap={0} justify={"flex-end"} align={"center"}>
            <ActionIcon
              size={"xl"}
              mr={5}
              variant="transparent"
              onClick={returnToRegion}
              opacity={0.7}
              sx={{
                pointerEvents: "all",
                transform: "scale(1.5)",
                transition: "all 150ms ease-in-out",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.7)",
                },
              }}
            >
              <IconChevronsLeft
                color={theme.colorScheme === "dark" ? "#9ff5fd" : "#fa7500"}
                stroke={2}
                size={headerEm + "em"}
              />
            </ActionIcon>
            <Title
              lineClamp={1}
              truncate={true}
              fw={900}
              fz={headerEm + "em"}
              variant="gradient"
              gradient={{
                from: theme.colorScheme === "dark" ? "#00E8FC" : "#fa7500",
                to: theme.colorScheme === "dark" ? "#FFF" : "#000",
                deg: 45,
              }}
              sx={{
                textTransform: "uppercase",
                textShadow: `0 3px 5px ${
                  theme.colorScheme === "dark"
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(0, 0, 0, 0.15)"
                }`,
              }}
            >
              {area.label}
            </Title>
          </Flex>
          <Box
            pos={"relative"}
            left={15}
            ml={"70%"}
            w={"30%"}
            hidden={area.type === "city"}
            sx={{
              pointerEvents: "all",
            }}
          >
            <Divider
              size="xs"
              my="xs"
              opacity={0.3}
              color={theme.colorScheme === "dark" ? "white" : "dark"}
            />
            {area.country === "United States" && area.type === "country" ? (
              <Select
                size="md"
                radius={"3px 0 0 3px"}
                placeholder="Select a US State"
                itemComponent={SelectItem}
                nothingFound="Nobody here"
                data={listStates}
                searchable={true}
                hoverOnSearchChange={true}
                filter={(value, item) =>
                  item.label.toLowerCase().includes(value.toLowerCase().trim())
                }
                onChange={(e) => {
                  searchForState(e);
                  let location = {
                    label: e,
                    group: "region",
                    center: searchForState(e),
                    country: "United States",
                  };
                  setArea(location);
                  locationHandler(location);
                }}
                sx={{
                  boxShadow:
                    theme.colorScheme === "dark"
                      ? "0 2px 5px rgba(255, 255, 255, 0.05)"
                      : "0 2px 5px rgba(0, 0, 0, 0.05)",
                }}
              />
            ) : (
              <Box>{topCitiesList}</Box>
            )}
          </Box>
        </Box>
      </Drawer>
      {places.length >= 1 && !listOpened && !mapSpin && (
        // Tour List Button
        <Button
          onClick={showTourList}
          bg={theme.colorScheme === "dark" ? "dark.9" : "gray.0"}
          opacity={0.7}
          radius={"0 3px 3px 0"}
          pos={"absolute"}
          top={134}
          left={0}
          p={"0 8px"}
          sx={{
            transition: "all 100ms ease-in-out",
            zIndex: 120,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.02)",
            "&:hover": {
              opacity: 1,
              backgroundColor: "#020202",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.04)",
            },
          }}
        >
          <IconList
            size={15}
            style={{
              color: theme.colorScheme === "dark" ? "#fff" : "#000",
            }}
          />
        </Button>
      )}
      {!searchOpened && visible && !mapSpin && !dropDownOpened && (
        <Center pos={"absolute"} bottom={"100px"} w={"100%"}>
          {/* Main Place Search */}
          {/* TODO - Country Auto */}
          <Box
            w={400}
            pos={"relative"}
            style={{
              zIndex: 200,
            }}
          >
            <Autocomplete
              icon={
                <IconLocation
                  size={20}
                  style={{
                    opacity: 0.4,
                    color:
                      theme.colorScheme === "dark"
                        ? " rgba(0, 232, 250)"
                        : "rgba(250, 117, 0)",
                  }}
                />
              }
              size="lg"
              defaultValue=""
              itemComponent={AutoCompItem}
              value={countrySearch}
              placeholder="Where would you like to go?"
              onItemSubmit={(e) => locationHandler(e)}
              data={countryData}
              filter={(id, item) => item}
              switchDirectionOnFlip={true}
              style={{
                width: "400px",
                zIndex: 200,
              }}
              onChange={(e) => {
                setCountrySearch(e);
                handleChange();
              }}
              styles={(theme) => ({
                dropdown: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.fn.rgba(theme.colors.dark[7], 0.95)
                      : theme.fn.rgba(theme.colors.gray[0], 0.95),
                },
              })}
            />
          </Box>
        </Center>
      )}
      {geoLat && geoLng && (
        <Map
          initialViewState={initialViewState}
          renderWorldCopies={true}
          styleDiffing={false}
          maxPitch={80}
          onZoomEnd={onZoomEnd}
          maxZoom={14}
          minZoom={2}
          reuseMaps={true}
          onLoad={() => {
            setMapLoaded(true);
            sessionStorage.removeItem("noLogin");
          }}
          touchPitch={false}
          // keyboard={false}
          ref={mapRef}
          onClick={(e) => {
            locationHandler(e.features[0]);
          }}
          projection="globe"
          doubleClickZoom={false}
          interactiveLayerIds={[
            "states",
            "country-boundaries",
            "clicked-state",
          ]}
          mapStyle={
            theme.colorScheme === "dark"
              ? "mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
              : "mapbox://styles/zenneson/clk2aa9s401ed01padxsqanrd"
          }
          style={{ width: "100%", height: "100%" }}
          mapboxAccessToken="pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
        >
          {visible && !searchOpened && (
            <TourList
              listOpened={listOpened}
              setListOpened={setListOpened}
              places={places}
              setPlaces={setPlaces}
            />
          )}
          {pins}
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
                offsetLeft={-20}
                offsetTop={-10}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  reset();
                }}
              >
                <Image width={80} src={"img/pin.png"} alt="Map Pin" />
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
                  theme.colorScheme === "dark"
                    ? " rgba(0, 232, 250, 0.8)"
                    : "rgba(250, 117, 0, 0.8)"
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
                  theme.colorScheme === "dark"
                    ? " rgba(0, 232, 250, 0.8)"
                    : "rgba(250, 117, 0, 0.8)"
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
      )}
    </>
  );
}
