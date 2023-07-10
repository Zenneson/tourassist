import { useRouter } from "next/router";
import { Drawer, Button, Divider, Center, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IconX } from "@tabler/icons-react";
import PlaceListItem from "./placeListItem";

export default function TourList({
  setTripSelected,
  listOpened,
  setListOpened,
  places,
  setPlaces,
}) {
  const [placeData, setPlaceData] = useLocalStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const router = useRouter();
  const showLoader = () => {
    setTripSelected(true);
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
          opened={listOpened}
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
              margin: "80px 0 10px 0",
            }}
          />
          <Droppable droppableId="places">
            {(provided) => (
              <Stack ref={provided.innerRef} {...provided.droppableProps}>
                {places.map((place, index) => (
                  <PlaceListItem
                    key={index}
                    draggableId={place.name}
                    index={index}
                    name={place.name}
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
              onClick={() => {
                setTripSelected(true);
                const newPlaceData = places.map((place) => {
                  const { name, region } = place;
                  return {
                    place: name === "東京都" ? "Tokyo" : name,
                    region:
                      region && region.replace("ecture東京都", "., Japan"),
                    fullName: name + "," + region,
                    costs: ["FLIGHT", "HOTEL"],
                  };
                });
                setPlaceData(newPlaceData);
                router.push("/tripplanner");
              }}
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
            top={94}
            right={0}
            bg={"dark.5"}
            sx={{
              borderRadius: "3px 0 0 3px",
              padding: "0 8px",
              transition: "all 100ms ease-in-out",
              "&:hover": {
                background: "rgba(16, 17, 19, 1)",
              },
            }}
            onClick={() => setListOpened(false)}
          >
            <IconX size={15} />
          </Button>
        </Drawer>
      </DragDropContext>
    </>
  );
}
