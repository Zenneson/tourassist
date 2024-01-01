"use client";
import PageLoader from "@mainComps/pageLoader/pageLoader";
import { useMapState } from "@libs/store";
import {
  Box,
  Button,
  Card,
  CardSection,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  Title,
  Transition,
  useComputedColorScheme,
} from "@mantine/core";
import { IconPlane, IconTextPlus } from "@tabler/icons-react";
import { timer } from "d3-timer";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import classes from "../styles/mapComp.module.css";

export default function MapComp(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const {
    topCities,
    showStates,
    locationHandler,
    mapboxAccessToken,
    selectTopCity,
    choosePlace,
    latitude,
    longitude,
    mapLoaded,
    setMapLoaded,
    mapRef,
    fullMapRef,
    isRotating,
    setIsRotating,
  } = props;

  const { area } = useMapState();

  const initialViewState = {
    latitude: latitude || 37,
    longitude: longitude || -95,
    bearing: 0,
    zoom: 2.5,
    pitch: 0,
  };

  const pins = topCities.map((city, index) => (
    <Transition
      key={`marker-${index}`}
      mounted={topCities}
      transition="fade"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Marker
          style={styles}
          longitude={city[1][0]}
          latitude={city[1][1]}
          offset={[0, 0]}
          rotation={40}
          rotationAlignment="map"
          pitchAlignment="map"
        >
          <Popup
            className={classes.miniPopUp}
            anchor="bottom"
            offset={[1, -4]}
            closeOnMove={false}
            closeButton={false}
            closeOnClick={false}
            longitude={city[1][0]}
            latitude={city[1][1]}
            onClick={() => selectTopCity(city)}
          >
            <Box py={10} px={20} onClick={() => selectTopCity(city)}>
              {city[0]}
            </Box>
          </Popup>
        </Marker>
      )}
    </Transition>
  ));

  const getFogProperties = (dark) => {
    return {
      color: dark ? "#0f2e57" : "#fff",
      "high-color": dark ? "#000" : "#245cdf",
      "space-color": dark
        ? ["interpolate", ["linear"], ["zoom"], 4, "#010b19", 7, "#367ab9"]
        : ["interpolate", ["linear"], ["zoom"], 4, "#fff", 7, "#fff"],
    };
  };

  useEffect(() => {
    if (fullMapRef && mapLoaded) {
      const fogProps = getFogProperties(dark);
      fullMapRef.setFog(fogProps);
    }
  }, [dark, fullMapRef, mapLoaded]);

  const isCity =
    area.type === "city" ||
    (area.type === "region" && area.country !== "United States");

  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    let rotateTimer;
    if (isRotating) {
      rotateTimer = timer((elapsed) => {
        setBearing((elapsed / 100) % 360);
      });
    }

    return () => {
      if (rotateTimer) rotateTimer.stop();
    };
  }, [isRotating]);

  const [viewState, setViewState] = useState({
    ...initialViewState,
    bearing,
  });

  useEffect(() => {
    setViewState((prevState) => ({ ...prevState, bearing }));
  }, [bearing]);

  const [placeBlur, setPlaceBlur] = useState(15);
  const zoomEndFunc = (e) => {
    if (e.target.getZoom() < 3.5) {
      mapRef.current?.flyTo({
        duration: 500,
        pitch: 0,
        bearing: 0,
        essential: true,
      });
    }
    if (isCity && e.target.getZoom() === 15) {
      setIsRotating(true);
      setPlaceBlur(0);
    } else {
      setIsRotating(false);
      setPlaceBlur(15);
    }
  };

  return (
    <>
      {/* Place Card Modal  */}
      <Modal
        classNames={{ content: classes.placesCardModal }}
        overlayProps={{
          className: classes.smoothBlurTransition,
          backgroundOpacity: 0,
          color: dark ? "#000" : "#fff",
          blur: placeBlur,
          zIndex: 1,
        }}
        transitionProps={{
          duration: 1000,
        }}
        autoFocus={false}
        trapFocus={false}
        zIndex={120}
        opened={isCity}
        centered={true}
        withCloseButton={false}
        closeOnClickOutside={true}
        padding={0}
        onClose={() => {}}
      >
        <Card
          radius={3}
          bg={"rgba(255, 255, 255, 0)"}
          classNames={{ root: classes.placesCard }}
        >
          <CardSection>
            <Image src="/img/intro/coast.jpg" h={200} alt={area.label} />
          </CardSection>
          <Group>
            <Stack gap={0} mt={10}>
              <Title order={3}>{area.label}</Title>
              <Text fz={12}>
                {area.region !== area.country
                  ? `${area.region} | ${area.country}`
                  : area?.country}
              </Text>
            </Stack>
          </Group>
          <Text
            fz={12}
            mt={10}
            pl={10}
            style={{
              borderLeft: `2px solid ${
                dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
              }`,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Text>
          <Group justify="flex-end" gap={10} mt={10}>
            <Button.Group className={classes.chooseLocationBox}>
              <Button
                className={classes.locationBtns}
                justify={"left"}
                variant="subtle"
                size="xs"
                leftSection={<IconPlane size={18} />}
                onClick={() => choosePlace("travel")}
              >
                Travel to {area.label}
              </Button>
              <Button
                className={classes.locationBtns}
                justify={"left"}
                variant="subtle"
                size="xs"
                leftSection={<IconTextPlus size={18} />}
                onClick={() => choosePlace("tour")}
              >
                Add to Tour List
              </Button>
            </Button.Group>
          </Group>
        </Card>
      </Modal>
      <PageLoader contentLoaded={mapLoaded} />
      <Map
        id="mapRef"
        ref={mapRef}
        {...viewState}
        projection="globe"
        antialias="true"
        onZoomEnd={zoomEndFunc}
        initialViewState={initialViewState}
        renderWorldCopies={true}
        styleDiffing={false}
        maxPitch={80}
        maxZoom={18}
        minZoom={2}
        reuseMaps={true}
        touchPitch={false}
        doubleClickZoom={false}
        mapboxAccessToken={mapboxAccessToken}
        fadeDuration={500}
        interactiveLayerIds={["states", "country-boundaries", "clicked-state"]}
        onMove={(e) => {
          setViewState(e.viewState);
        }}
        onLoad={(e) => {
          if (!mapLoaded) {
            setMapLoaded(true);
          }
        }}
        onClick={(e) => {
          locationHandler(e.features[0], mapRef);
        }}
        mapStyle={"mapbox://styles/zenneson/clpulpdqh00wr01p72idm835c"}
        style={{
          width: "100%",
          height: "100vh",
          pointerEvents: isCity && "none",
        }}
      >
        {computedColorScheme ? pins : {}}
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
              "fill-opacity-transition": {
                duration: 300,
                delay: 0,
              },
            }}
          />
          <Layer
            id="country-boundaries-fill"
            source="country-boundaries"
            source-layer="country_boundaries"
            type="fill"
            filter={
              !showStates
                ? ["in", "name_en", area.label]
                : ["in", "name", "United States"]
            }
            paint={{
              "fill-color": `${
                dark ? " rgba(13, 64, 130, 0.8)" : "rgba(0, 232, 250, 0.8)"
              }`,
              "fill-opacity-transition": {
                duration: 250,
                delay: 0,
              },
            }}
          />
          <Layer
            id="country-boundaries-lines"
            source="country-boundaries"
            source-layer="country_boundaries"
            type="line"
            filter={["in", "name_en", area.label]}
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
              "fill-opacity-transition": {
                duration: 250,
                delay: 0,
              },
            }}
            filter={
              !showStates
                ? ["in", "name_en", area.label]
                : ["!", ["in", "name", ""]]
            }
          />
          <Layer
            id="states-boundaries"
            type="line"
            source="states-boundaries"
            paint={{
              "line-color": "rgba(255, 255, 255, 1)",
              "line-width": 4,
              "line-opacity-transition": {
                duration: 300,
                delay: 0,
              },
            }}
            filter={
              !showStates
                ? ["in", "name_en", area.label]
                : ["!", ["in", "name", ""]]
            }
          />
        </Source>
        <Source id="clicked-state" type="geojson" data="data/states.geojson">
          <Layer
            id="clicked-state"
            type="fill"
            source="clicked-state"
            paint={{
              "fill-color": `${
                dark ? " rgba(13, 64, 130, 0.8)" : "rgba(0, 232, 250, 0.8)"
              }`,
              "fill-opacity-transition": {
                duration: 250,
                delay: 0,
              },
            }}
            filter={["==", "NAME", area.label]}
          />
          <Layer
            id="state-borders"
            type="line"
            source="clicked-state"
            paint={{
              "line-color": "rgba(255, 255, 255, 1)",
              "line-width": 6,
              "line-opacity-transition": {
                duration: 300,
                delay: 0,
              },
            }}
            filter={["==", "NAME", area.label]}
          />
        </Source>
        <Source
          id="buildings"
          type="vector"
          url="mapbox://mapbox.mapbox-streets-v8"
        >
          <Layer
            id="building"
            type="fill-extrusion"
            source="buildings"
            source-layer="building"
            filter={["==", ["get", "extrude"], "true"]}
            paint={{
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                "rgb(255, 255, 255)",
                100,
                "rgba(112, 189, 219, 0.8)",
                200,
                "rgba(45, 138, 174, 0.8)",
                300,
                "rgba(170, 219, 238, 0.8)",
                400,
                "rgba(118, 187, 214, 0.05)",
                430,
                "rgba(101, 198, 236, 0.98)",
                500,
                "rgb(255, 255, 255)",
                600,
                "rgba(150, 223, 237, 0.8)",
                700,
                "rgba(191, 217, 227, 0.8)",
                900,
                "rgba(191, 217, 227, 0.8)",
                1000,
                "rgba(79, 163, 196, 0.8)",
                1200,
                "rgba(36, 104, 143, 0.8)",
                1300,
                "rgba(166, 217, 237, 0.8)",
                1400,
                "rgba(177, 194, 201, 0.8)",
                1500,
                "rgba(255, 255, 255, 0.8)",
              ],
              "fill-extrusion-ambient-occlusion-ground-attenuation": 1,
              "fill-extrusion-rounded-roof": false,
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-vertical-gradient": false,
              "fill-extrusion-opacity": 0.75,
            }}
          />
        </Source>
      </Map>
    </>
  );
}

// This is a hack to prevent the following error from showing up in the console:
// Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
const error = console.error;
console.error = (...args) => {
  if (/Maximum update depth exceeded/.test(args[0])) return;
  error(...args);
};
