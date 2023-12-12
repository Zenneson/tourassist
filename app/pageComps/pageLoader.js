import { Center, LoadingOverlay, Stack, Text } from "@mantine/core";
import classes from "../styles/globeLoader.module.css";
import GlobeLoader from "./globeLoader";

export default function PageLoader({ contentLoaded }) {
  return (
    <LoadingOverlay
      visible={!contentLoaded}
      zIndex={2000}
      transitionProps={{ duration: 500 }}
      loaderProps={{
        children: (
          <Center w={"100vw"} h={"100vh"}>
            <Stack>
              <GlobeLoader />
              <Text className={classes.dots} ta={"center"} fz={"sm"} fw={700}>
                LOADING
              </Text>
            </Stack>
          </Center>
        ),
      }}
    />
  );
}
