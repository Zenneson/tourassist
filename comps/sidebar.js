import { atom, useRecoilState } from "recoil";
import { Drawer, Button, Divider, Center, Box, Stack } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { listOpenedState } from "../pages/index";
import { placeListState } from "../comps/Mymap";
import { IconX } from "@tabler/icons";
import PlaceListItem from "./placeListItem";

export default function Sidebar() {
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [places, setPlaces] = useRecoilState(placeListState);

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
          opened={listOpened}
          onClose={() => setListOpened(false)}
          withOverlay={false}
          withCloseButton={false}
          zIndex={100}
          padding="xl"
          size="md"
          styles={{
            drawer: {
              background: "rgba(5, 6, 8, 0.95)",
              boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Divider
            label="Tour Locations"
            sx={{
              opacity: 0.4,
              margin: "70px 0 10px 0",
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
                  fontWeight: 700,
                },
              })}
            >
              READY
            </Button>
          </Center>
          <Button
            onClick={() => setListOpened(false)}
            sx={{
              background: "rgba(8, 7, 11, 0.95)",
              borderRadius: "0 5px 5px 0",
              position: "absolute",
              top: "105px",
              right: "-33px",
              padding: "0 8px",
              transition: "all 100ms ease-in-out",
              "&:hover": {
                background: "rgba(16, 17, 19, 1)",
              },
            }}
          >
            <IconX size={15} />
          </Button>
        </Drawer>
      </DragDropContext>
    </>
  );
}
