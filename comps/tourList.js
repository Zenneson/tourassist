import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { Drawer, Button, Divider, Center, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IconX } from "@tabler/icons";
import PlaceListItem from "./placeListItem";
import { listOpenedState, placeListState } from "../libs/atoms";

export default function TourList() {
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [places, setPlaces] = useRecoilState(placeListState);
  const [placeData, setPlaceData] = useLocalStorage({
    key: "placeDataState",
    defaultValue: [],
  });
  const router = useRouter();

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
                    key={place.name}
                    draggableId={place.name}
                    index={index}
                    name={place.name}
                    region={place.region}
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
          <Center>
            <Button
              radius="xl"
              size="sm"
              fw={700}
              onClick={() => {
                const newPlaceData = places.map((place) => {
                  const { name, region } = place;
                  return { place: name, region, costs: ["FLIGHT", "HOTEL"] };
                });
                setPlaceData(newPlaceData);
                router.push("/tripplanner");
              }}
              sx={(theme) => ({
                background: "#008554",
                border: "1px solid #008554",
                transition: "all 200ms ease-in-out",
                color: "#003a24",
                width: "80%",
                marginTop: "20px",
                opacity: 0.5,
                fontWeight: 400,
                "&:hover": {
                  opacity: 1,
                  color: "#fff",
                  background: "#003a24",
                  boxShadow: "0px 0px 15px 0px rgba(255, 255, 255, 0.03)",
                  transform: "scale(1.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                },
              })}
            >
              READY
            </Button>
          </Center>
          <Button
            pos={"absolute"}
            top={134}
            right={0}
            sx={{
              background: "rgba(8, 7, 11, 0.95)",
              borderRadius: "5px 0 0 5px",
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
