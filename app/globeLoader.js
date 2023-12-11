"use client";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import classes from "./styles/globeLoader.module.css";

export default function GlobeLoader() {
  const canvasRef = useRef();
  const [globe, setGlobe] = useState(null);

  useEffect(() => {
    let phi = 0;
    let speed = 0.1;
    const diffuse = {
      value: 2,
      get() {
        this.value += 0.001;
        return this.value;
      },
    };

    if (canvasRef.current && !globe) {
      const theGlobe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 400,
        height: 400,
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
          phi += speed;
          state.diffuse = diffuse.get();
        },
      });
      setGlobe(theGlobe);
    }

    return () => {
      globe && globe.destroy();
    };
  }, [globe]);

  return (
    <canvas
      className={`${classes.globeLoader}`}
      ref={canvasRef}
      onClick={() => setChatOpened(!chatOpened)}
    />
  );
}
