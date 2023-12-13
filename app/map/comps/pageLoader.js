import { LoadingOverlay } from "@mantine/core";
import { Globe } from "../../layout";

export default function PageLoader({ contentLoaded }) {
  return (
    <LoadingOverlay
      visible={!contentLoaded}
      zIndex={2000}
      transitionProps={{ duration: 500 }}
      loaderProps={{
        children: <Globe />,
      }}
    />
  );
}
