"use client";
import { Center, Stack } from "@mantine/core";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import classes from "./styles/globeLoader.module.css";

export default function GlobeLoader() {
  const canvasRef = useRef();
  const [globe, setGlobe] = useState(null);
  const [loadInAnimation, setLoadInAnimation] = useState(false);

  useEffect(() => {
    setLoadInAnimation(classes.loadInAnimation);
  }, []);

  useEffect(() => {
    let phi = 0;

    if (canvasRef.current && !globe) {
      const theGlobe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 200,
        height: 200,
        phi: 2.16,
        theta: -0.25,
        dark: 1,
        diffuse: 2,
        mapSamples: 100000,
        mapBrightness: 12,
        mapBaseBrightness: 0.1,
        opacity: 0.75,
        markerColor: [1, 1, 1],
        glowColor: [0.02, 1, 2],
        baseColor: [0.01, 0.5, 1],
        markers: [],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.08;
        },
      });
      setGlobe(theGlobe);
    }

    return () => {
      globe && globe.destroy();
    };
  }, [globe]);

  return (
    <Center w={"100vw"} h={"100vh"} className={classes.loaderBg}>
      <Stack>
        <canvas
          className={`${classes.globeLoader} ${loadInAnimation}`}
          ref={canvasRef}
        />
      </Stack>
    </Center>
  );
}
