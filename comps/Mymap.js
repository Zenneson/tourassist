import { useState, useEffect, useRef, useMemo } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import bbox from "@turf/bbox";
import centerOfMass from "@turf/center-of-mass";
import { atom, useRecoilState } from "recoil";
import {
  Autocomplete,
  Modal,
  Title,
  Button,
  Flex,
  Tooltip,
  Text,
  LoadingOverlay,
  Divider,
} from "@mantine/core";
import {
  IconPlaylistAdd,
  IconMapSearch,
  IconQuestionMark,
  IconLocation,
} from "@tabler/icons";
import { getNewCenter } from "../comps/getNewCenter";
import { visibleState } from "../pages/index";
import { searchOpenedState } from "../pages/index";
import { infoOpenedState } from "../comps/infoModal";
import { loginOpenedState } from "../comps/loginModal";
import { listOpenedState } from "../pages/index";

export const placeSearchState = atom({
  key: "placeSearchState",
  default: true,
});

export const mapLoadState = atom({
  key: "mapLoadState",
  default: true,
});

export const placeListState = atom({
  key: "placeListState",
  default: [],
});

export default function Mymap() {
  const mapRef = useRef();
  const center = useRef();
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
  const [places, setPlaces] = useRecoilState(placeListState);
  const [mapLoaded, setMapLoaded] = useRecoilState(mapLoadState);
  const [visible, setVisible] = useRecoilState(visibleState);
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [infoOpened, setInfoOpened] = useRecoilState(infoOpenedState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [showPlaceSearch, setShowPlaceSearch] =
    useRecoilState(placeSearchState);

  const initialViewState = {
    latitude: 35,
    longitude: -88,
    zoom: 2.5,
    pitch: 0,
  };

  const filter = useMemo(() => ["in", "name_en", regionName], [regionName]);
  useEffect(() => {
    console.log("Region Name: ", regionName);
    console.log("ISO: ", isoName);
    console.log("Place Center: ", placeLngLat);
    console.log("Places: ", places);
  }, [regionName, isoName, placeLngLat, places]);

  function goToCountry(feature) {
    if (feature == null) return;
    setIsState(feature?.properties?.STATE);
    setPlaceLngLat(feature?.center);
    let stateZoom = 3.5;
    let isSelection = true ? feature?.text : false;
    let isoName = feature?.properties?.iso_3166_1 || feature?.shortcode || "";
    let location =
      feature?.properties?.name_en ||
      feature?.properties?.NAME ||
      feature?.text ||
      "";

    let dashIndex = feature?.layer?.id.indexOf("-");
    let placeType = feature?.layer?.id.substring(0, dashIndex);
    if (isSelection) {
      placeType = feature?.place_type[0];
    }
    if (placeType === "country" || placeType === "country-boundries") {
      setIsCountry(true);
    } else {
      setIsCountry(false);
    }

    let border;
    if (feature?.text) {
      border = feature.bbox;
    } else {
      border = bbox(feature);
    }
    setBorderbox(border);

    if (location) {
      if (isSelection) {
        center.current = feature.geometry.coordinates;
      } else {
        center.current = centerOfMass(feature);
      }

      if (location === "United States") {
        setShowStates(true);
        if (isState || isSelection) {
          stateZoom = 5.5;
        }
      } else {
        setShowStates(false);
        stateZoom = null;
      }

      let mapPitch = 40;
      let orgCenter = center.current.geometry?.coordinates;
      let { newCenter, maxZoom } = getNewCenter(orgCenter, location) || {};
      if (isSelection) {
        newCenter = feature.geometry.coordinates;
      }

      let index = feature.place_name?.indexOf(",");
      let result = feature.place_name?.substring(index + 2);
      setCitySubTitle(result);
      if (
        isSelection &&
        (feature?.place_type[0] === "place" ||
          feature?.place_type[1] === "place" ||
          (feature?.place_type[0] === "region" && location === "United States"))
      ) {
        maxZoom = 12;
        mapPitch = 75;
        setIsCity(true);
      } else {
        setCitySubTitle("");
        setIsCity(false);
      }

      let currentLocation = {};
      if (placeType === "country") currentLocation = { name: location };
      if (placeType === "place" || placeType === "region")
        currentLocation = { name: location, region: result };
      if (placeType === "")
        currentLocation = { name: location, region: "United States" };
      setPlaceLocation(currentLocation);

      mapRef.current.flyTo({
        center: newCenter,
        zoom: stateZoom || 3.5,
        duration: 800,
        pitch: 0,
      });
      setTimeout(() => {
        mapRef.current.flyTo({
          center: newCenter,
          duration: 1500,
          zoom: maxZoom,
          maxZoom: maxZoom,
          pitch: mapPitch,
          linear: false,
        });
      }, 800);

      if (location !== "United States") {
        setShowModal(true);
        setShowPlaceSearch(false);
      }
    }
    setRegionName(location);
    setIsoName(isoName);
    setCityData([]);
    setCountryData([]);
  }

  const addPlaces = (place) => {
    let key = places.length + 1;
    place.id = key;
    let newPlaces = [...places, place];
    setPlaces(newPlaces);
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
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion%2Ccountry&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
        break;
      case "city":
        const [minLng, minLat, maxLng, maxLat] = borderBox;
        endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${citySearch}.json?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
        if (isCountry)
          endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${citySearch}.json?country=${isoName}&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;
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
      zoom: 3,
      duration: 1200,
      pitch: 0,
    });
    setRegionName("");
    setShowModal(false);
    setShowPlaceSearch(true);
    setIsCity(false);
  };

  const cityAutoRef = useRef(null);
  const countryAutoRef = useRef(null);

  return (
    <>
      <LoadingOverlay
        visible={mapLoaded}
        zIndex={103}
        transitionDuration={2000}
        overlayBlur={10}
        overlayOpacity={0.9}
        overlayColor="#000"
        loader={<div></div>}
        style={{ pointerEvents: "none" }}
      />
      <Modal
        centered
        opened={showModal}
        zIndex={99}
        onClose={onClose}
        overlayColor="rgba(0,0,0,1)"
        overlayOpacity={0}
        overlayBlur={5}
        transition="pop"
        transitionDuration={800}
        transitionTimingFunction="ease"
        title={
          <>
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
              {regionName}
            </Title>
            {citySubTitle && (
              <Text fw={600} size="xs" color="#fff">
                {citySubTitle}
              </Text>
            )}
          </>
        }
        styles={(theme) => ({
          modal: {
            backgroundColor: "rgba(0,0,0,0.6)",
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
        <Flex gap="xs">
          <Button
            variant="gradient"
            gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
            sx={{
              width: "90%",
            }}
          >
            <Text span color="dimmed">
              Travel to&nbsp;{" "}
            </Text>
            <Text span size="md" fw={900} transform="uppercase">
              {regionName}
            </Text>
          </Button>
          <Tooltip
            label={`Add ${regionName} to Tour`}
            position="top-end"
            withArrow
          >
            <Button
              variant="gradient"
              onClick={() => {
                addPlaces(placeLocation);
                setListOpened(true);
              }}
              gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
              sx={{
                width: "10%",
                padding: "0",
              }}
            >
              <IconPlaylistAdd size={20} />
            </Button>
          </Tooltip>
        </Flex>
        {!isCity && (
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
              placeholder={`Pick a place in ${regionName}...`}
              defaultValue=""
              value={citySearch}
              onChange={function (e) {
                const field = "city";
                setCitySearch(e);
                handleChange(field, e);
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
      {!loginOpened &&
        !infoOpened &&
        !searchOpened &&
        visible &&
        showPlaceSearch && (
          <Flex
            justify="center"
            align="center"
            gap={10}
            sx={{
              position: "absolute",
              bottom: "100px",
              width: "100%",
            }}
          >
            <Autocomplete
              icon={<IconLocation size={17} style={{ opacity: 0.2 }} />}
              size="md"
              radius="xl"
              defaultValue=""
              value={countrySearch}
              placeholder="Where in the world do you want to go?"
              onItemSubmit={(e) => handleSelect(e)}
              ref={countryAutoRef}
              data={countryData}
              filter={(value, item) => item}
              style={{
                width: "350px",
                zIndex: 100,
              }}
              onClick={function (event) {
                event.preventDefault();
                countryAutoRef.current.select();
              }}
              onChange={function (e) {
                const field = "country";
                setCountrySearch(e);
                handleChange(field, e);
              }}
            />
            <Tooltip
              label="TourAssist?"
              position="top"
              openDelay={800}
              withArrow
            >
              <Button
                onClick={() => setInfoOpened(true)}
                variant="default"
                radius="xl"
                p={10}
                style={{
                  zIndex: 100,
                }}
              >
                <IconQuestionMark size={15} />
              </Button>
            </Tooltip>
          </Flex>
        )}
      <Map
        initialViewState={initialViewState}
        maxPitch={80}
        onZoomEnd={onZoomEnd}
        onLoad={() => setMapLoaded((v) => !v)}
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
