import { useEffect } from "react";
import { useRouter } from "next/router";
import { NavigationProgress, nprogress } from "@mantine/nprogress";

export function RouterTransition({
  setPanelShow,
  setMainMenuOpened,
  setDropDownOpened,
}) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && nprogress.start();
      setPanelShow(false);
      setMainMenuOpened(false);
      setDropDownOpened(false);
    };
    const handleComplete = () => nprogress.complete();

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
    <NavigationProgress
      zIndex={9999}
      autoReset={true}
      size={"sm"}
      color="#219cee"
    />
  );
}
