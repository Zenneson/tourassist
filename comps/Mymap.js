import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer } from "react-map-gl";
import bbox from "@turf/bbox";

export default function Mymap() {
  const mapRef = useRef();

  const [allData, setAllData] = useState(null);
  const [clickedCountry, setClickedCountry] = useState(null);

  useEffect(() => {
    fetch("data/countries.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data"));
  }, []);

  const onEvent = (event) => {
    const country = event.features[0];

    if (country) {
      const [minLng, minLat, maxLng, maxLat] = bbox(country);

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          duration: 1000,
          padding: 500,
          pitch: 45,
          offset: [80, 0],
        }
      );
    }
  };

  return (
    <Map
      initialViewState={{
        latitude: 35,
        longitude: -88,
        zoom: 2.5,
        pitch: 0,
      }}
      ref={mapRef}
      onClick={onEvent}
      projection="globe"
      doubleClickZoom={false}
      touchPitch={false}
      interactiveLayerIds={["country-data"]}
      mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
      style={{ width: "100%", height: "100%" }}
      mapboxAccessToken={"********"}
    >
      <Source type="geojson" data={allData}>
        <Layer
          id="country-data"
          type="fill"
          paint={{
            // "fill-color": "#fff",
            "fill-color": "#00e8fc",
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
            "line-width": 2,
          }}
        />
      </Source>
    </Map>
  );
}
