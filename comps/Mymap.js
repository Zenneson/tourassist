import { useState, useEffect, useRef, useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl";
import bbox from "@turf/bbox";
import centerOfMass from "@turf/center-of-mass";
import {
  Autocomplete,
  Modal,
  Title,
  Button,
  Flex,
  Tooltip,
} from "@mantine/core";
import { atom, useRecoilState } from "recoil";
import { visibleState } from "../pages/index";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { IconPlaylistAdd } from "@tabler/icons";
import { getNewCenter } from "../comps/getNewCenter";

export const placeSearchState = atom({
  key: "placeSearchState",
  default: true,
});

export default function Mymap() {
  const mapRef = useRef();
  const center = useRef();
  const [regionName, setRegionName] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showStates, setShowStates] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useRecoilState(visibleState);
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
    console.log("regionName", regionName);
  }, [regionName]);

  function goToCountry(feature) {
    let stateZoom = 3.5;
    let isState = true ? feature?.properties?.NAME : false;
    let isSelection = true ? feature?.text : false;
    let place =
      feature?.properties?.name_en ||
      feature?.properties?.NAME ||
      feature?.text ||
      "";

    if (place) {
      if (isSelection) {
        center.current = feature.geometry.coordinates;
      } else {
        center.current = centerOfMass(feature);
      }

      if (place === "United States") {
        setShowStates(true);
        if (isState || isSelection) {
          stateZoom = 5;
        }
      } else {
        setShowStates(false);
        mapRef.current
          .getMap()
          .setPaintProperty(
            "country-boundaries-fill",
            "fill-color",
            "rgba( 0,232,250, .8 )"
          );
        stateZoom = null;
      }

      let orgCenter = center.current.geometry?.coordinates;
      let { newCenter, maxZoom } = getNewCenter(orgCenter, place) || {};
      if (isSelection) {
        newCenter = feature.geometry.coordinates;
      }

      mapRef.current.flyTo({
        center: newCenter,
        zoom: stateZoom || 3.5,
        duration: 800,
        pitch: initialViewState.pitch,
      });
      setTimeout(() => {
        mapRef.current.flyTo({
          center: newCenter,
          duration: 1500,
          zoom: maxZoom,
          maxZoom: maxZoom,
          pitch: 40,
          linear: false,
        });
      }, 800);

      if (place !== "United States") {
        setShowModal(true);
        setShowPlaceSearch(false);
      }
    }
    setRegionName(place);
  }

  const onEvent = (event) => {
    const feature = event.features[0];
    goToCountry(feature);
  };

  const handleSelect = (e) => {
    goToCountry(e);
  };

  const handleChange = async (e) => {
    setCountrySearch(e);

    if (countrySearch.length > 1) {
      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw&autocomplete=truetypes=region%2Ccountry&limit=5`;
        const response = await fetch(endpoint);
        const results = await response.json();
        const suggestions = results.features.map((feature) => ({
          label: feature.label,
          value: feature.place_name,
          place_name: feature.place_name,
          place_type: feature.place_type,
          center: feature.center,
          geometry: feature.geometry,
          text: feature.text,
          bbox: feature.bbox,
        }));
        setSuggestions(suggestions);
      } catch (error) {
        console.log("Error fetching data for Country Autocomplete: ", error);
      }
    }
  };

  const onZoomEnd = (e) => {
    if (e.target.getZoom() < 3) {
      mapRef.current.flyTo({
        pitch: 0,
        duration: 2000,
      });
    }
  };

  const onClose = () => {
    setShowModal(false);
    mapRef.current.flyTo({
      zoom: 3,
      duration: 1200,
      pitch: initialViewState.pitch,
    });
    setRegionName("");
    setShowPlaceSearch(true);
  };

  return (
    <>
      <Modal
        opened={showModal}
        centered
        zIndex={99}
        onClose={onClose}
        overlayColor="rgba(0,0,0,1)"
        overlayBlur={1.5}
        overlayOpacity={0.5}
        transition="pop"
        transitionDuration={800}
        transitionTimingFunction="ease"
        title={
          <Title
            order={1}
            fw={900}
            variant="gradient"
            gradient={{ from: "#00E8FC", to: "#FFF", deg: 45 }}
            sx={{
              textTransform: "uppercase",
            }}
          >
            {regionName}
          </Title>
        }
        styles={(theme) => ({
          modal: {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
          close: {
            position: "absolute",
            top: "10px",
            right: "10px",
          },
        })}
      >
        <Flex gap="xs">
          <Button
            sx={{
              width: "90%",
            }}
          >
            Travel to {regionName}
          </Button>
          <Tooltip
            label={`Add ${regionName} to Tour`}
            position="top-end"
            withArrow
          >
            <Button
              sx={{
                width: "10%",
                padding: "0",
              }}
            >
              <IconPlaylistAdd size={20} />
            </Button>
          </Tooltip>
        </Flex>
        <Flex
          align="center"
          justify="center"
          gap="xs"
          style={{ opacity: "0.15" }}
        >
          <div
            style={{
              display: "block",
              width: "48%",
              height: "1px",
              border: "1px solid #fff",
            }}
          ></div>
          <p
            style={{
              width: "4%",
              textAlign: "center",
              fontSize: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            OR
          </p>
          <div
            style={{
              display: "block",
              width: "48%",
              height: "1px",
              border: "1px solid #fff",
            }}
          ></div>
        </Flex>
        <Autocomplete placeholder={`Pick a city in ${regionName}`} data={[]} />
      </Modal>
      {visible && showPlaceSearch && (
        <Flex
          justify="center"
          sx={{
            position: "absolute",
            bottom: "100px",
            width: "100%",
          }}
        >
          <Autocomplete
            placeholder="Where in the world do you want to go?"
            size="md"
            radius="xl"
            value={countrySearch}
            onChange={(e) => handleChange(e)}
            onItemSubmit={(e) => handleSelect(e)}
            data={suggestions}
            filter={(value, item) => item}
            style={{
              width: "500px",
              zIndex: 100,
              padding: "20px",
            }}
          />
        </Flex>
      )}
      <Map
        initialViewState={initialViewState}
        maxPitch={60}
        onZoomEnd={onZoomEnd}
        // touchPitch={false}
        // touchZoomRotate={false}
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
            filter={["==", "NAME", regionName]}
          />
        </Source>
      </Map>
    </>
  );
}
