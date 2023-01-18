import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Box,
  Overlay,
  AppShell,
  Header,
  Drawer,
  Button,
  Image,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import Intro from "../comps/intro";
import Sidebar from "../comps/sidebar";
import Mymap from "../comps/Mymap";
import { placeSearchState } from "../comps/Mymap";

export const visibleState = atom({
  key: "visibleState",
  default: false,
});

export const listOpenedState = atom({
  key: "listOpenedState",
  default: false,
});

export default function Home() {
  const theme = useMantineTheme();
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [visible, setVisible] = useRecoilState(visibleState);
  const [showPlaceSearch, setShowPlaceSearch] =
    useRecoilState(placeSearchState);

  const [opened, setOpened] = useState(false);

  const { user, username } = {};

  return (
    <div>
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
              height={{ base: 50, md: 70 }}
              p="md"
              zIndex={120}
              hidden={!visible}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Link href="/">
                  <Image
                    width={"auto"}
                    height={50}
                    src={"img/blogo.png"}
                    alt="TouraSSist_logo"
                    onClick={() => setListOpened((o) => !o)}
                    withPlaceholder
                  />
                </Link>
              </div>
            </Header>
          }
        >
          <Sidebar />
          <Mymap />
        </AppShell>
      </Box>
    </div>
  );
}
