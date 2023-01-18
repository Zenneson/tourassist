import { useRecoilState } from "recoil";
import { Drawer, Button, CloseButton, Stack } from "@mantine/core";
import { listOpenedState } from "../pages/index";
import { IconMenuOrder } from "@tabler/icons";
import PlaceListItem from "./placeListItem";

export default function Sidebar() {
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);

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
        <Stack
          style={{
            marginTop: "80px",
          }}
        >
          <PlaceListItem />
        </Stack>
      </Drawer>
    </>
  );
}
