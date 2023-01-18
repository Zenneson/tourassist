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
        size="sm"
        styles={{
          drawer: {
            background: "rgba(18, 18, 18, 0.7)",
            boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
          },
        }}
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
