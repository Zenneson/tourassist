import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Map, { Marker, Source, Layer } from "react-map-gl";
import centerOfMass from "@turf/center-of-mass";
import bbox from "@turf/bbox";
import {
  Autocomplete,
  Box,
  Modal,
  Title,
  Flex,
  Text,
  Group,
  LoadingOverlay,
  Divider,
  NavLink,
  Popover,
  Button,
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
import { getNewCenter } from "../public/data/getNewCenter";
import TourList from "./tourList";

export default function Mymap({
  setPanelShow,
  setMainMenuOpened,
  listOpened,
  setListOpened,
  searchOpened,
  tripSelected,
  setTripSelected,
  dropDownOpened,
}) {
  const mapRef = useRef();
  const center = useRef();
  const router = useRouter();
  const [regionName, setRegionName] = useState("");
  const [citySubTitle, setCitySubTitle] = useState("");
  const [isoName, setIsoName] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cityData, setCityData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [placeLngLat, setPlaceLngLat] = useState([]);
  const [borderBox, setBorderbox] = useState([]);
  const [showStates, setShowStates] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isState, setIsState] = useState(false);
  const [isCity, setIsCity] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const [placeLocation, setPlaceLocation] = useState({});
  const [tourListDropDown, setTourListDropDown] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });
  const [topCities, setTopCities] = useState([]);
  const [cityListSet, setCityListSet] = useState(false);
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

  const filter = useMemo(() => ["in", "name_en", regionName], [regionName]);

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
            mapRef.current?.getCenter().lng + 0.4,
            mapRef.current?.getCenter().lat,
          ],
          zoom: 4.2,
          pitch: 35,
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
    regionName,
    isoName,
    placeLngLat,
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

  function goToCountry(feature) {
    if (feature == null) return;
    setIsState(feature?.properties?.STATE);
    setPlaceLngLat(feature?.center);
    let isSelection = true ? feature?.text : false;
    let isoName = feature?.properties?.iso_3166_1 || feature?.shortcode || "";

    let dashIndex = feature?.layer?.id.indexOf("-");
    let placeType = feature?.layer?.id.substring(0, dashIndex);
    placeType = isSelection ? feature?.place_type[0] : placeType;
    setIsCountry(placeType === "country" || placeType === "country-boundries");

    let border = feature?.text ? feature.bbox : bbox(feature);
    setBorderbox(border);

    let location =
      feature?.properties?.name_en ||
      feature?.properties?.NAME ||
      feature?.text ||
      "";

    if (location) {
      center.current = isSelection
        ? feature.geometry.coordinates
        : centerOfMass(feature);
      setShowStates(location === "United States");

      const { newCenter, maxZoom } =
        getNewCenter(center.current.geometry?.coordinates, location) || {};
      const index = feature.place_name?.indexOf(",");
      let result = feature.place_name?.substring(index + 1);
      {
        feature.layer?.source === "states-boundaries"
          ? (result = "United States")
          : result;
      }
      setCitySubTitle(result);
      setIsCity(
        isSelection &&
          (feature?.place_type.includes("place") ||
            (feature?.place_type[0] === "region" &&
              location === "United States"))
      );

      setPlaceLocation({
        place: location,
        region: result,
      });

      mapRef.current.flyTo({
        center: isSelection ? feature.geometry.coordinates : newCenter,
        zoom:
          location === "United States" && (isState || isSelection) ? 5.5 : 3.5,
        duration: 800,
        pitch: 0,
      });

      setTimeout(() => {
        mapRef.current.flyTo({
          center: isSelection ? feature.geometry.coordinates : newCenter,
          duration: 1500,
          zoom:
            isSelection &&
            (feature?.place_type.includes("place") ||
              (feature?.place_type[0] === "region" &&
                location === "United States"))
              ? 12
              : maxZoom,
          maxZoom: maxZoom,
          pitch:
            isSelection &&
            (feature?.place_type.includes("place") ||
              (feature?.place_type[0] === "region" &&
                location === "United States"))
              ? 75
              : 40,
          linear: false,
        });
      }, 400);

      if (location !== "United States") {
        setShowModal(true);
      }
    }

    if (
      feature.layer?.source === "states-boundaries" ||
      location === "United States"
    ) {
      setCitySubTitle("United States");
      fetchUSCities(location);
    } else if (feature.layer?.source === "country-boundaries") {
      if (
        location === "Angola" ||
        location === "Nigeria" ||
        location === "Russia" ||
        location === "United Arab Emirates" ||
        location === "United Kingdom"
      ) {
        fetchAltCities(location);
      } else {
        fetchWorldCities(location);
      }
    }
    setRegionName(location);
    setIsoName(isoName);
    setCityData([]);
    setCountryData([]);
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

  const onEvent = (event) => {
    const feature = event.features[0];
    goToCountry(feature);
  };

  const handleSelect = (e) => {
    goToCountry(e);
  };

  const handleChange = async (field, e) => {
    let endpoint;
    switch (field) {
      case "country":
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&autocomplete=true&&fuzzyMatch=true&types=place%2Ccountry&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
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
          label: feature.label,
          value: feature.place_name,
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

  const fetchWorldCities = async (regionName) => {
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: `${regionName}`,
          }),
        }
      );
      const data = await res.json();
      setCityListSet(true);

      if (!data) {
        return {
          notFound: true,
        };
      }
      let dataArray = Object.keys(data.data).map((key) => {
        return data.data[key];
      });
      dataArray.sort(
        (a, b) => b.populationCounts[0].value - a.populationCounts[0].value
      );
      let topFive = dataArray.slice(0, 5);
      setTopCities(topFive);
    } catch (error) {
      console.error("Error:", error);
      return {
        notFound: true,
      };
    }
  };

  const fetchAltCities = async (regionName) => {
    try {
      const res = await fetch("/data/alt_cities.json");
      const data = await res.json();
      setCityListSet(true);

      if (!data) {
        return {
          notFound: true,
        };
      }

      const dataArray = data.filter(
        (country) => country.country === regionName
      );
      const countryCities = dataArray[0]?.cities;
      let topFive = [];
      countryCities &&
        countryCities.map((city) => {
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

  const fetchUSCities = async (regionName) => {
    try {
      const res = await fetch("/data/usa_cities_june2023.json");
      const data = await res.json();
      setCityListSet(true);

      if (!data) {
        return {
          notFound: true,
        };
      }

      const dataArray = data.filter((state) => state.state === regionName);
      const stateCities = dataArray[0]?.cities;
      let topFive = [];
      stateCities &&
        stateCities.map((city) => {
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
      icon={<IconMapPin size={15} color="#9ff5fd" />}
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
          color: "#fff",
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

  const getTopCitiesSpot = async (field, e) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${field}.json?country=${isoName}&autocomplete=true&&fuzzyMatch=true&types=place&limit=1&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`
      );
      const results = await response.json();
      const data = results.features.map((feature) => ({
        label: feature.label,
        value: feature.place_name,
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
    setRegionName("");
    setShowModal(false);
    setIsCity(false);
    setTourListDropDown(false);
    setCityData([]);
    setCountryData([]);
    setCitySearch("");
    setCountrySearch("");
    setTopCities([]);
    setCityListSet(false);
  };

  const showTourList = () => {
    setListOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const travelTo = () => {
    setTripSelected(true);
    setPlaces([
      {
        place: regionName === "東京都" ? "Tokyo" : regionName,
        region:
          citySubTitle && citySubTitle.replace("ecture東京都", "., Japan"),
        fullName: regionName + "," + citySubTitle,
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
        message: `${
          regionName === "東京都" ? "Tokyo" : regionName
        } was already added to your tour`,
      });
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded || tripSelected}
        overlayColor="#0b0c0d"
        overlayOpacity={1}
        zIndex={1000}
        transitionDuration={250}
        // loader={<div></div>}
        style={{ pointerEvents: "none" }}
      />
      {places.length >= 1 && !listOpened && (
        // Tour List Button
        <Button
          onClick={showTourList}
          sx={{
            backgroundColor: "#020202",
            opacity: 0.7,
            borderRadius: "0 3px 3px 0",
            position: "absolute",
            top: "134px",
            left: "0",
            padding: "0 8px",
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
          <IconList size={15} />
        </Button>
      )}
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
        title={
          <Box mb={isCountry || isState ? -15 : 0}>
            <Title
              order={1}
              fw={900}
              variant="gradient"
              gradient={{ from: "#00E8FC", to: "#FFF", deg: 45 }}
              sx={{
                textTransform: "uppercase",
                textShadow: "0 3px 5px rgba(0, 0, 0, 0.15)",
              }}
            >
              {regionName === "東京都" ? "Tokyo" : regionName}
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
            backgroundColor: "rgba(11, 12, 13, 0)",
            zIndex: 1,
          },
          content: {
            backgroundColor: "rgba(11, 12, 13, 0.8)",
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
        {isCity && !isCountry && !isState && (
          <>
            {/* Travel to Button  */}
            <Popover
              opened={tourListDropDown}
              offset={-85}
              width={"target"}
              styles={{
                dropdown: {
                  backgroundColor: "rgba(7, 7, 7, 1)",
                  border: "none",
                  borderRadius: "0 0 3px 3px",
                  borderTop: "2px solid rgba(255, 255, 255, 0.3)",
                },
              }}
              onClick={() => {
                if (places.length > 0) {
                  showTourList();
                  setTourListDropDown(!tourListDropDown);
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
                      color="#9ff5fd"
                      opacity={0.7}
                      style={{
                        margin: "3px 2px 0 3px",
                      }}
                    />
                  }
                  variant="filled"
                  description={`Start planning a trip to ${
                    regionName === "東京都" ? "Tokyo" : regionName
                  }`}
                  sx={{
                    borderLeft: "3px solid rgba(0, 0, 0, 0)",
                    "&:hover": {
                      borderLeft: "3px solid  rgba(159, 245, 253, 0.4)",
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
                        color="white"
                        size="md"
                        fw={700}
                        transform="uppercase"
                      >
                        {regionName === "東京都" ? "Tokyo" : regionName}
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
                      {regionName === "東京都" ? "Tokyo" : regionName}
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
                  color="#9ff5fd"
                  opacity={0.7}
                  style={{
                    margin: "3px 2px 0 3px",
                  }}
                />
              }
              description={`Add ${
                regionName === "東京都" ? "Tokyo" : regionName
              } to the Tour List`}
              sx={{
                borderLeft: "3px solid rgba(0, 0, 0, 0)",
                "&:hover": {
                  borderLeft: "3px solid  rgba(159, 245, 253, 0.4)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
              label={
                <>
                  <Text color="dimmed">
                    Add to{" "}
                    <Text span color="white" fw={700} transform="uppercase">
                      TOUR LIST
                    </Text>{" "}
                  </Text>
                </>
              }
              onClick={addToTourList}
            />
          </>
        )}
        {!isCity && (isCountry || isState) && (
          <Box>
            <LoadingOverlay
              overlayOpacity={0.7}
              overlayBlur={3}
              visible={cityListSet === false}
            />
            <Divider
              label={
                topCities.length > 0 ? (
                  <Text fz={12} fs={"italic"}>
                    Top {topCities.length === 1 ? "City" : "Cities"} in{" "}
                    {regionName === "東京都" ? "Tokyo" : regionName} by
                    population
                  </Text>
                ) : (
                  <IconMapSearch size={20} />
                )
              }
              labelPosition={topCities.length === 0 ? "center" : "left"}
              size="xs"
              my="xs"
              style={{
                opacity: 0.7,
              }}
            />
            <Box display={topCities.length === 0 ? "none" : "block"}>
              {topCitiesList}
            </Box>
            {/* Search Cities in Selected Region */}
            <Autocomplete
              mt={15}
              variant={"filled"}
              icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
              placeholder={`Search for a city in ${
                regionName === "東京都" ? "Tokyo" : regionName
              }?`}
              defaultValue=""
              value={citySearch}
              size="sm"
              mb={10}
              withinPortal
              onChange={function (e) {
                setCitySearch(e);
                handleChange("city", e);
              }}
              onItemSubmit={function (e) {
                handleSelect(e);
                setCitySearch("");
              }}
              data={cityData}
              filter={(value, item) => item}
              styles={(theme) => ({
                input: {
                  "::placeholder": {
                    color: "rgba(255,255,255,0.5)",
                  },
                },
              })}
            />
          </Box>
        )}
      </Modal>
      {!searchOpened && visible && !mapSpin && !dropDownOpened && (
        <Flex
          justify="center"
          align="center"
          pos={"absolute"}
          bottom={"100px"}
          w={"100%"}
        >
          {/* Main Place Search */}
          <Autocomplete
            icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
            dropdownPosition="top"
            variant={"filled"}
            size="md"
            radius="xl"
            defaultValue=""
            value={countrySearch}
            placeholder="Where would you like to go?"
            onItemSubmit={(e) => handleSelect(e)}
            data={countryData}
            filter={(value, item) => item}
            style={{
              width: "350px",
              zIndex: 98,
            }}
            onChange={function (e) {
              setCountrySearch(e);
              handleChange("country", e);
            }}
          />
        </Flex>
      )}
      {geoLat && geoLng && (
        <Map
          initialViewState={initialViewState}
          maxPitch={80}
          onZoomEnd={onZoomEnd}
          onLoad={() => {
            setMapLoaded(true);
            setTripSelected(false);
            sessionStorage.removeItem("noLogin");
          }}
          keyboard={false}
          ref={mapRef}
          onClick={(e) => {
            onEvent(e);
          }}
          projection="globe"
          doubleClickZoom={false}
          interactiveLayerIds={[
            "states",
            "country-boundaries",
            "clicked-state",
          ]}
          mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
          style={{ width: "100%", height: "100%" }}
          mapboxAccessToken="pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
        >
          {visible && !searchOpened && (
            <TourList
              setTripSelected={setTripSelected}
              listOpened={listOpened}
              setListOpened={setListOpened}
              places={places}
              setPlaces={setPlaces}
            />
          )}
          {isCity && (
            <Marker
              longitude={placeLngLat[0]}
              latitude={placeLngLat[1]}
              offsetLeft={-20}
              offsetTop={-10}
              scale={4.5}
            ></Marker>
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
                "fill-color": "rgba( 0,232,250, .8 )",
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
                "fill-color": "rgba( 0,232,250, .8 )",
              }}
              filter={isCity ? false : ["==", "NAME", regionName]}
            />
          </Source>
        </Map>
      )}
    </>
  );
}
