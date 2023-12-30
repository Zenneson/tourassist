"use client";
import { useEffect, useState } from "react";
import { route } from "./api/route";
import Mymap from "./comps/mymap";

export default function Map() {
  const [currentCenter, setCurrentCenter] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const fetchRoute = async () => {
      const center = await route();
      setCurrentCenter(center);
    };

    fetchRoute();
  }, []);

  return (
    <Mymap
      latitude={currentCenter.latitude}
      longitude={currentCenter.longitude}
    />
  );
}
