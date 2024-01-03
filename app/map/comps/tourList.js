import { useAppState } from "@libs/store";
import {
  Button,
  Center,
  Divider,
  Drawer,
  Stack,
  useComputedColorScheme,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classes from "../styles/tourList.module.css";
import PlaceListItem from "./placeListItem";

export default function TourList(props) {
  const {
    places,
    setPlaces,
    setLocationDrawer,
    goToLocation,
    setSessionPlaces,
  } = props;
  const router = useRouter();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const { listOpened, setListOpened } = useAppState();

  const submitTourList = () => {
    const newPlaceData = places.map((location) => {
      const { place, region, costs } = location;
      return {
        place: place,
        region: region,
        costs: costs,
      };
    });
    setSessionPlaces(newPlaceData);
    router.push("/tripPlanner");
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

  useEffect(() => {
    router.prefetch("/tripPlanner");
  }, [router]);

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
          trapFocus={false}
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
                      setLocationDrawer={setLocationDrawer}
                      goToLocation={goToLocation}
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

// This is a hack to prevent the following error from showing up in the console:
// Warning: Connect(Droppable): Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
