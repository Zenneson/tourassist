import { useState } from "react";
import {
  AppShell,
  Header,
  Autocomplete,
  Drawer,
  Button,
  Image,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import Map from "react-map-gl";

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAeYHu9_AGQDASLgQ8xiZ_Hd4GvwhOtdQk",
    version: "beta",
  });

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);

  return isLoaded ? (
    <AppShell
      padding="none"
      header={
        <Header height={{ base: 50, md: 70 }} p="md" zIndex={100}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Mobile Menu Burger */}
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Image
              width={"auto"}
              height={50}
              src={"img/blogo.png"}
              alt="TouraSSist_logo"
              withPlaceholder
            />
            <Button onClick={() => setListOpened(true)}>Login</Button>
          </div>
        </Header>
      }
    >
      <Autocomplete
        placeholder="Search for a location"
        transition="slide-up"
        size="lg"
        radius="xl"
        data={["1", "2", "3", "4", "5"]}
        style={{
          position: "absolute",
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          zIndex: 100,
        }}
      />
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
          <h2>List</h2>
        </div>
      </Drawer>
      <Map
        projection="globe"
        mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
        initialViewState={{
          latitude: 35,
          longitude: -88,
          zoom: 3,
        }}
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={
          "pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
        }
      ></Map>
    </AppShell>
  ) : (
    <div>Loading...</div>
  );
}
