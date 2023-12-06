import { useState, useEffect } from "react";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import {
  useComputedColorScheme,
  Box,
  Transition,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { IconCircleDotFilled } from "@tabler/icons-react";
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
        <Marker
          longitude={lngLat[0]}
          latitude={lngLat[1]}
          offset={[0, 0]}
          rotation={40}
          rotationAlignment="map"
          pitchAlignment="map"
        >
          <Popup
            className={classes.popup}
            anchor="bottom"
            offset={[-350, -250]}
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
                    ? { from: "#0D3F82", to: "#010b18", deg: 45 }
                    : { from: "#2DC7F3", to: "#49d8ff", deg: 45 }
                }
              >
                {area.label}
              </Text>
              <Text fw={600} fz={30} c={dark ? "#000" : "#fff"}>
                {area?.region} {area?.region && "|"} {area?.country}
              </Text>
            </Stack>
          </Popup>
        </Marker>
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
