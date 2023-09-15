import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWindowEvent } from "@mantine/hooks";
import { NavigationProgress, nprogress } from "@mantine/nprogress";

export function RouterTransition(props) {
  const { setPanelShow, setMainMenuOpened, setDropDownOpened } = props;
  const router = useRouter();
  const { title } = router.query;

  const readyAppStates = useCallback(() => {
    setPanelShow(false);
    setMainMenuOpened(false);
    setDropDownOpened(false);
    sessionStorage.clear();
  }, [setPanelShow, setMainMenuOpened, setDropDownOpened]);

  useWindowEvent("beforeunload", () => {
    readyAppStates();
  });

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && nprogress.start();
      readyAppStates();
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
    router.asPath,
    router.events,
    setPanelShow,
    setMainMenuOpened,
    setDropDownOpened,
    title,
    readyAppStates,
  ]);

  return (
    <>
      <NavigationProgress
        zIndex={9999}
        autoReset={true}
        size={"sm"}
        color={"#219cee"}
      />
    </>
  );
}
