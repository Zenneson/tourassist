import { useRecoilState } from "recoil";
import {
  Center,
  Box,
  Title,
  Text,
  Button,
  Group,
  Overlay,
  Transition,
} from "@mantine/core";
import { IconWorld } from "@tabler/icons";
import { visibleState } from "../pages/index";
import { mapLoadState } from "./Mymap";

export default function Intro() {
  const [visible, setVisible] = useRecoilState(visibleState);
  const [mapLoaded, setMapLoaded] = useRecoilState(mapLoadState);

  return (
    <>
      {!visible && (
        <Center
          sx={{
            position: "absolute",
            height: "100vh",
            width: "100%",
            flexWrap: "wrap",
            zIndex: "105",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              width: "70%",
            }}
          >
            <Title
              order={1}
              sx={{ fontSize: "6rem", marginBottom: "30px", lineHeight: "1" }}
            >
              Where in the{" "}
              <Text
                inherit
                span
                fw={900}
                variant="gradient"
                gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
              >
                world
              </Text>{" "}
              would you like to go?
            </Title>
            <Text size="md" sx={{ width: "90%", marginLeft: "5%" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Group
              sx={{
                marginTop: "30px",
                justifyContent: "center",
              }}
            >
              <Button
                size="md"
                uppercase={true}
                fw={900}
                variant="default"
                sx={{ width: "200px", color: "rgba(255,255,255,0.3)" }}
              >
                Login | Sign Up
              </Button>
              <Button
                fw={900}
                size="md"
                uppercase={true}
                loading={mapLoaded}
                loaderProps={{ variant: "oval", size: 20 }}
                variant="filled"
                sx={{ width: "200px" }}
                onClick={() => setVisible((v) => !v)}
                leftIcon={<IconWorld size={20} style={{ color: "#00E8FC" }} />}
              >
                Plan a trip
              </Button>
            </Group>
          </Box>
        </Center>
      )}
      <Transition
        mounted={!visible}
        transition="fade"
        duration={100}
        exitDuration={100}
        timingFunction="linear"
      >
        {(styles) => <Overlay opacity={0.9} color="#000" zIndex={102} />}
      </Transition>
    </>
  );
}
