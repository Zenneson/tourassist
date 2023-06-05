import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
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
import { useLocalStorage } from "@mantine/hooks";
import {
  IconPlaylistAdd,
  IconMapSearch,
  IconLocation,
  IconPlaneTilt,
  IconFlag3,
  IconAlertTriangle,
} from "@tabler/icons";
import { notifications } from "@mantine/notifications";
import { getNewCenter } from "./getNewCenter";
import {
  listOpenedState,
  searchOpenedState,
  placeListState,
  loginOpenedState,
  profileOpenedState,
  profileShowState,
} from "../libs/atoms";
import TourList from "./tourList";

export default function Mymap() {
  const mapRef = useRef();
  const center = useRef();
  const cityAutoRef = useRef(null);
  const countryAutoRef = useRef(null);
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
  const [places, setPlaces] = useRecoilState(placeListState);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [profileShow, setProfileShow] = useRecoilState(profileShowState);
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });
  const [geoLat, setGeoLat] = useLocalStorage({
    key: "geoLatState",
    defaultValue: null,
  });
  const [geoLng, setGeoLng] = useLocalStorage({
    key: "geoLngState",
    defaultValue: null,
  });
  const [mapReady, setMapReady] = useState(false);
  const [placeData, setPlaceData] = useLocalStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
    defaultValue: true,
  });

  const initialViewState = useMemo(
    () => ({
      latitude: geoLat || 37,
      longitude: geoLng || -90,
      zoom: 2.5,
      pitch: 0,
    }),
    [geoLat, geoLng]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let { latitude, longitude } = position.coords;
        setGeoLat(latitude);
        setGeoLng(longitude);
      });
    } else {
      setGeoLat(37);
      setGeoLng(-90);
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
        name: location,
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
      if (p.name === place.name && p.region === place.region) {
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
  };

  const filter = useMemo(() => ["in", "name_en", regionName], [regionName]);

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded && !geoLat && !geoLng}
        overlayColor="#000"
        overlayOpacity={1}
        zIndex={1000}
        transitionDuration={250}
        // loader={<div></div>}
        style={{ pointerEvents: "none" }}
      />
      <Modal
        centered
        zIndex={100}
        opened={showModal}
        onClose={onClose}
        padding={"15px 30px"}
        size={"470px"}
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
          },
          overlay: {
            zIndex: 0,
          },
          close: {
            outline: "none",
            position: "absolute",
            top: "10px",
            right: "10px",
            ":focus": {
              outline: "none",
            },
          },
        })}
      >
        {isCity && !isCountry && !isState && (
          <>
            <Popover
              opened={tourListDropDown}
              offset={-60}
              closeOnClickOutside={true}
              width={"target"}
              styles={{
                dropdown: {
                  border: "none",
                },
              }}
              onClick={() => {
                if (places.length > 0) {
                  setListOpened(true);
                  setTourListDropDown(!tourListDropDown);
                } else {
                  setPlaceData([
                    {
                      place: regionName === "東京都" ? "Tokyo" : regionName,
                      region:
                        citySubTitle &&
                        citySubTitle.replace("ecture東京都", "., Japan"),
                      fullName: regionName + "," + citySubTitle,
                      costs: ["FLIGHT", "HOTEL"],
                    },
                  ]);
                  router.push("/tripplanner");
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
                    borderRadius: "5px",
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
                <Flex align={"center"} gap={3} fz={12}>
                  <IconFlag3 size={20} opacity={0.2} /> Clear Tour List and
                  Travel to
                  <Text fw={700}>
                    <Text
                      span
                      color="blue.2"
                      sx={{
                        textTransform: "uppercase",
                      }}
                    >
                      {regionName === "東京都" ? "Tokyo" : regionName}
                    </Text>
                    ?
                  </Text>
                </Flex>
                <Group spacing={10} mt={10} grow>
                  <Button
                    variant="light"
                    color="blue.0"
                    onClick={() => {
                      setListOpened(false);
                      setPlaces([]);
                      setPlaceData([
                        {
                          place: regionName === "東京都" ? "Tokyo" : regionName,
                          region:
                            citySubTitle &&
                            citySubTitle.replace("ecture東京都", "., Japan"),
                          fullName: regionName + "," + citySubTitle,
                          costs: ["FLIGHT", "HOTEL"],
                        },
                      ]);
                      router.push("/tripplanner");
                    }}
                  >
                    YES
                  </Button>
                  <Button
                    variant="light"
                    color="red.0"
                    onClick={() => {
                      setTourListDropDown(false);
                    }}
                  >
                    NO
                  </Button>
                </Group>
              </Popover.Dropdown>
            </Popover>

            <NavLink
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
                borderRadius: "5px",
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
              onClick={() => {
                setListOpened(true);
                setProfileOpened(false);
                setProfileShow(false);
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
              }}
            />
          </>
        )}
        {!isCity && (isCountry || isState) && (
          <>
            <Divider
              label={<IconMapSearch size={17} />}
              labelPosition="center"
              color="#fff"
              size="xs"
              my="xs"
              style={{
                opacity: 0.2,
              }}
            />
            <Autocomplete
              icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
              placeholder={`Where in ${
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
              ref={cityAutoRef}
              onClick={function (event) {
                event.preventDefault();
                cityAutoRef.current.select();
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
          </>
        )}
      </Modal>
      {!loginOpened && !searchOpened && visible && !mapSpin && (
        <Flex
          justify="center"
          align="center"
          pos={"absolute"}
          bottom={"100px"}
          w={"100%"}
        >
          <Autocomplete
            icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
            dropdownPosition="top"
            size="md"
            radius="xl"
            defaultValue=""
            value={countrySearch}
            placeholder="Where would you like to go?"
            onItemSubmit={(e) => handleSelect(e)}
            ref={countryAutoRef}
            data={countryData}
            filter={(value, item) => item}
            style={{
              width: "350px",
              zIndex: 98,
            }}
            onClick={function (event) {
              event.preventDefault();
              countryAutoRef.current.select();
            }}
            onChange={function (e) {
              setCountrySearch(e);
              handleChange("country", e);
            }}
          />
        </Flex>
      )}

      <Map
        initialViewState={initialViewState}
        maxPitch={80}
        onZoomEnd={onZoomEnd}
        onLoad={() => {
          setMapLoaded(true);
          localStorage.removeItem("noLogin");
        }}
        keyboard={false}
        ref={mapRef}
        onClick={onEvent}
        projection="globe"
        doubleClickZoom={false}
        interactiveLayerIds={["states", "country-boundaries", "clicked-state"]}
        mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken="pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
      >
        {visible && !searchOpened && !loginOpened && <TourList />}
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
    </>
  );
}
