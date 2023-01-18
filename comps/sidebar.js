import { useRecoilState } from "recoil";
import {
  Drawer,
  Button,
  CloseButton,
  Stack,
  Divider,
  SegmentedControl,
} from "@mantine/core";
import { listOpenedState } from "../pages/index";
import { IconMapPin, IconMenuOrder, IconTrash } from "@tabler/icons";
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
        <Divider
          label="Tour List"
          style={{
            margin: "65px 0 15px 0",
            opacity: 0.3,
          }}
        />
        <Stack>
          <PlaceListItem />
        </Stack>
        <SegmentedControl
          radius="xl"
          // fullWidth
          sx={({ theme }) => ({
            width: "70%",
            marginLeft: "15%",
            opacity: 0.5,
            transition: "all 200ms ease-in-out",
            "&:hover": {
              opacity: 1,
            },
            marginTop: "15px",
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
      </Drawer>
    </>
  );
}
