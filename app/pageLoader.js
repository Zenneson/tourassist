import { Center, LoadingOverlay } from "@mantine/core";
import GlobeLoader from "./globeLoader";

export default function PageLoader() {
  return (
    <LoadingOverlay
      zIndex={2000}
      visible={true}
      transitionProps={{ duration: 500 }}
      loaderProps={{
        children: (
          <Center w={"100vw"} h={"100vh"}>
            <GlobeLoader />
          </Center>
        ),
      }}
    />
  );
}
