import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import {
  Drawer,
  Button,
  CloseButton,
  Stack,
  Divider,
  SegmentedControl,
  Center,
} from "@mantine/core";
import { listOpenedState } from "../pages/index";
import { IconMapPin, IconMenuOrder, IconTrash, IconX } from "@tabler/icons";
import PlaceListItem from "./placeListItem";

export const placeListState = atom({
  key: "placeListState",
  default: [
    {
      id: 1,
      init: "SS",
      name: "Silver Spring",
      region: "Maryland, United States",
    },
    {
      id: 2,
      init: "SG",
      name: "Saint Georges",
      region: "Grenada",
    },
    {
      id: 3,
      init: "NY",
      name: "New York",
      region: "New York, United States",
    },
  ],
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
        <Center>
          <SegmentedControl
            radius="xl"
            sx={({ theme }) => ({
              width: "100%",
              opacity: 0.5,
              margin: "80px 0 5px 0",
              transition: "all 200ms ease-in-out",
              "&:hover": {
                opacity: 1,
              },
              label: {
                padding: "5px 0 0 0",
              },
            })}
            data={[
              { value: "location", label: <IconMapPin size={15} /> },
              { value: "reorder", label: <IconMenuOrder size={15} /> },
              { value: "delete", label: <IconTrash size={15} /> },
            ]}
          />
        </Center>
        <Divider
          label="Tour Locations"
          sx={{
            opacity: 0.4,
            margin: "5px 0 10px 0",
          }}
        />
        <Stack spacing={10}>
          {places.map((place) => (
            <>
              {place.id !== 1 && (
                <Divider
                  sx={{
                    opacity: 0.25,
                  }}
                />
              )}
              <PlaceListItem
                key={place.id}
                init={place.init}
                name={place.name}
                region={place.region}
              />
            </>
          ))}
        </Stack>
        <Button
          radius="xl"
          fw={700}
          size="sm"
          sx={(theme) => ({
            background: "#008554",
            transition: "all 100ms ease-in-out",
            color: "#003a24",
            width: "90%",
            margin: "25px 0 0 5%",
            opacity: 0.5,
            "&:hover": {
              opacity: 1,
              color: "#fff",
              background: "#003a24",
            },
          })}
        >
          READY
        </Button>
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
