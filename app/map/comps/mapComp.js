"use client";
import PageLoader from "@globalComps/pageLoader/pageLoader";
import { areaAtom, listAtom, searchOpenedAtom } from "@libs/atoms";
import {
  Box,
  Button,
  Dialog,
  Group,
  Modal,
  Stack,
  Text,
  Transition,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconCircleDotFilled,
  IconPlane,
  IconTextPlus,
} from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import classes from "../styles/mapComp.module.css";
import TourList from "./tourList";

export default function MapComp(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const {
    places,
    setPlaces,
    topCities,
    setLocationDrawer,
    goToLocation,
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
    rotateCamera,
  } = props;

  const searchOpened = useAtomValue(searchOpenedAtom);
  const [listOpened, setListOpened] = useAtom(listAtom);
  const area = useAtomValue(areaAtom);

  const initialViewState = {
    latitude: latitude || 37,
    longitude: longitude || -95,
    zoom: 2.5,
    pitch: 0,
  };

  const [viewState, setViewState] = useState(initialViewState);

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
          <IconCircleDotFilled size={15} className={classes.miniPopUpColor} />
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

  const destinationLabel = (
    <Dialog
      opened={false}
      onClose={() => {}}
      size={"max-content"}
      position={{ top: 20, left: 20 }}
    >
      <Stack gap={0} className={classes.popupFrame}>
        <Text
          fw={900}
          fz={40}
          variant="gradient"
          gradient={
            dark
              ? {
                  from: "#ffffff",
                  to: "rgb(160, 160, 160)",
                  deg: 45,
                }
              : { from: "#363636", to: "#000000", deg: 45 }
          }
        >
          {area.label}
        </Text>
        <Text fw={400} fz={15} c={dark ? "#fff" : "#000"}>
          {area.region !== area.country
            ? `${area.region} | ${area.country}`
            : area?.country}
        </Text>
        <Group mt={10} gap={5}>
          <Button
            leftSection={<IconPlane size={20} />}
            className={classes.blurpBtns}
            variant="subtle"
            onClick={() => choosePlace("travel")}
          >
            Travel to {area.label}
          </Button>
          <Button
            leftSection={<IconTextPlus size={20} />}
            className={classes.blurpBtns}
            variant="subtle"
            fw={400}
            onClick={() => choosePlace("tour")}
          >
            Add to{" "}
            <Text span ml={5} fw={700}>
              TOUR LIST
            </Text>
          </Button>
        </Group>
      </Stack>
    </Dialog>
  );

  const [placeBlur, setPlaceBlur] = useState(10);
  const zoomEndFunc = (e) => {
    if (e.target.getZoom() < 3.5) {
      mapRef.current?.flyTo({
        duration: 500,
        pitch: 0,
        bearing: 0,
        essential: true,
      });
    }
    if (isCity && e.target.getZoom() === 15.5) {
      rotateCamera(0);
      setPlaceBlur(0);
    } else {
      setPlaceBlur(10);
    }
  };

  return (
    <>
      <Modal
        overlayProps={{
          className: classes.smoothBlurTransition,
          backgroundOpacity: 0,
          color: dark ? "#000" : "#fff",
          blur: placeBlur,
          zIndex: 1,
        }}
        transitionProps={{
          duration: 500,
        }}
        opened={isCity}
        centered={true}
        withCloseButton={false}
        closeOnClickOutside={true}
        onClose={() => {}}
      >
        {area.label}
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
        {destinationLabel}
        {!searchOpened && (
          <TourList
            places={places}
            setPlaces={setPlaces}
            listOpened={listOpened}
            setListOpened={setListOpened}
            setLocationDrawer={setLocationDrawer}
            goToLocation={goToLocation}
          />
        )}
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
      </Map>
    </>
  );
}
