import { useRef } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl";
import bbox from "@turf/bbox";

export default function Mymap() {
  return (
    <Map
      ref={mapRef}
      interactiveLayerIds={["country-boundaries"]}
      onClick={onClick}
      projection="globe"
      mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
      initialViewState={{
        latitude: 35,
        longitude: -88,
        zoom: 3.7,
      }}
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
