import { hideLoaderAtom } from "@libs/atoms";
import { LoadingOverlay } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Globe } from "../../layout";

export default function PageLoader({ contentLoaded }) {
  const [hideLoader, setHideLoader] = useAtom(hideLoaderAtom);

  useEffect(() => {
    if (contentLoaded) {
      const timer = setTimeout(() => {
        setHideLoader(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hideLoader, contentLoaded]);

  return (
    <LoadingOverlay
      visible={!hideLoader}
      zIndex={2000}
      transitionProps={{ duration: 0, exitDuration: 1500 }}
      loaderProps={{
        children: <Globe />,
      }}
    />
  );
}
