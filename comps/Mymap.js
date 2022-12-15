import { useState } from "react";
import Map, { Source, Layer } from "react-map-gl";

export default function Mymap() {
  const [viewState, setViewState] = useState({
    latitude: 35,
    longitude: -88,
    zoom: 3.7,
  });

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      projection="globe"
      mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
      style={{ width: "100%", height: "100%" }}
      mapboxAccessToken={
        "pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
      }
    >
      <Source
        id="country-boundaries"
        type="vector"
        url="mapbox://mapbox.country-boundaries-v1"
      >
        <Layer
          id="country-boundaries"
          source="country-boundaries"
          source-layer="country_boundaries"
          type="line"
          paint={{
            "line-color": "#fff",
            "line-width": 2,
          }}
        />
      </Source>
    </Map>
  );
}
