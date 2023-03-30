import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import Map, { Marker, Source, Layer } from "react-map-gl";
import centerOfMass from "@turf/center-of-mass";
import bbox from "@turf/bbox";
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
import { useLocalStorage } from "@mantine/hooks";
import {
  IconPlaylistAdd,
  IconMapSearch,
  IconQuestionMark,
  IconLocation,
} from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { getNewCenter } from "../comps/getNewCenter";
import {
  listOpenedState,
  searchOpenedState,
  mapLoadState,
  placeListState,
  loginOpenedState,
  infoOpenedState,
  profileOpenedState,
  profileShowState,
  placeDataState,
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
  const [places, setPlaces] = useRecoilState(placeListState);
  const [mapLoaded, setMapLoaded] = useRecoilState(mapLoadState);
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [infoOpened, setInfoOpened] = useRecoilState(infoOpenedState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [profileShow, setProfileShow] = useRecoilState(profileShowState);
  const [placeData, setPlaceData] = useRecoilState(placeDataState);
  const [user, setUser] = useLocalStorage({ key: "user" });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
    defaultValue: true,
  });

  const initialViewState = {
    latitude: 37,
    longitude: -90,
    zoom: 4.2,
    pitch: 35,
  };

  useEffect(() => {
    let rotationIntervalId;
    if (mapSpin && !user) {
      rotationIntervalId = setInterval(() => {
        mapRef.current?.easeTo({
          center: [
            mapRef.current?.getCenter().lng + 0.4,
            mapRef.current?.getCenter().lat,
          ],
          duration: 50,
        });
      }, 50);
    } else {
      clearInterval(rotationIntervalId);
      setMapSpin(false);
      mapRef.current?.flyTo({
        zoom: 2.5,
        pitch: 0,
      });
    }
    return () => clearInterval(rotationIntervalId);
  }, [
    regionName,
    isoName,
    placeLngLat,
    visible,
    user,
    mapLoaded,
    mapRef,
    mapSpin,
    setMapSpin,
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
      const result = feature.place_name?.substring(index + 2);
      setCitySubTitle(result);
      setIsCity(
        isSelection &&
          (feature?.place_type.includes("place") ||
            (feature?.place_type[0] === "region" &&
              location === "United States"))
      );

      setPlaceLocation({
        name: location,
        region:
          placeType === "place" || placeType === "region"
            ? result
            : "United States",
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
      if (p.name === place.name) {
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
    setIsCity(false);
  };

  const filter = useMemo(() => ["in", "name_en", regionName], [regionName]);

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded}
        zIndex={103}
        transitionDuration={3000}
        overlayBlur={10}
        overlayOpacity={1}
        overlayColor="#000"
        loader={<div></div>}
        style={{ pointerEvents: "none" }}
      />
      <Modal
        centered
        opened={showModal}
        zIndex={98}
        onClose={onClose}
        overlayOpacity={0.35}
        overlayBlur={4}
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
            backgroundColor: "rgba(11, 12, 13, 0.95)",
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
            onClick={() => {
              setPlaceData([
                {
                  place: regionName,
                  region: citySubTitle,
                  costs: ["FLIGHT", "HOTEL"],
                },
              ]);
              router.push("/tripplanner", undefined, { shallow: true });
            }}
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
              gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
              onClick={() => {
                setListOpened(true);
                setProfileOpened(false);
                setProfileShow(false);
                if (checkPlace(placeLocation) === false) {
                  addPlaces(placeLocation);
                  onClose();
                } else {
                  showNotification({
                    color: "red",
                    style: { backgroundColor: "#2e2e2e" },
                    title: "Loaction already added",
                    message: `${regionName} was already added to your tour`,
                  });
                }
              }}
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
              placeholder={`Where in ${regionName}?`}
              defaultValue=""
              value={citySearch}
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
      {!loginOpened && !infoOpened && !searchOpened && visible && !mapSpin && (
        <Flex
          justify="center"
          align="center"
          gap={10}
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
          <Tooltip label="TourAssist?" position="top" openDelay={800} withArrow>
            <Button
              onClick={() => setInfoOpened(true)}
              variant="default"
              radius="xl"
              p={10}
              style={{
                zIndex: 98,
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
        onLoad={() => {
          if (!mapLoaded) setMapLoaded(true);
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
        {visible && !infoOpened && !searchOpened && !loginOpened && (
          <TourList />
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
    </>
  );
}
