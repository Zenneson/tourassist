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
import { AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IconX } from "@tabler/icons-react";
import PlaceListItem from "./placeListItem";
import classes from "./tourList.module.css";

export default function TourList(props) {
  const {
    places,
    setPlaces,
    listOpened,
    setListOpened,
    goToLocation,
    setLngLat,
    setLocationDrawer,
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

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (
      !destination ||
      (source.index === destination.index &&
        source.droppableId === destination.droppableId)
    ) {
      return;
    }

    const items = Array.from(places);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setPlaces(items);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
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
              <Stack
                gap={0}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <AnimatePresence>
                  {places.map((place, index) => (
                    <PlaceListItem
                      places={places}
                      setPlaces={setPlaces}
                      key={place.place + "_" + place.id}
                      draggableId={place.place}
                      index={index}
                      place={place.place}
                      region={place.region}
                      setListOpened={setListOpened}
                      setLngLat={setLngLat}
                      goToLocation={goToLocation}
                      setLocationDrawer={setLocationDrawer}
                    />
                  ))}
                </AnimatePresence>
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
