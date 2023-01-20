import { atom, useRecoilState } from "recoil";
import { ReOrderableItem, ReOrderableList } from "react-reorderable-list";
import { Drawer, Button, Stack, Divider, Center } from "@mantine/core";
import { listOpenedState } from "../pages/index";
import { placeListState } from "../comps/Mymap";
import { IconX } from "@tabler/icons";
import PlaceListItem from "./placeListItem";

export const buttonModeState = atom({
  key: "buttonModeState",
  default: "reorder",
});

export default function Sidebar() {
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [places, setPlaces] = useRecoilState(placeListState);

  return (
    <>
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
            background: "rgba(31, 31, 31, 0.95)",
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
        <Stack spacing={10}>
          <ReOrderableList
            name="placesList"
            list={places}
            onListUpdate={(newList) => setPlaces(newList)}
            styles={{
              width: "100%",
            }}
          >
            {places.map((place, index) => (
              <ReOrderableItem key={`item-${index}`}>
                <PlaceListItem name={place.name} region={place.region} />
              </ReOrderableItem>
            ))}
          </ReOrderableList>
        </Stack>
        <Center>
          <Button
            radius="xl"
            fw={700}
            size="sm"
            sx={(theme) => ({
              background: "#008554",
              border: "1px solid #008554",
              transition: "all 100ms ease-in-out",
              color: "#003a24",
              width: "80%",
              marginTop: "20px",
              opacity: 0.5,
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
          onClick={() => setListOpened(false)}
          sx={{
            background: "rgba(31, 31, 31, 0.95)",
            borderRadius: "0 5px 5px 0",
            position: "absolute",
            top: "105px",
            right: "-33px",
            padding: "0 8px",
            transition: "all 100ms ease-in-out",
            "&:hover": {
              background: "rgba(20, 20, 20, 1)",
            },
          }}
        >
          <IconX size={15} />
        </Button>
      </Drawer>
    </>
  );
}
