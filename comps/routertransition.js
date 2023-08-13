import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMantineTheme } from "@mantine/core";
import { useSessionStorage, useWindowEvent } from "@mantine/hooks";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import Loader from "./loader";

export function RouterTransition(props) {
  const [loaded, setLoaded] = useSessionStorage({
    key: "loaded",
    defaultValue: false,
  });
  const { setPanelShow, setMainMenuOpened, setDropDownOpened, mapLoaded } =
    props;
  const theme = useMantineTheme();
  const router = useRouter();

  useWindowEvent("beforeunload", () => {
    setLoaded(false);
    if (router.pathname !== "/tripplanner" || router.pathname !== "/map")
      sessionStorage.clear();
  });

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && nprogress.start();
      setPanelShow(false);
      setMainMenuOpened(false);
      setDropDownOpened(false);
      setLoaded(false);
      if (router.pathname !== "/tripplanner" || router.pathname !== "/map")
        sessionStorage.clear();
    };

    const handleComplete = () => {
      nprogress.complete();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [
    setLoaded,
    router.asPath,
    router.events,
    setPanelShow,
    setMainMenuOpened,
    setDropDownOpened,
    router.pathname,
  ]);

  return (
    <>
      <NavigationProgress
        zIndex={9999}
        autoReset={true}
        size={"sm"}
        color={theme.colorScheme === "dark" ? "#219cee" : "#9b1616"}
      />
      <Loader mapLoaded={mapLoaded} />
    </>
  );
}
