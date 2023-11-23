import {} from "react";
import {
  useComputedColorScheme,
  Box,
  Button,
  Stack,
  Space,
  Transition,
} from "@mantine/core";
import {
  IconPlane,
  IconTextPlus,
  IconCurrentLocation,
  IconCircleDotFilled,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { areaAtom, topCitiesAtom } from "./mapHooks";
import { Marker, Popup } from "react-map-gl";
import classes from "./popUpMarker.module.css";

export default function PopUpMarker(props) {
  const { lngLat, showMainMarker, selectTopCity, choosePlace } = props;
  const [area] = useAtom(areaAtom);
  const [topCities] = useAtom(topCitiesAtom);
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

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

  return (
    <>
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
    </>
  );
}
