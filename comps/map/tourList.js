import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useComputedColorScheme,
  Drawer,
  Button,
  Divider,
  Center,
  Stack,
} from "@mantine/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IconX } from "@tabler/icons-react";
import PlaceListItem from "./placeListItem";
import classes from "./tourList.module.css";

export default function TourList(props) {
  const {
    listOpened,
    setListOpened,
    places,
    setPlaces,
    goToLocation,
    setShowMainMarker,
    setLngLat,
    setLocationDrawer,
    setArea,
  } = props;
  const router = useRouter();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  useEffect(() => {
    router.prefetch("/tripplanner");
  }, [router]);

  const submitTourList = () => {
    const newPlaceData = places.map((location) => {
      const { place, region, costs } = location;
      return {
        place: place,
        region: region,
        costs: costs,
      };
    });
    setPlaces(newPlaceData);
    router.push("/tripplanner");
  };

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          const items = Array.from(places);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          setPlaces(items);
        }}
      >
        <Drawer
          classNames={{ content: classes.tourDrawer }}
          zIndex={10}
          opened={listOpened && places.length > 0}
          onClose={() => setListOpened(false)}
          withOverlay={false}
          withCloseButton={false}
          padding="xl"
          size={350}
        >
          <Divider
            label="Tour Locations"
            labelPosition="left"
            style={{
              margin: "80px 0 15px 0",
            }}
          />
          <Droppable droppableId="places">
            {(provided) => (
              <Stack ref={provided.innerRef} {...provided.droppableProps}>
                {places.map((place, index) => (
                  <PlaceListItem
                    key={index}
                    draggableId={place.place}
                    index={index}
                    place={place.place}
                    region={place.region}
                    setListOpened={setListOpened}
                    setShowMainMarker={setShowMainMarker}
                    places={places}
                    setPlaces={setPlaces}
                    goToLocation={goToLocation}
                    setLngLat={setLngLat}
                    setLocationDrawer={setLocationDrawer}
                    setArea={setArea}
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
          <Center>
            <Button
              className={classes.readyButton}
              size="sm"
              fw={700}
              mt={20}
              fullWidth
              radius={"xl"}
              onClick={submitTourList}
              variant="gradient"
              gradient={
                dark
                  ? { from: "#004585", to: "#00376b", deg: 180 }
                  : { from: "#93f3fc", to: "#00e8fc", deg: 180 }
              }
            >
              READY
            </Button>
          </Center>
          <Button
            className={classes.closeButton}
            pos={"absolute"}
            top={103}
            right={0}
            onClick={() => setListOpened(false)}
            bg={dark ? "dark.5" : "gray.1"}
          >
            <IconX
              size={15}
              style={{
                color: dark ? "#fff" : "#000",
              }}
            />
          </Button>
        </Drawer>
      </DragDropContext>
    </>
  );
}
