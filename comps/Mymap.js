import { useState, useEffect } from "react";
import Map, { Source, Layer } from "react-map-gl";
import bbox from "@turf/bbox";

export default function Mymap() {
  const [viewState, setViewState] = useState({
    latitude: 35,
    longitude: -88,
    zoom: 3.7,
  });

  const [allData, setAllData] = useState(null);

  useEffect(() => {
    fetch("data/countries.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data"));
  }, []);

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
      <Source type="geojson" data={allData}>
        <Layer
          id="country-data"
          type="fill"
          paint={{
            "fill-color": "#000",
            "fill-opacity": 0,
          }}
        />
      </Source>
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
            // "line-color": "#00e8fc",
            "line-color": "#fff",
            "line-width": 1,
          }}
        />
      </Source>
    </Map>
  );
}
