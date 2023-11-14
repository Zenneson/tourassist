import "@mantine/nprogress/styles.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useComputedColorScheme } from "@mantine/core";
import { NavigationProgress, nprogress } from "@mantine/nprogress";

export function RouterTransition(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      url !== router.asPath && nprogress.start();
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
  }, [router.asPath, router.events]);

  return (
    <>
      <NavigationProgress
        zIndex={9999}
        size={"md"}
        color={dark ? "#0d3f82" : "#00e8fc"}
      />
    </>
  );
}
