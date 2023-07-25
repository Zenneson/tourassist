import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useMantineTheme,
  Drawer,
  Button,
  Divider,
  Center,
  Stack,
} from "@mantine/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IconX } from "@tabler/icons-react";
import PlaceListItem from "./placeListItem";

export default function TourList(props) {
  const { listOpened, setListOpened, places, setPlaces } = props;
  const theme = useMantineTheme();
  const router = useRouter();

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
          zIndex={999}
          opened={listOpened && places.length > 0}
          onClose={() => setListOpened(false)}
          withOverlay={false}
          withCloseButton={false}
          padding="xl"
          size="xs"
          opacity={0.95}
          styles={{
            drawer: {
              boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Divider
            label="Tour Locations"
            sx={{
              opacity: 0.4,
              margin: "63px 0 10px 0",
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
              size="sm"
              fw={700}
              mt={30}
              fullWidth
              onClick={submitTourList}
              sx={(theme) => ({
                transition: "all 200ms ease-in-out",
                opacity: 0.7,
                fontWeight: 400,
                "&:hover": {
                  opacity: 1,
                  color: "#fff",
                  transform: "scale(1.02)",
                },
              })}
            >
              READY
            </Button>
          </Center>
          <Button
            pos={"absolute"}
            top={77}
            right={0}
            onClick={() => setListOpened(false)}
            bg={
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[1]
            }
            sx={{
              borderRadius: "3px 0 0 3px",
              padding: "0 8px",
              transition: "all 100ms ease-in-out",
              "&:hover": {
                background:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[4],
              },
            }}
          >
            <IconX
              size={15}
              style={{
                color: theme.colorScheme === "dark" ? "#fff" : "#000",
              }}
            />
          </Button>
        </Drawer>
      </DragDropContext>
    </>
  );
}
