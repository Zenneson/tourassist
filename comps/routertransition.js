import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import Loader from "./loader";

export function RouterTransition({
  setPanelShow,
  setMainMenuOpened,
  setDropDownOpened,
}) {
  const router = useRouter();

  const [pageLoaded, setPageLoaded] = useState(true);
  useEffect(() => {
    if (router.pathname !== "/") {
      const saved = sessionStorage.getItem("pageLoaded");
      setPageLoaded(saved ? JSON.parse(saved) : true);
    }
  }, [router.pathname]);

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && nprogress.start();
      setPanelShow(false);
      setMainMenuOpened(false);
      setDropDownOpened(false);
      setPageLoaded(false);
    };
    const handleComplete = () => {
      setPageLoaded(true);
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
    pageLoaded,
    setPageLoaded,
  ]);

  return (
    <>
      <NavigationProgress
        zIndex={9999}
        autoReset={true}
        size={"sm"}
        color="#219cee"
      />
      <Loader pageLoaded={pageLoaded} />
    </>
  );
}
