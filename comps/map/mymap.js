import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Map, { Marker, Source, Layer } from "react-map-gl";
import centerOfMass from "@turf/center-of-mass";
import bbox from "@turf/bbox";
import {
  useMantineTheme,
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
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconPlaylistAdd,
  IconLocation,
  IconPlaneTilt,
  IconAlertTriangle,
  IconMapPin,
  IconMapSearch,
  IconList,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getNewCenter } from "../../public/data/getNewCenter";
import TourList from "./tourList";
import Loader from "../loader";

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
  const [citySubTitle, setCitySubTitle] = useState("");
  const [isoName, setIsoName] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cityData, setCityData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [borderBox, setBorderbox] = useState([]);
  const [showStates, setShowStates] = useState(false);
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

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [theme.colorScheme, setMapLoaded]);

  function getCords(feature) {
    const center = centerOfMass(feature);
    return center.geometry.coordinates;
  }

  // TODO - goToCountry
  function goToCountry(feature) {
    if (feature == null) return;
    let locationObj = {};
    locationObj.type =
      feature.group ||
      (feature.source === "country-boundaries" ? "country" : "region") ||
      "";
    locationObj.type = locationObj.type.toLowerCase();
    locationObj.label =
      feature.label ||
      feature.properties.name_en ||
      feature.properties.name ||
      feature.properties.NAME ||
      "";
    locationObj.country =
      feature.country ||
      (feature.properties.NAME && "United States") ||
      feature.properties.name ||
      feature.properties.name_en ||
      "";
    locationObj.state = feature.region || feature.properties?.NAME || "";
    locationObj.center = feature.center || getCords(feature) || [];
    locationObj.border = feature.border || [];

    setArea(locationObj);
    setShowStates(
      locationObj.country === "United States" && locationObj.type === "country"
    );

    const coordinates = getNewCenter(locationObj).newCenter;
    const maxZoom = getNewCenter(locationObj).maxZoom;
    mapRef.current.flyTo({
      center: coordinates,
      zoom: 3,
      duration: 800,
      pitch: 0,
    });

    setTimeout(() => {
      mapRef.current.flyTo({
        center: coordinates,
        duration: 1500,
        zoom: locationObj.type === "city" ? 12 : maxZoom,
        maxZoom: maxZoom,
        pitch: locationObj.type === "city" ? 75 : 40,
        linear: false,
      });
    }, 400);

    // let isSelection = true ? feature?.text : false;
    // let isoName = feature?.properties?.iso_3166_1 || feature?.shortcode || "";
    // setIsCountry(placeType === "country" || placeType === "country-boundries");
    // setBorderbox(border);

    /////////////////////////////////////////////////////////////////////////////////////////

    // if (location) {
    //   center.current = isSelection
    //     ? feature.geometry.coordinates
    //     : centerOfMass(feature);
    //   setShowStates(location === "United States");

    //   const index = feature.place_name?.indexOf(",");
    //   let result = feature.place_name?.substring(index + 1);
    //   {
    //     feature.layer?.source === "states-boundaries"
    //       ? (result = "United States")
    //       : result;
    //   }
    //   setCitySubTitle(result);
    //   setIsCity(
    //     isSelection &&
    //       (feature?.place_type.includes("place") ||
    //         (feature?.place_type[0] === "region" &&
    //           location === "United States"))
    //   );

    //   setPlaceLocation({
    //     place: location,
    //     region: result,
    //   });

    //   mapRef.current.flyTo({
    //     center: isSelection ? feature.geometry.coordinates : newCenter,
    //     zoom:
    //       location === "United States" && (area.state || isSelection) ? 5.5 : 3.5,
    //     duration: 800,
    //     pitch: 0,
    //   });

    //   setTimeout(() => {
    //     mapRef.current.flyTo({
    //       center: isSelection ? feature.geometry.coordinates : newCenter,
    //       duration: 1500,
    //       zoom:
    //         isSelection &&
    //         (feature?.place_type.includes("place") ||
    //           (feature?.place_type[0] === "region" &&
    //             location === "United States"))
    //           ? 12
    //           : maxZoom,
    //       maxZoom: maxZoom,
    //       pitch:
    //         isSelection &&
    //         (feature?.place_type.includes("place") ||
    //           (feature?.place_type[0] === "region" &&
    //             location === "United States"))
    //           ? 75
    //           : 40,
    //       linear: false,
    //     });
    //   }, 400);

    //   if (location !== "United States") {
    //     setShowModal(true);
    //   }
    // }

    // if (
    //   feature.layer?.source === "states-boundaries" ||
    //   area.state ||
    //   location === "United States"
    // ) {
    //   setCitySubTitle("United States");
    //   fetchCities(location, true);
    // } else {
    //   fetchCities(location);
    // }
    // setIsoName(isoName);
    // setCityData([]);
    // setCountryData([]);
  }

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
    const { label, region, country, group, center, border, fullname } = props;
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
      <Box ref={ref}>
        <Box
          p={5}
          onClick={() => goToCountry(data)}
          sx={{
            cursor: "pointer",
            transitions: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Title order={6}>{label}</Title>
          <Text fz={12}>
            {group === "City" ? `${region}, ${country}` : country}
          </Text>
        </Box>
      </Box>
    );
  });

  // TODO - Handle Change
  const handleChange = async (field) => {
    let endpoint;
    switch (field) {
      case "country":
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&autocomplete=true&fuzzyMatch=true&limit=5&types=country%2Cregion%2Cplace&language=en&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
        break;
      case "city":
        const [minLng, minLat, maxLng, maxLat] = borderBox;
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${citySearch}.json?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&autocomplete=true&&fuzzyMatch=true&types=place&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
        if (isCountry)
          endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${citySearch}.json?country=${isoName}&autocomplete=true&&fuzzyMatch=true&types=place&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
        break;
      default:
        break;
    }

    if (countrySearch.length > 1 || citySearch.length > 1) {
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
          border: feature.bbox,
          fullname: feature.place_name,
        }));

        if (field === "city") setCityData(data);
        if (field === "country") setCountryData(data);
      } catch (error) {
        console.log("Error fetching data for Country Autocomplete: ", error);
      }
    }
  };

  const onZoomEnd = (e) => {
    if (e.target.getZoom() < 3) {
      mapRef.current.flyTo({
        duration: 2000,
        pitch: 0,
      });
    }
  };

  const fetchCities = async (location, isUS = false) => {
    try {
      const path = isUS
        ? "/data/usacitiesdata.json"
        : "/data/worldcitiesdata.json";
      const res = await fetch(path);
      const data = await res.json();

      if (!data) {
        return {
          notFound: true,
        };
      }

      const filterKey = isUS ? "state" : "country";
      const dataArray = data.filter((region) => region[filterKey] === location);
      const regionCities = dataArray[0]?.cities;
      let topFive = [];
      regionCities &&
        regionCities.map((city) => {
          topFive.push(city.name);
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
    // Menu item for Top Cities
    <NavLink
      py={5}
      key={index}
      icon={
        <IconMapPin
          size={15}
          color={theme.colorScheme === "dark" ? "#9ff5fd" : "#fa7500"}
        />
      }
      label={
        <Flex align={"center"} fs={"italic"} fz={13} fw={600}>
          <Text
            span
            w={350}
            truncate
            sx={{
              textTransform: "capitalize",
            }}
          >
            {city.city ? city.city.toLowerCase() : city}
          </Text>
        </Flex>
      }
      sx={{
        opacity: 0.7,
        "&:hover": {
          transform: "scale(1.1) translateX(17px)",
          transition: "all 150ms ease",
          backgroundColor: "rgba(0,0,0,0)",
          opacity: 1,
        },
        "&:active": {
          transform: "scale(1)",
        },
      }}
      onClick={() => {
        getTopCitiesSpot(city.city ? city.city.toLowerCase() : city);
      }}
    />
  ));

  // TODO - goToTopCitiesSpot
  const getTopCitiesSpot = async (field) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${field}.json?country=${isoName}&autocomplete=true&&fuzzyMatch=true&limit=1&language=en&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`
      );
      const results = await response.json();
      const data = results.features.map((feature) => ({
        label: feature.label,
        place_name: feature.place_name,
        place_type: feature.place_type,
        center: feature.center,
        geometry: feature.geometry,
        text: feature.text,
        bbox: feature.bbox,
        shortcode: feature.properties.short_code,
      }));
      if (field === "city") setCityData(data);
      if (field === "country") setCountryData(data);
      goToCountry(data[0]);
    } catch (error) {
      console.log("Error fetching data for Country Autocomplete: ", error);
    }
  };

  const onClose = () => {
    mapRef.current.flyTo({
      zoom: 2.5,
      duration: 1000,
      pitch: 0,
    });
    setCitySubTitle("");
    setShowModal(false);
    setIsCity(false);
    setIsCountry(false);
    setTourListDropDown(false);
    setCityData([]);
    setCountryData([]);
    setCitySearch("");
    setCountrySearch("");
    setTopCities([]);
  };

  const showTourList = () => {
    setListOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const travelTo = () => {
    setPlaces([
      {
        place: area.label,
        region: citySubTitle,
        fullName: area.label + "," + citySubTitle,
        costs: ["FLIGHT", "HOTEL"],
      },
    ]);
    router.push("/tripplanner");
  };

  const addToTourList = () => {
    showTourList();
    if (checkPlace(placeLocation) === false) {
      addPlaces(placeLocation);
      onClose();
    } else {
      notifications.show({
        color: "red",
        style: { backgroundColor: "#2e2e2e" },
        title: "Loaction already added",
        icon: <IconAlertTriangle size={17} />,
        message: `${area.label} was already added to your tour`,
      });
    }
  };

  return (
    <>
      <Loader pageLoaded={mapLoaded} />
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
      {!searchOpened && (
        <Modal
          centered
          zIndex={100}
          opened={showModal}
          onClose={onClose}
          padding={"15px 30px 20px 30px"}
          size={"470px"}
          overlayProps={{
            opacity: 0.5,
            blur: 5,
          }}
          sx={{
            ".mantine-Modal-overlay": {
              background:
                theme.colorScheme === "dark"
                  ? theme.fn.rgba(theme.colors.dark[9], 0.5)
                  : theme.fn.rgba(theme.colors.gray[0], 0.5),
            },
          }}
          title={
            <Box>
              <Title
                order={1}
                fw={900}
                variant="gradient"
                gradient={{
                  from: `${
                    theme.colorScheme === "dark" ? "#00E8FC" : "#fa7500"
                  }`,
                  to: `${theme.colorScheme === "dark" ? "#FFF" : "#000"}`,
                  deg: 45,
                }}
                sx={{
                  textTransform: "uppercase",
                  textShadow: "0 3px 5px rgba(0, 0, 0, 0.15)",
                }}
              >
                {area.label}
              </Title>
              <Text fw={600} size="xs" color="#c0c0c0">
                {!isCountry &&
                  citySubTitle &&
                  citySubTitle.replace("ecture東京都", "., Japan")}
              </Text>
            </Box>
          }
          styles={(theme) => ({
            header: {
              backgroundColor: "transparent",
              zIndex: 1,
            },
            content: {
              backgroundColor: `${
                theme.colorScheme === "dark"
                  ? theme.fn.rgba(theme.colors.dark[7], 0.8)
                  : theme.fn.rgba(theme.colors.gray[0], 0.8)
              }`,
              overflow: "hidden",
            },
            overlay: {
              zIndex: 0,
            },
            close: {
              position: "absolute",
              top: "10px",
              right: "10px",
            },
          })}
        >
          {isCity && !isCountry && !area.state && (
            <>
              {/* Travel to Button  */}
              <Popover
                opened={tourListDropDown}
                offset={-85}
                width={"target"}
                styles={(theme) => ({
                  dropdown: {
                    backgroundColor:
                      theme.colorScheme === "dark" ? "dark.9" : "gray.0",
                    border: "none",
                    borderRadius: "0 0 3px 3px",
                    borderTop: `2px solid ${
                      theme.colorScheme === "dark"
                        ? theme.fn.rgba(theme.colors.gray[0], 0.1)
                        : theme.fn.rgba(theme.colors.dark[9], 0.1)
                    }`,
                  },
                })}
                onClick={() => {
                  if (places.length > 0) {
                    if (checkPlace(placeLocation)) {
                      travelTo();
                    } else {
                      showTourList();
                      setTourListDropDown(!tourListDropDown);
                    }
                  } else {
                    travelTo();
                  }
                }}
              >
                <Popover.Target>
                  <NavLink
                    icon={
                      <IconPlaneTilt
                        size={25}
                        color={
                          theme.colorScheme === "dark" ? "#9ff5fd" : "#fa7500"
                        }
                        opacity={0.7}
                        style={{
                          margin: "3px 2px 0 3px",
                        }}
                      />
                    }
                    variant="filled"
                    description={`Start planning a trip to ${area.label}`}
                    sx={{
                      borderLeft: "3px solid rgba(0, 0, 0, 0)",
                      "&:hover": {
                        borderLeft: `3px solid  ${
                          theme.colorScheme === "dark"
                            ? "rgba(159, 245, 253, 0.4)"
                            : "rgba(250, 117, 0, 0.4)"
                        }`,
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                    label={
                      <>
                        <Text inherit span color="dimmed">
                          Travel to{" "}
                        </Text>
                        <Text
                          inherit
                          span
                          color={
                            theme.colorScheme === "dark" ? "white" : "black"
                          }
                          size="md"
                          fw={700}
                          transform="uppercase"
                        >
                          {area.label}
                        </Text>
                      </>
                    }
                  />
                </Popover.Target>
                <Popover.Dropdown>
                  <Flex
                    align={"center"}
                    gap={3}
                    fz={12}
                    fw={100}
                    sx={{
                      textTransform: "uppercase",
                    }}
                  >
                    Clear Tour List and Travel to
                    <Text>
                      <Text span color="#81eaf4" fw={700} mx={2}>
                        {area.label}
                      </Text>
                      ?
                    </Text>
                  </Flex>
                  <Group spacing={10} mt={10} grow>
                    {/* No to Clear Tour List or Travel to */}
                    <Button
                      variant="filled"
                      opacity={0.7}
                      color="red"
                      onClick={() => {
                        setTourListDropDown(false);
                      }}
                    >
                      <IconX size={20} stroke={5} />
                    </Button>
                    {/* Yes to Clear Tour List and Travel to */}
                    <Button variant="filled" opacity={0.7} onClick={travelTo}>
                      <IconCheck size={20} stroke={5} />
                    </Button>
                  </Group>
                </Popover.Dropdown>
              </Popover>
              <LoadingOverlay
                visible={tourListDropDown}
                overlayBlur={5}
                overlayColor="#0b0c0d"
                overlayOpacity={0.15}
                zIndex={3}
                loader={<div></div>}
              />
              {/* Add to Tour List Button  */}
              <NavLink
                mb={10}
                icon={
                  <IconPlaylistAdd
                    size={25}
                    color={theme.colorScheme === "dark" ? "#9ff5fd" : "#fa7500"}
                    opacity={0.7}
                    style={{
                      margin: "3px 2px 0 3px",
                    }}
                  />
                }
                description={`Add ${area.label} to the Tour List`}
                sx={{
                  borderLeft: "3px solid rgba(0, 0, 0, 0)",
                  "&:hover": {
                    borderLeft: `3px solid  ${
                      theme.colorScheme === "dark"
                        ? "rgba(159, 245, 253, 0.4)"
                        : "rgba(250, 117, 0, 0.4)"
                    }`,
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                label={
                  <>
                    <Text color="dimmed">
                      Add to{" "}
                      <Text
                        span
                        color={theme.colorScheme === "dark" ? "white" : "black"}
                        fw={700}
                        transform="uppercase"
                      >
                        TOUR LIST
                      </Text>{" "}
                    </Text>
                  </>
                }
                onClick={addToTourList}
              />
            </>
          )}
          {!isCity && (isCountry || area.state) && (
            <Box>
              <Divider
                size="xs"
                my="xs"
                labelPosition={topCities.length === 0 ? "center" : "left"}
                label={
                  topCities.length > 0 ? (
                    <Text
                      fz={12}
                      fs={"italic"}
                      color={theme.colorScheme === "dark" ? "white" : "dark"}
                    >
                      Top {topCities.length === 1 ? "City" : "Cities"} in{" "}
                      {area.label} by population
                    </Text>
                  ) : (
                    <IconMapSearch size={20} />
                  )
                }
              />
              <Box display={topCities.length === 0 ? "none" : "block"}>
                {topCitiesList}
              </Box>
              {/* Search Cities in Selected Region */}
              {/* TODO - City Auto */}
              <Autocomplete
                icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
                placeholder={`Search for a city in ${area.label}?`}
                defaultValue=""
                value={citySearch}
                mt={15}
                size="sm"
                mb={10}
                withinPortal
                itemComponent={AutoCompItem}
                onChange={function (e) {
                  setCitySearch(e);
                  handleChange("city");
                }}
                onItemSubmit={function (e) {
                  handleSelect(e);
                  setCitySearch("");
                }}
                data={cityData}
                filter={(value, item) => item}
              />
            </Box>
          )}
        </Modal>
      )}
      {!searchOpened && visible && !mapSpin && !dropDownOpened && (
        <Flex
          justify="center"
          align="center"
          pos={"absolute"}
          bottom={"100px"}
          w={"100%"}
        >
          {/* Main Place Search */}
          {/* TODO - Country Auto */}
          <Autocomplete
            icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
            dropdownPosition="top"
            size="md"
            defaultValue=""
            itemComponent={AutoCompItem}
            value={countrySearch}
            placeholder="Where would you like to go?"
            onItemSubmit={(e) => goToCountry(e)}
            data={countryData}
            filter={(id, item) => item}
            style={{
              width: "400px",
              zIndex: 200,
            }}
            onChange={function (e) {
              setCountrySearch(e);
              handleChange("country");
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
        </Flex>
      )}
      {geoLat && geoLng && (
        <Map
          initialViewState={initialViewState}
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
          keyboard={false}
          ref={mapRef}
          onClick={(e) => {
            goToCountry(e.features[0]);
          }}
          projection="globe"
          doubleClickZoom={false}
          interactiveLayerIds={[
            "states",
            "country-boundaries",
            "clicked-state",
          ]}
          styleDiffing={true}
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
          {isCity && (
            <Marker
              color={
                theme.colorScheme === "dark"
                  ? " rgba(0, 232, 250, 0.8)"
                  : "rgba(250, 117, 0, 0.8)"
              }
              longitude={area.center[0]}
              latitude={area.center[1]}
              offsetLeft={-20}
              offsetTop={-10}
              scale={5}
              key={key}
            />
          )}
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
