import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import classes from "./chatBot.module.css";

export default function ChatBot() {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 150 * 2,
      height: 150 * 2,
      phi: 2.16,
      theta: -0.25,
      dark: 1,
      diffuse: 1,
      mapSamples: 100000,
      mapBrightness: 7,
      mapBaseBrightness: 0,
      baseColor: [
        0.050980392156862744, 0.25098039215686274, 0.5098039215686274,
      ],
      markerColor: [0.28627450980392155, 0.8470588235294118, 1],
      glowColor: [0.3811764705882353, 0.24627450980392157, 0.32],
      opacity: 0.9,
      markers: [
        // longitude latitude
        // { location: [37.7595, -122.4367], size: 0.03 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return <canvas className={classes.globeCanvas} ref={canvasRef} />;
}
