import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import {
  IconQuestionMark,
  IconLogin,
  IconSearch,
  IconList,
} from "@tabler/icons";
import {
  useMantineTheme,
  Box,
  Overlay,
  AppShell,
  Header,
  Drawer,
  Button,
  Image,
  MediaQuery,
  Burger,
  Flex,
  Group,
  Modal,
  TextInput,
  Tooltip,
} from "@mantine/core";
import Intro from "../comps/intro";
import Sidebar from "../comps/sidebar";
import Mymap from "../comps/Mymap";
import { placeSearchState } from "../comps/Mymap";
import { placeListState } from "../comps/Mymap";
import InfoModal, { infoOpenedState } from "../comps/infoModal";
import LoginModal, { loginOpenedState } from "../comps/loginModal";

export const visibleState = atom({
  key: "visibleState",
  default: false,
});

export const listOpenedState = atom({
  key: "listOpenedState",
  default: false,
});

export const searchOpenedState = atom({
  key: "searchOpenedState",
  default: false,
});

export default function Home() {
  const theme = useMantineTheme();
  const [infoOpened, setInfoOpened] = useRecoilState(infoOpenedState);
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [visible, setVisible] = useRecoilState(visibleState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [places, setPlaces] = useRecoilState(placeListState);
  const [showPlaceSearch, setShowPlaceSearch] =
    useRecoilState(placeSearchState);

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
        <AppShell
          padding="none"
          header={
            <Header
              zIndex={120}
              hidden={!visible || infoOpened || searchOpened || loginOpened}
              sx={{
                display: "flex",
                padding: "15px 25px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image
                width={"auto"}
                height={50}
                src={"img/blogo.png"}
                alt="TouraSSist_logo"
                withPlaceholder
              />
              <Group
                spacing={0}
                sx={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "50px",
                }}
              >
                <Tooltip
                  label="Search Trips"
                  position="bottom"
                  openDelay={800}
                  withArrow
                >
                  <Button
                    onClick={() => setSearchOpened(true)}
                    variant="subtle"
                    radius="xl"
                    p={10}
                  >
                    <IconSearch size={17} />
                  </Button>
                </Tooltip>
                <Tooltip
                  label="TourAssist?"
                  position="bottom"
                  openDelay={800}
                  withArrow
                >
                  <Button
                    onClick={() => setInfoOpened(true)}
                    variant="subtle"
                    radius="xl"
                    p={10}
                  >
                    <IconQuestionMark size={17} />
                  </Button>
                </Tooltip>
                <Tooltip
                  label="Login"
                  position="bottom"
                  openDelay={800}
                  withArrow
                >
                  <Button
                    onClick={() => setLoginOpened(true)}
                    variant="subtle"
                    radius="xl"
                    p={10}
                  >
                    <IconLogin size={17} />
                  </Button>
                </Tooltip>
              </Group>
              {visible && !infoOpened && !searchOpened && !loginOpened && (
                <Sidebar />
              )}
            </Header>
          }
        >
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
