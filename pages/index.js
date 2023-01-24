import { useState } from "react";
import { useRecoilState } from "recoil";
import { IconSearch, IconList } from "@tabler/icons";
import { Box, AppShell, Button, Modal, TextInput } from "@mantine/core";
import Intro from "../comps/intro";
import Mymap from "../comps/Mymap";
import InfoModal from "../comps/infoModal";
import LoginModal from "../comps/loginModal";
import NavBar from "../comps/navBar";
import {
  listOpenedState,
  searchOpenedState,
  placeListState,
} from "../libs/atoms";

export default function Home() {
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [places, setPlaces] = useRecoilState(placeListState);

  return (
    <div>
      <InfoModal />
      <LoginModal />
      <Modal
        opened={searchOpened}
        onClose={() => setSearchOpened(false)}
        withCloseButton={false}
        overlayColor="rgba(0,0,0,0)"
        overlayBlur={10}
        padding={0}
        radius="xl"
      >
        <TextInput
          radius="xl"
          size="xl"
          icon={<IconSearch />}
          placeholder="Search Trips..."
          styles={({ theme }) => ({
            input: {
              ":focus": {
                outline: "none",
                border: "none",
              },
              "::placeholder": {
                fontStyle: "italic",
              },
            },
          })}
        />
      </Modal>
      <Intro />
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <AppShell padding="none" header={<NavBar />}>
          {places.length >= 1 && !listOpened && (
            <Button
              onClick={() => setListOpened(true)}
              sx={{
                backgroundColor: "#020202",
                opacity: 0.35,
                borderRadius: "0 5px 5px 0",
                position: "absolute",
                top: "105px",
                left: "0",
                padding: "0 8px",
                transition: "all 100ms ease-in-out",
                zIndex: 120,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  opacity: 1,
                  backgroundColor: "#020202",
                },
              }}
            >
              <IconList size={15} />
            </Button>
          )}
          <Mymap />
        </AppShell>
      </Box>
    </div>
  );
}
