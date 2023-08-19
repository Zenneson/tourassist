import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import centerOfMass from "@turf/center-of-mass";
import { useSessionStorage } from "@mantine/hooks";
import {
  useMantineColorScheme,
  createStyles,
  Center,
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Title,
  Flex,
  Text,
  Group,
  NavLink,
  Drawer,
  Transition,
  Select,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconList,
  IconX,
  IconMapPinFilled,
  IconWorldSearch,
  IconMapPinSearch,
  IconListSearch,
  IconPlane,
  IconLuggage,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getNewCenter } from "../../public/data/getNewCenter";
import { addEllipsis, calculateFontSize } from "../../libs/custom";
import TourList from "./tourList";

export default function Mymap(props) {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const {
    listOpened,
    setListOpened,
    searchOpened,
    dropDownOpened,
    mapLoaded,
    setMapLoaded,
    setMainMenuOpened,
    country_name,
    country_center,
  } = props;
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const mapRef = useRef();
  const router = useRouter();
  const [touched, setTouched] = useState(false);
  const [area, setArea] = useState({ label: "" });
  const [headerEm, setHeaderEm] = useState(0);
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
  const [placeChoosen, setPlaceChoosen] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [topCities, setTopCities] = useState([]);
  const [listStates, setListStates] = useState([]);
  const [places, setPlaces] = useSessionStorage({
    key: "placeData",
    defaultValue: [],
  });
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });
  const [guest, setGuest] = useSessionStorage({
    key: "guest",
  });

  const latitude = country_center[1];
  const longitude = country_center[0];

  const initialViewState = {
    latitude: latitude,
    longitude: longitude,
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
        backgroundColor: dark ? theme.colors.dark[7] : theme.white,
        color: dark ? theme.white : theme.black,
        borderRadius: theme.radius.sm,
        boxShadow: theme.shadows.sm,
        padding: theme.spacing.xs,
      },
      "& .mapboxgl-popup-tip": {
        borderTopColor: dark ? `#000 !important` : `#fff !important`,
      },
    },

    select: {
      "& .mantine-Select-input": {
        "&::placeholder": {
          color: dark ? "#fff" : "#000",
        },
        border: "none",
        background: dark
          ? "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0, 0, 0, 1) 100%)"
          : "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255, 255, 255, 1) 100%)",
      },
      "& .mantine-Select-dropdown": {
        borderRadius: "25px 0 0 25px",
        border: "none",
      },
      "& .mantine-Select-root	": {
        borderRadius: "25px 0 0 25px",
        boxShadow: dark
          ? "0 2px 5px rgba(255, 255, 255, 0.02)"
          : "0 2px 5px rgba(0, 0, 0, 0.05)",
      },
    },
  }));

  const { classes } = useStyles();

  const [viewState, setViewState] = useState(initialViewState);

  useEffect(() => {
    router.prefetch("/tripplanner");
    area.label === "United States" && setShowStates(true);
    if (user === null && guest === false) {
      router.push("/");
    }
  }, [user, guest, area.label, router]);

  function getCords(feature) {
    const center = centerOfMass(feature);
    return center.geometry.coordinates;
  }

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

  function locationHandler(feature) {
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

    setLngLat(locationObj.center);
    setArea(locationObj);
    setHeaderEm(calculateFontSize(locationObj.label));
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
    const { label, region, country, group, center, border, ...rest } = props;
    const data = {
      label,
      region,
      country,
      group,
      center,
      border,
    };
    return (
      <Box ref={ref} {...rest} p={"5px 10px"}>
        <Box p={5} onClick={() => locationHandler(data)}>
          <Title order={6} lineClamp={1} truncate>
            {label}
          </Title>
          <Text fz={12} lineClamp={1} truncate>
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
    const { label, region, country, group, center, ...rest } = props;
    return (
      <Box
        ref={ref}
        {...rest}
        p={"5px 10px"}
        sx={{
          borderRadius: "25px 0 0 25px",
        }}
      >
        <Flex gap={5} align="center">
          <IconMapPinFilled opacity={0.1} size={15} /> {label}
        </Flex>
      </Box>
    );
  });

  const TravelItem = React.forwardRef(function TravelItem(props, ref) {
    const { label, icon, ...rest } = props;
    return (
      <Box
        {...rest}
        ref={ref}
        p={"5px 10px"}
        sx={{
          borderRadius: "25px 0 0 25px",
        }}
      >
        <Group spaceing={0} w={"100%"} position="left">
          {icon}
          <Text>{addEllipsis(label, 26)}</Text>
        </Group>
      </Box>
    );
  });

  const travelChoices = [
    {
      label: `Choose as destination`,
      value: "travel",
      icon: <IconPlane size={15} style={{ width: "5%" }} />,
    },
    {
      label: `Add to Tour List`,
      value: "tour",
      icon: <IconList size={15} style={{ width: "5%" }} />,
    },
  ];

  const handleChange = async (field) => {
    let shortCode = area.shortcode;
    if (field === "place" && area.country === "United States") shortCode = "us";

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
              }}
            >
              <IconMapPinFilled
                style={{
                  cursor: "pointer",
                  opacity: 0.7,
                  transform: "scale(1.5)",
                  color: dark ? " #121d47" : "#9c161c",
                }}
              />
            </Marker>
          )}
        </Transition>
      )),
    [dark, topCities, showMainMarker]
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
        const filterKeyLower = region[filterKey].toLowerCase();
        const labelLower = location.label.toLowerCase();
        return (
          filterKeyLower.includes(labelLower) ||
          labelLower.includes(filterKeyLower)
        );
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
    <Group key={index}>
      <NavLink
        label={city[0]}
        c={dark ? "white" : "dark"}
        icon={
          <IconMapPinFilled
            size={15}
            opacity={0.2}
            style={{
              position: "relative",
              top: 1,
              marginLeft: 3,
            }}
          />
        }
        onClick={() => selectTopCity(city)}
        bg={
          dark
            ? "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0, 0, 0, 1) 100%)"
            : "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255, 255, 255, 1) 100%)"
        }
        sx={{
          transition: "all 200ms ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            borderRadius: "25px 0 0 25px",
          },
          boxShadow: `${
            dark
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
    setArea({
      label: city[0],
      type: "city",
      country: area.country,
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
      place: area.label,
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
    () => ["in", "name_en", area.label.toString()],
    [area.label]
  );

  return (
    <>
      <LoadingOverlay visible={!mapLoaded} overlayOpacity={1} />
      <Modal
        size={"auto"}
        zIndex={130}
        opened={showModal}
        onClose={setShowModal}
        withCloseButton={false}
        padding={"xl"}
        centered
        styles={(theme) => ({
          header: {
            backgroundColor: "transparent",
          },
          content: {
            backgroundColor: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          },
          overlay: {
            backgroundColor: dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(9px)",
          },
        })}
      >
        <Text fz={14} ta={"center"} mb={10}>
          {places && places.length > 0 && !placeChoosen
            ? "Clear the Tour List and c"
            : "C"}
          ontinue with{" "}
          <Text fw={700} span>
            {area.label}
          </Text>{" "}
          as your destination?
        </Text>
        <Group grow spacing={10}>
          <Button
            variant="filled"
            size="xs"
            color="green"
            onClick={() => {
              setPlaceChoosen(true);
              setPlaces(placeLocation);
              router.push("/tripplanner");
            }}
          >
            <IconCheck stroke={4} />
          </Button>
          <Button
            variant="filled"
            size="xs"
            color="red"
            onClick={() => setShowModal(false)}
          >
            <IconX stroke={4} />
          </Button>
        </Group>
      </Modal>
      <Drawer
        size={"50%"}
        position="right"
        opened={locationDrawer}
        withOverlay={false}
        withCloseButton={false}
        onClose={reset}
        styles={(theme) => ({
          root: {
            zIndex: 125,
            position: "relative",
          },
          content: {
            pointerEvents: "none",
            boxShadow: "none",
            paddingTop: 100,
            overflow: "hidden",
            background: dark
              ? "linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))"
              : "linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
          },
        })}
      >
        <Box>
          <Flex w={"100"} h={90} gap={0} justify={"flex-end"} align={"center"}>
            <ActionIcon
              size={"xl"}
              mr={5}
              variant="transparent"
              onClick={reset}
              opacity={0.7}
              sx={{
                pointerEvents: "all",
                transform: "scale(1.2)",
                transition: "all 150ms ease-in-out",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.5)",
                },
              }}
            >
              <IconX
                color={dark ? "#9ff5fd" : "#fa7500"}
                stroke={5}
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
                from: dark ? "#00E8FC" : "#fa7500",
                to: dark ? "#FFF" : "#000",
                deg: 45,
              }}
              sx={{
                textTransform: "uppercase",
                textShadow: `0 3px 5px ${
                  dark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.15)"
                }`,
              }}
            >
              {area.label}
            </Title>
          </Flex>
          <Box
            pos={"relative"}
            top={10}
            left={16}
            ml={"65%"}
            w={"35%"}
            sx={{
              pointerEvents: "all",
            }}
          >
            {mapLoaded &&
              area.type !== "city" &&
              !(area.type === "region" && area.country !== "United States") && (
                <Autocomplete
                  size="md"
                  defaultValue=""
                  itemComponent={AutoCompItem}
                  value={placeSearch}
                  onItemSubmit={(e) => locationHandler(e)}
                  data={placeData}
                  filter={(id, item) => item}
                  switchDirectionOnFlip={true}
                  onChange={(e) => {
                    setPlaceSearch(e);
                    handleChange("place");
                  }}
                  placeholder={addEllipsis(
                    `Search in${
                      prefaceThe.includes(area.label) ? " The" : ""
                    } ${
                      area.country === "United States"
                        ? area.country
                        : area.label
                    }?`,
                    28
                  )}
                  icon={
                    <IconMapPinSearch
                      opacity={0.5}
                      size={25}
                      style={{
                        paddingLeft: 5,
                        color: dark ? " #00e8fa" : "#fa7500",
                      }}
                    />
                  }
                  styles={(theme) => ({
                    root: {
                      transition: "all 250ms ease-in-out",
                    },
                    input: {
                      "&::placeholder": {
                        color: dark ? "#fff" : "#000",
                      },
                      borderRadius: "25px 0 0 0",
                      border: "none",
                      borderTop: `2px solid ${
                        dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                      }`,
                      background: dark
                        ? "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0, 0, 0, 1) 100%)"
                        : "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255, 255, 255, 1) 100%)",
                    },
                    item: {
                      borderRadius: "18px 0 0 18px",
                    },
                    dropdown: {
                      borderRadius: "25px 0 0 25px",
                      backgroundColor: dark
                        ? theme.fn.rgba(theme.colors.dark[7], 0.95)
                        : theme.fn.rgba(theme.colors.gray[0], 0.95),
                    },
                  })}
                />
              )}
            {area.country === "United States" && area.type === "country" ? (
              <Select
                className={classes.select}
                size="md"
                placeholder="Select a US State"
                itemComponent={SelectItem}
                nothingFound="Nobody here"
                data={listStates}
                searchable={true}
                icon={
                  <IconListSearch
                    opacity={0.5}
                    size={25}
                    style={{
                      paddingLeft: 5,
                      color: dark ? " rgba(0, 232, 250)" : "rgba(250, 117, 0)",
                    }}
                  />
                }
                filter={(value, item) =>
                  item.label.toLowerCase().includes(value.toLowerCase().trim())
                }
                onChange={(e) => {
                  searchForState(e);
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
              <Box hidden={area.type === "city"}>{topCitiesList}</Box>
            )}
            <Select
              className={classes.select}
              size="md"
              radius={
                area.type === "city" ||
                (area.type === "region" && area.country !== "United States")
                  ? "25px 0 0 25px"
                  : "0 0 0 25px"
              }
              placeholder={`Select ${addEllipsis(area.label, 19)}?`}
              itemComponent={TravelItem}
              nothingFound="Nobody here"
              data={travelChoices}
              icon={
                <IconLuggage
                  opacity={0.5}
                  size={25}
                  style={{
                    paddingLeft: 5,
                    color: dark ? " rgba(0, 232, 250)" : "rgba(250, 117, 0)",
                  }}
                />
              }
              onChange={(e) => choosePlace(e)}
            />
          </Box>
        </Box>
      </Drawer>
      {places && places.length >= 1 && !listOpened && (
        // Tour List Button
        <Button
          onClick={() => setListOpened(true)}
          bg={dark ? "dark.9" : "gray.0"}
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
              background: dark ? "#050506" : "#bbb",
            },
          }}
        >
          <IconList
            size={15}
            style={{
              color: dark ? "#fff" : "#000",
            }}
          />
        </Button>
      )}
      {!searchOpened && !dropDownOpened && !locationDrawer && (
        <Center pos={"absolute"} top={"27px"} w={"100%"}>
          {/* Main Place Search */}
          <Box
            w={400}
            pos={"relative"}
            style={{
              zIndex: 200,
            }}
          >
            <Autocomplete
              size="lg"
              defaultValue=""
              itemComponent={AutoCompItem}
              value={countrySearch}
              placeholder="Where would you like to go?"
              onItemSubmit={(e) => locationHandler(e)}
              data={countryData}
              filter={(id, item) => item}
              radius={25}
              onChange={(e) => {
                setCountrySearch(e);
                handleChange("country");
              }}
              icon={
                <IconWorldSearch
                  size={30}
                  style={{
                    paddingLeft: 5,
                    color: dark ? " #00e8fa" : "#fa7500",
                  }}
                />
              }
              styles={(theme) => ({
                root: {
                  borderTop: `2px solid ${
                    dark ? "rgba(75, 75, 75, 0.3)" : "rgba(0,0,0,0.05)"
                  }`,
                  borderRadius: "25px",
                  boxShadow: dark
                    ? "0 3px 5px rgba(255, 255, 255, 0.04)"
                    : "0 3px 5px rgba(0, 0, 0, 0.04)",
                },
                item: { borderRadius: "17px" },
                dropdown: {
                  borderRadius: "25px",
                  backgroundColor: dark
                    ? theme.fn.rgba(theme.colors.dark[7], 0.95)
                    : theme.fn.rgba(theme.colors.gray[0], 0.95),
                },
              })}
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
          setTouched(true);
        }}
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
        }}
        touchPitch={false}
        onClick={(e) => {
          locationHandler(e.features[0]);
        }}
        projection="globe"
        doubleClickZoom={false}
        interactiveLayerIds={["states", "country-boundaries", "clicked-state"]}
        mapStyle={
          dark
            ? "mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
            : "mapbox://styles/zenneson/clk2aa9s401ed01padxsqanrd"
        }
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={mapboxAccessToken}
      >
        {!searchOpened && (
          <TourList
            listOpened={listOpened}
            setListOpened={setListOpened}
            places={places}
            setPlaces={setPlaces}
          />
        )}
        {colorScheme ? pins : {}}
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
            <Box py={10} px={20}>
              {area.label}
              <NavLink
                mt={5}
                icon={<IconPlane size={15} />}
                label={"Choose as destination"}
                onClick={() => choosePlace("travel")}
                sx={{
                  borderLeft: `1px solid ${
                    dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
                  }`,
                }}
              />
              <NavLink
                icon={<IconList size={15} />}
                label={"Add to Tour List"}
                onClick={() => choosePlace("tour")}
                sx={{
                  borderLeft: `1px solid ${
                    dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
                  }`,
                }}
              />
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
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setShowChoice(true);
              }}
            >
              <IconMapPinFilled
                style={{
                  cursor: "pointer",
                  transform: "scale(5)",
                  color: dark ? "#00e8fa" : "#fa7500",
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
                dark ? " rgba(0, 232, 250, 0.8)" : "rgba(250, 117, 0, 0.8)"
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
                dark ? " rgba(0, 232, 250, 0.8)" : "rgba(250, 117, 0, 0.8)"
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
