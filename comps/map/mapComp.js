import { useState } from "react";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import {
  useComputedColorScheme,
  Box,
  Button,
  Transition,
  Space,
  Stack,
} from "@mantine/core";
import {
  IconPlane,
  IconTextPlus,
  IconCircleDotFilled,
  IconCurrentLocation,
} from "@tabler/icons-react";
import TourList from "./tourList";
import classes from "./mapComp.module.css";

export default function MapComp(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const {
    mapRef,
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
    getFogProperties,
    locationHandler,
    mapboxAccessToken,
    choosePlace,
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

  return (
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
            offset={[0, 0]}
            closeOnMove={false}
            closeButton={false}
            closeOnClick={false}
            longitude={lngLat[0]}
            latitude={lngLat[1]}
          >
            <Stack px={10} gap={0} className={classes.popupMenu}>
              <Box pt={10} pl={0}>
                {area.label}
              </Box>
              <Button.Group orientation="vertical" mt={5}>
                <Button
                  className={classes.popupMenuBtn}
                  variant="subtle"
                  size="xs"
                  justify="left"
                  leftSection={<IconPlane size={15} />}
                  onClick={() => choosePlace("travel")}
                >
                  Travel to {area.label}
                </Button>
                <Button
                  className={classes.popupMenuBtn}
                  variant="subtle"
                  size="xs"
                  justify="left"
                  fs={"italic"}
                  leftSection={<IconTextPlus size={15} />}
                  onClick={() => choosePlace("tour")}
                >
                  <Space w={5} />
                  TOUR LIST
                </Button>
              </Button.Group>
            </Stack>
          </Popup>
          <IconCurrentLocation size={150} className={classes.markerIconColor} />
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
      <Source id="states-boundaries" type="geojson" data="data/states.geojson">
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
  );
}
