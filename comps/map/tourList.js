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
  const { listOpened, setListOpened, places, setPlaces } = props;
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
          zIndex={999}
          opened={listOpened && places.length > 0}
          onClose={() => setListOpened(false)}
          withOverlay={false}
          withCloseButton={false}
          padding="xl"
          size={400}
          opacity={0.95}
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
                    places={places}
                    setPlaces={setPlaces}
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
              onClick={submitTourList}
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
