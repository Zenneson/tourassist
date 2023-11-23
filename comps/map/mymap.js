"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Map, { Source, Layer } from "react-map-gl";
import { usePrevious } from "@mantine/hooks";
import {
  useComputedColorScheme,
  Center,
  Box,
  Button,
  Text,
  Group,
  Modal,
  LoadingOverlay,
  Tooltip,
  Transition,
} from "@mantine/core";
import { IconList, IconCheck } from "@tabler/icons-react";
import { useAtom } from "jotai";
import {
  placesAtom,
  handleChange,
  goToLocation,
  locationHandler,
  areaAtom,
  topCitiesAtom,
  lngLatAtom,
  countrySearchAtom,
  placeSearchAtom,
  countrySearchDataAtom,
  placeSearchDataAtom,
  showMainMarkerAtom,
  showStatesAtom,
  locationDrawerAtom,
  listStatesAtom,
  showModalAtom,
  placeLocationAtom,
} from "./mapHooks";
import TourList from "./tourList";
import PopUpMarker from "./popUpMarker";
import LocationDrawer from "./locationDrawer";
import CustomAutoComplete from "./customAutoComplete";
import classes from "./mymap.module.css";

const fadeOut = { opacity: 0 };
const fadeIn = { opacity: 1 };

export default function Mymap(props) {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const {
    listOpened,
    setListOpened,
    searchOpened,
    dropDownOpened,
    mapLoaded,
    setMapLoaded,
    mainMenuOpened,
    setMainMenuOpened,
    panelShow,
    setPanelShow,
    country_center,
  } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const router = useRouter();

  const mapRef = useRef();
  const fullMapRef = mapRef.current?.getMap();
  const [area, setArea] = useAtom(areaAtom);
  const [topCities, setTopCities] = useAtom(topCitiesAtom);
  const [lngLat, setLngLat] = useAtom(lngLatAtom);
  const [locationDrawer, setLocationDrawer] = useAtom(locationDrawerAtom);
  const [showStates, setShowStates] = useAtom(showStatesAtom);
  const [showMainMarker, setShowMainMarker] = useAtom(showMainMarkerAtom);
  const [countrySearch, setCountrySearch] = useAtom(countrySearchAtom);
  const [placeSearch, setPlaceSearch] = useAtom(placeSearchAtom);
  const [placeSearchData, setPlaceSearchData] = useAtom(placeSearchDataAtom);
  const [countrySearchData, setCountrySearchData] = useAtom(
    countrySearchDataAtom
  );
  const [listStates] = useAtom(listStatesAtom);
  const [places, setPlaces] = useAtom(placesAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [placeLocation, setPlaceLocation] = useAtom(placeLocationAtom);

  const latitude = country_center[1];
  const longitude = country_center[0];
  const initialViewState = {
    latitude: latitude,
    longitude: longitude,
    zoom: 2.5,
    pitch: 0,
  };
  const [viewState, setViewState] = useState(initialViewState);

  useEffect(() => {
    router.prefetch("/tripplanner");
    area.label === "United States" && setShowStates(true);
    (area.type === "city" ||
      (area.type === "region" && area.country !== "United States")) &&
      setShowMainMarker(true);
  }, [area, router, setShowMainMarker, setShowStates]);

  const getFogProperties = (dark) => {
    return {
      color: dark ? "#0f2e57" : "#fff",
      "high-color": dark ? "#000" : "#245cdf",
      "space-color": dark
        ? ["interpolate", ["linear"], ["zoom"], 4, "#010b19", 7, "#367ab9"]
        : ["interpolate", ["linear"], ["zoom"], 4, "#fff", 7, "#fff"],
    };
  };

  const animateLayerOpacity = (
    map,
    layerId,
    layerType,
    startOpacity,
    endOpacity,
    duration
  ) => {
    const startTime = performance.now();
    const opacityProperty =
      layerType === "line" ? "line-opacity" : "fill-opacity";
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = elapsed / duration;
      const opacity = Math.max(
        0,
        Math.min(1, progress * (endOpacity - startOpacity) + startOpacity)
      );
      map.setPaintProperty(layerId, opacityProperty, opacity);
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (fullMapRef && mapLoaded) {
      const fogProperties = getFogProperties(dark);
      fullMapRef.setFog(fogProperties);

      // Animate Fill layer
      animateLayerOpacity(
        fullMapRef,
        "country-boundaries-fill",
        "fill",
        0,
        1,
        500
      );
      animateLayerOpacity(fullMapRef, "states", "fill", 0, 1, 250);
      animateLayerOpacity(fullMapRef, "clicked-state", "fill", 0, 1, 250);

      // Animate Line layer
      animateLayerOpacity(
        fullMapRef,
        "country-boundaries-lines",
        "line",
        0,
        1,
        500
      );
      animateLayerOpacity(fullMapRef, "states-boundaries", "line", 0, 1, 250);
      animateLayerOpacity(fullMapRef, "state-borders", "line", 0, 1, 250);
    }
  }, [fullMapRef, mapLoaded, dark]);

  const onZoomEnd = (e) => {
    if (e.target.getZoom() < 3.5) {
      mapRef.current?.flyTo({
        duration: 1000,
        pitch: 0,
        essential: true,
      });
    }
  };

  const selectTopCity = (city) => {
    setTopCities([]);
    const cityData = {
      label: city[0],
      type: "city",
      country: area.country,
      center: city[1],
      region: city[2],
    };
    setLngLat(city[1]);
    goToLocation(cityData, mapRef);
  };

  const resetMap = () => {
    mapRef.current.flyTo({
      zoom: 2.5,
      duration: 1000,
      pitch: 0,
      essential: true,
    });
  };

  const clearData = () => {
    setArea({ label: "" });
    setLocationDrawer(false);
    setLngLat([0, 0]);
    setTopCities([]);
    setPlaceSearchData([]);
    setCountrySearchData([]);
    setPlaceSearch("");
    setCountrySearch("");
    setShowStates(false);
    setShowMainMarker(false);
  };

  const resetGlobe = () => {
    resetMap();
    setTimeout(clearData, 200);
  };

  const [prevArea, setPrevArea] = useState({ label: "" });
  const oldArea = usePrevious(area);
  useEffect(() => {
    if (JSON.stringify(area) !== JSON.stringify(oldArea)) {
      setPrevArea(oldArea);
    }
  }, [area, oldArea]);

  const openTourList = () => {
    setListOpened(true);
    setMainMenuOpened(false);
    setPanelShow(false);
  };

  const placeChoosen = () => {
    setShowModal(false);
  };

  const [buttonAnimation, setButtonAnimation] = useState(fadeIn);
  const [buttonPosition, setButtonPosition] = useState(0);

  useEffect(() => {
    setButtonAnimation(fadeOut);

    const timeout = setTimeout(() => {
      setButtonPosition(
        panelShow && mainMenuOpened ? 920 : mainMenuOpened ? 310 : 0
      );
      setButtonAnimation(fadeIn);
    }, 10);

    return () => clearTimeout(timeout);
  }, [panelShow, mainMenuOpened]);

  return (
    <>
      <LoadingOverlay
        visible={!mapLoaded}
        overlayProps={{ backgroundOpacity: 1 }}
      />
      <Modal
        classNames={{
          root: classes.destinationModal,
          content: classes.destinationModalContent,
          overlay: classes.destinationModalOverlay,
        }}
        size={"auto"}
        zIndex={130}
        opened={showModal}
        onClose={setShowModal}
        withCloseButton={false}
        padding={"md"}
        centered
      >
        <Text fz={14} ta={"center"} mb={10}>
          {places && places.length > 0 ? "Clear the Tour List and c" : "C"}
          ontinue with{" "}
          <Text fw={700} span>
            {area.label}
          </Text>{" "}
          as your destination?
        </Text>
        <Group grow gap={10}>
          <Button
            className={classes.clearListButton}
            size="lg"
            color="green.9"
            variant="light"
            leftSection={<IconCheck stroke={4} />}
            onClick={() => {
              placeChoosen();
              setPlaces(placeLocation);
              router.push("/tripplanner");
            }}
          >
            YES
          </Button>
          <Button
            className={classes.clearListButton}
            size="lg"
            color="red.9"
            variant="light"
            leftSection={<IconCheck stroke={4} />}
            onClick={() => setShowModal(false)}
          >
            NO
          </Button>
        </Group>
      </Modal>
      <LocationDrawer
        mapRef={mapRef}
        area={area}
        prevArea={prevArea}
        topCities={topCities}
        mapLoaded={mapLoaded}
        locationDrawer={locationDrawer}
        setLocationDrawer={setLocationDrawer}
        selectTopCity={selectTopCity}
        resetGlobe={resetGlobe}
        placeSearch={placeSearch}
        setPlaceSearch={setPlaceSearch}
        placeSearchData={placeSearchData}
        listStates={listStates}
      />
      {places && places.length >= 1 && !listOpened && (
        <motion.div
          initial={fadeIn}
          animate={buttonAnimation}
          transition={{ duration: 0.01 }}
        >
          {/* Tour List Button */}
          <Tooltip
            classNames={{ tooltip: "toolTip" }}
            position="bottom"
            label={"Tour List"}
            openDelay={500}
          >
            <Button
              className={classes.tourListButton}
              onClick={openTourList}
              style={{
                left: buttonPosition,
                color: dark ? "#fff" : "#000",
              }}
            >
              <IconList
                size={15}
                style={{
                  color: dark ? "#fff" : "#000",
                }}
              />
            </Button>
          </Tooltip>
        </motion.div>
      )}
      <Transition
        mounted={!searchOpened && !dropDownOpened && !locationDrawer}
        transition="slide-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Center
            className={classes.countryAutoCompleteZIndex}
            pos={"absolute"}
            top={"30px"}
            w={"100%"}
            style={styles}
          >
            {/* Main Place Search */}
            <Box pos={"relative"}>
              <CustomAutoComplete
                version={"country"}
                mapRef={mapRef}
                dark={dark}
                countrySearchData={countrySearchData}
                countrySearch={countrySearch}
                setCountrySearch={setCountrySearch}
                handleChange={handleChange}
              />
            </Box>
          </Center>
        )}
      </Transition>
      <Map
        id="mapRef"
        ref={mapRef}
        {...viewState}
        onMove={(e) => {
          setViewState(e.viewState);
        }}
        initialViewState={initialViewState}
        renderWorldCopies={true}
        styleDiffing={false}
        maxPitch={80}
        onZoomEnd={onZoomEnd}
        maxZoom={14}
        minZoom={2}
        reuseMaps={true}
        onLoad={(e) => {
          setMapLoaded(true);
          const fogProperties = getFogProperties(dark);
          e.target.setFog(fogProperties);
        }}
        touchPitch={false}
        onClick={(e) => {
          locationHandler(e.features[0], mapRef);
        }}
        projection="globe"
        doubleClickZoom={false}
        interactiveLayerIds={["states", "country-boundaries", "clicked-state"]}
        mapStyle={"mapbox://styles/zenneson/clm07y8pz01ur01qieykmcji3"}
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={mapboxAccessToken}
      >
        {!searchOpened && (
          <TourList
            mapRef={mapRef}
            places={places}
            setPlaces={setPlaces}
            listOpened={listOpened}
            setListOpened={setListOpened}
            setLngLat={setLngLat}
            setLocationDrawer={setLocationDrawer}
          />
        )}
        <PopUpMarker
          area={area}
          lngLat={lngLat}
          topCities={topCities}
          showMainMarker={showMainMarker}
          selectTopCity={selectTopCity}
        />
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
            filter={
              !showStates
                ? ["in", "name_en", area.label]
                : ["in", "name", "United States"]
            }
            paint={{
              "fill-color": `${
                dark ? " rgba(13, 64, 130, 0.8)" : "rgba(0, 232, 250, 0.8)"
              }`,
              "fill-opacity": 0,
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
              "line-opacity": 0,
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
              "fill-opacity": 0,
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
              "line-opacity": 0,
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
              "fill-opacity": 0,
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
              "line-opacity": 0,
            }}
            filter={["==", "NAME", area.label]}
          />
        </Source>
      </Map>
    </>
  );
}
