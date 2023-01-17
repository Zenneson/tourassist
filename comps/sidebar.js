import { useRecoilState } from "recoil";
import { Drawer } from "@mantine/core";
import { listOpenedState } from "../pages/index";

export default function Sidebar() {
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);

  return (
    <>
      <Drawer
        opened={listOpened}
        onClose={() => setListOpened(false)}
        withOverlay={false}
        withCloseButton={false}
        zIndex={99}
        padding="xl"
      >
        <div
          style={{
            paddingTop: "35px",
          }}
        >
          <h2>Tour</h2>
        </div>
      </Drawer>
    </>
  );
}
