import { useState, useEffect } from "react";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import {
  useComputedColorScheme,
  Box,
  Button,
  Transition,
  Stack,
  Text,
  Group,
} from "@mantine/core";
import {
  IconCircleDotFilled,
  IconPlane,
  IconTextPlus,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import TourList from "./tourList";
import classes from "./mapComp.module.css";

export default function MapComp(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const {
    mapRef,
    fullMapRef,
    mapLoaded,
    setMapLoaded,
    area,
    places,
    setPlaces,
    topCities,
    country_center,
    searchOpened,
    listOpened,
    setListOpened,
    lngLat,
    setLngLat,
    setLocationDrawer,
    goToLocation,
    showMainMarker,
    showStates,
    locationHandler,
    mapboxAccessToken,
    selectTopCity,
    choosePlace,
  } = props;

  const latitude = country_center[1];
  const longitude = country_center[0];

  const initialViewState = {
    latitude: latitude,
    longitude: longitude,
    zoom: 2.5,
    pitch: 0,
  };

  const [viewState, setViewState] = useState(initialViewState);

  const pins = topCities.map((city, index) => (
    <Transition
      key={`marker-${index}`}
      mounted={!showMainMarker && topCities}
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
            closeOnClick={true}
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

  const onZoomEnd = (e) => {
    if (e.target.getZoom() < 3.5) {
      mapRef.current?.flyTo({
        duration: 1000,
        pitch: 0,
        essential: true,
      });
    }
  };

  const getFogProperties = (dark) => {
    return {
      color: dark ? "#0f2e57" : "#fff",
      "high-color": dark ? "#000" : "#245cdf",
      "space-color": dark
        ? ["interpolate", ["linear"], ["zoom"], 4, "#010b19", 7, "#367ab9"]
        : ["interpolate", ["linear"], ["zoom"], 4, "#fff", 7, "#fff"],
    };
  };

  const setLightProperties = (dark) => {
    return {
      anchor: "viewport",
      color: dark ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 1)",
      intensity: 0.5,
    };
  };

  useEffect(() => {
    if (fullMapRef && mapLoaded) {
      const fogProps = getFogProperties(dark);
      fullMapRef.setFog(fogProps);
      const lightProps = setLightProperties(dark);
      fullMapRef.setLight(lightProps);
    }
  }, [dark, fullMapRef, mapLoaded]);

  const isCity =
    area.type === "city" ||
    (area.type === "region" && area.country !== "United States");

  const markerAnimation = {
    hidden: {
      y: -200,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 1 },
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 1 },
    },
  };

  return (
    <Map
      id="mapRef"
      ref={mapRef}
      projection="globe"
      antialias="true"
      {...viewState}
      onMove={(e) => {
        setViewState(e.viewState);
      }}
      initialViewState={initialViewState}
      renderWorldCopies={true}
      styleDiffing={false}
      onZoomEnd={onZoomEnd}
      maxPitch={80}
      maxZoom={18}
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
      doubleClickZoom={false}
      interactiveLayerIds={["states", "country-boundaries", "clicked-state"]}
      mapStyle={"mapbox://styles/zenneson/clptl59r3000l01qmhncd6jfx"}
      mapboxAccessToken={mapboxAccessToken}
      style={{ width: "100%", height: "100%", pointerEvents: isCity && "none" }}
    >
      {!searchOpened && (
        <TourList
          places={places}
          setPlaces={setPlaces}
          listOpened={listOpened}
          setListOpened={setListOpened}
          setLngLat={setLngLat}
          setLocationDrawer={setLocationDrawer}
          goToLocation={goToLocation}
        />
      )}
      {computedColorScheme ? pins : {}}
      {showMainMarker && (
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={markerAnimation}
          >
            <Marker longitude={lngLat[0]} latitude={lngLat[1]}>
              <Popup
                className={classes.popup}
                anchor="bottom"
                offset={[-420, 0]}
                closeOnMove={false}
                closeButton={false}
                closeOnClick={false}
                longitude={lngLat[0]}
                latitude={lngLat[1]}
              >
                <Stack p={10} gap={0} className={classes.popupFrame}>
                  <Text
                    fw={900}
                    fz={50}
                    mb={-15}
                    variant="gradient"
                    gradient={
                      dark
                        ? { from: "#ffffff", to: "rgb(160, 160, 160)", deg: 45 }
                        : { from: "#363636", to: "#000000", deg: 45 }
                    }
                  >
                    {area.label}
                  </Text>
                  <Text fw={600} fz={30} c={dark ? "#fff" : "#000"}>
                    {area?.region}{" "}
                    {area.region !== area.country && area?.region && "|"}{" "}
                    {area.region !== area.country && area?.country}
                  </Text>
                  <Box className={classes.placeBlurpFrame}>
                    <Text className={classes.placeBlurp}>
                      Silver Spring, Maryland, is a vibrant and diverse suburb
                      located just outside Washington D.C., offering a blend of
                      urban and suburban living. It's known for its lively
                      downtown area, which features a variety of shops,
                      restaurants, and entertainment options, including the AFI
                      Silver Theatre, a historic movie theater that showcases
                      independent films. The community is culturally rich,
                      hosting numerous festivals and events throughout the year,
                      such as the Silver Spring Jazz Festival. Silver Spring
                      also boasts excellent transportation links, including the
                      Metro Red Line, making it convenient for commuting and
                      exploring the wider D.C. area.
                    </Text>
                    <Group mt={10} gap={5} justify="flex-end">
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
                  </Box>
                </Stack>
              </Popup>
            </Marker>
          </motion.div>
        </AnimatePresence>
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
          filter={
            !showStates
              ? ["in", "name_en", area.label]
              : ["in", "name", "United States"]
          }
          paint={{
            "fill-color": `${
              dark ? " rgba(13, 64, 130, 0.8)" : "rgba(0, 232, 250, 0.8)"
            }`,
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
      <Source id="states-boundaries" type="geojson" data="data/states.geojson">
        <Layer
          id="states"
          type="fill"
          source="states-boundaries"
          paint={{
            "fill-color": "rgba(0,0,0,0)",
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
          }}
          filter={["==", "NAME", area.label]}
        />
      </Source>
    </Map>
  );
}
