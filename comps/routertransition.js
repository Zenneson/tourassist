import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMantineTheme } from "@mantine/core";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import Loader from "./loader";

export function RouterTransition(props) {
  const { setPanelShow, setMainMenuOpened, setDropDownOpened, mapLoaded } =
    props;
  const [loaded, setLoaded] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && nprogress.start();
      setPanelShow(false);
      setMainMenuOpened(false);
      setDropDownOpened(false);
      setLoaded(false);
    };
    const handleComplete = () => {
      nprogress.complete();
      setLoaded(true);
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
    router.asPath,
    router.events,
    setPanelShow,
    setMainMenuOpened,
    setDropDownOpened,
  ]);

  return (
    <>
      <NavigationProgress
        zIndex={9999}
        autoReset={true}
        size={"sm"}
        color={theme.colorScheme === "dark" ? "#219cee" : "#9b1616"}
      />
      <Loader loaded={loaded} setLoaded={setLoaded} mapLoaded={mapLoaded} />
    </>
  );
}
