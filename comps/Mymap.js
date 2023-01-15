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

  const onEvent = (event) => {
    const feature = event.features[0];

    let maxZoom = 0;
    let stateZoom = 0;
    let regionPadding = {};
    if (feature) {
      if (feature.properties.name_en) {
        setRegionName(feature.properties.name_en);
      }
      if (feature.properties.NAME) {
        setRegionName(feature.properties.NAME);
      }
      center.current = centerOfMass(feature);

      if (
        feature.properties.name_en === "United States" ||
        feature.properties.NAME
      ) {
        setShowStates(true);
        if (feature.properties.NAME && showStates) {
          mapRef.current
            .getMap()
            .setPaintProperty(
              "clicked-state",
              "fill-color",
              "rgba( 0,232,250, .9 )"
            );
          mapRef.current
            .getMap()
            .setPaintProperty(
              "country-boundaries-fill",
              "fill-color",
              "rgba( 255,255,255, 0 )"
            );
          stateZoom = 5;
          regionPadding = { top: 200, bottom: 200, left: 400, right: 400 };
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
        regionPadding = { top: 200, bottom: 200, left: 500, right: 500 };
      }

      switch (feature.properties.name_en) {
        case "United States":
          center.current.geometry.coordinates = [-98.5795, 45.8283];
          maxZoom = 4;
          break;
        case "Canada":
          center.current.geometry.coordinates = [-95.8203, 61.0447];
          maxZoom = 3.5;
          break;
        case "Russia":
          center.current.geometry.coordinates = [94.9619, 60.6359];
          maxZoom = 3.2;
          break;
        case "China":
          center.current.geometry.coordinates = [103.9924, 35.504];
          maxZoom = 3.5;
          break;
        case "Brazil":
          center.current.geometry.coordinates = [-53.1562, -10.7836];
          maxZoom = 3.5;
          break;
        case "Australia":
          center.current.geometry.coordinates = [134.0362, -26.529];
          maxZoom = 3.5;
          break;
        case "India":
          center.current.geometry.coordinates = [78.6428, 22.5644];
          maxZoom = 4.2;
          break;
        case "Argentina":
          center.current.geometry.coordinates = [-65.1886, -36.1791];
          maxZoom = 3.5;
          break;
        case "Greenland":
          center.current.geometry.coordinates = [-41.875, 71.5];
          maxZoom = 3.8;
          break;
        case "Mexico":
          center.current.geometry.coordinates = [-102.5, 23.5];
          maxZoom = 4.5;
          break;
        case "Indonesia":
          center.current.geometry.coordinates = [120.5, -2.5];
          maxZoom = 4;
          break;
        case "Sweden":
          center.current.geometry.coordinates = [18.5, 62.5];
          maxZoom = 4.3;
          break;
        case "Chile":
          center.current.geometry.coordinates = [-71.5, -40.5];
          maxZoom = 4.2;
          break;
        case "Ecuador":
          center.current.geometry.coordinates = [-78.5, -2.5];
          maxZoom = 5.5;
          break;
        case "Svalbard and Jan Mayen":
          center.current.geometry.coordinates = [20, 78];
          maxZoom = 4.5;
          break;
        case "Japan":
          center.current.geometry.coordinates = [138, 37];
          maxZoom = 4.2;
          break;
        case "Spain":
          center.current.geometry.coordinates = [-3.5, 40];
          maxZoom = 4.5;
          break;
        case "Portugal":
          center.current.geometry.coordinates = [-8, 39];
          maxZoom = 5.3;
          break;
        case "France":
          center.current.geometry.coordinates = [2, 46];
          maxZoom = 4.5;
          break;
        case "Italy":
          center.current.geometry.coordinates = [12, 42];
          maxZoom = 4.5;
          break;
        case "Algeria":
          center.current.geometry.coordinates = [3, 28];
          maxZoom = 4.5;
          break;
        case "Bahamas":
          center.current.geometry.coordinates = [-77, 24];
          maxZoom = 5.5;
          break;
        case "Democratic Republic of the Congo":
          center.current.geometry.coordinates = [25, -3];
          maxZoom = 4;
          break;
        case "Iceland":
          center.current.geometry.coordinates = [-19, 65];
          maxZoom = 4.5;
          break;
        case "Faroe Islands":
          center.current.geometry.coordinates = [-7, 62];
          maxZoom = 5.5;
          break;
      }

      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      mapRef.current.flyTo({
        center: center.current.geometry.coordinates,
        zoom: stateZoom || 3.5,
        duration: 800,
        pitch: initialViewState.pitch,
      });
      setTimeout(() => {
        mapRef.current.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            center: center.current.geometry.coordinates,
            padding: regionPadding,
            duration: 1500,
            maxZoom: maxZoom || 8,
            pitch: 50,
            linear: false,
          }
        );
      }, 800);

      if (feature.properties.name_en !== "United States") {
        setShowModal(true);
        setShowPlaceSearch(false);
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

  const handleChange = async (e) => {
    setCountrySearch(e);

    if (countrySearch.length > 2 || e) {
      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw&autocomplete=true&types=country&limit=5`;
        const response = await fetch(endpoint);
        const results = await response.json();
        setSuggestions(results.features);

        console.log(suggestions);
      } catch (error) {
        console.log("Error fetching data for Country Autocomplete: ", error);
      }
    }
  };

  const AutoCompleteItem = ({ item }) => {
    return <div key={item.id}>{item.text}</div>;
  };

  return (
    <>
      <Modal
        opened={showModal}
        centered
        zIndex={99}
        onClose={onClose}
        overlayColor="rgba(0,0,0,0.25)"
        overlayBlur={2}
        overlayOpacity={0.5}
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
        <Autocomplete
          placeholder="Where in the world do you want to go?"
          size="md"
          radius="xl"
          value={countrySearch}
          onChange={(e) => handleChange(e)}
          itemComponent={AutoCompleteItem}
          data={suggestions}
          // filter={(item) => item.text}
          filter={function (item) {
            console.log(item.text);
            return item.text;
          }}
          style={{
            position: "absolute",
            bottom: "150px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            zIndex: 100,
            padding: "20px",
          }}
        />
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
              "fill-color": "rgba(0,0,0,0)",
            }}
            filter={["==", "NAME", regionName]}
          />
        </Source>
      </Map>
    </>
  );
}
