import { useState, useEffect, useRef, useMemo } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import bbox from "@turf/bbox";
import centerOfMass from "@turf/center-of-mass";

export default function Mymap() {
  const mapRef = useRef();
  const center = useRef();
  const [countryName, setCountryName] = useState("");
  const [popup, setPopup] = useState(false);

  const initialViewState = {
    latitude: 35,
    longitude: -88,
    zoom: 2.5,
    pitch: 0,
  };

  const filter = useMemo(() => ["in", "name_en", countryName], [countryName]);
  const setPopupInfo = () => {
    console.log(false);
    setPopup(false);
    mapRef.current.flyTo({
      center: center.current.geometry.coordinates,
    });
  };

  const onEvent = (event) => {
    const country = event.features[0];

    if (country) {
      setCountryName(country.properties.name_en);
      center.current = centerOfMass(country);
      setPopup(true);

      let maxZoom = 0;
      switch (country.properties.name_en) {
        case "United States":
          center.current.geometry.coordinates = [-108, 48];
          maxZoom = 3;
          break;
        case "Canada":
          center.current.geometry.coordinates = [-95.8203, 61.0447];
          maxZoom = 3.5;
          break;
        case "Russia":
          center.current.geometry.coordinates = [94.9619, 60.6359];
          maxZoom = 3.2;
          break;
        case "China":
          center.current.geometry.coordinates = [103.9924, 35.504];
          maxZoom = 3.5;
          break;
        case "Brazil":
          center.current.geometry.coordinates = [-53.1562, -10.7836];
          maxZoom = 3.5;
          break;
        case "Australia":
          center.current.geometry.coordinates = [134.0362, -26.529];
          maxZoom = 3.5;
          break;
        case "India":
          center.current.geometry.coordinates = [78.6428, 22.5644];
          maxZoom = 4.2;
          break;
        case "Argentina":
          center.current.geometry.coordinates = [-65.1886, -36.1791];
          maxZoom = 3.5;
          break;
        case "Greenland":
          center.current.geometry.coordinates = [-41.875, 71.5];
          maxZoom = 3.8;
          break;
        case "Mexico":
          center.current.geometry.coordinates = [-102.5, 23.5];
          maxZoom = 4.5;
          break;
        case "Indonesia":
          center.current.geometry.coordinates = [120.5, -2.5];
          maxZoom = 4;
          break;
        case "Sweden":
          center.current.geometry.coordinates = [18.5, 62.5];
          maxZoom = 4.3;
          break;
        case "Chile":
          center.current.geometry.coordinates = [-71.5, -40.5];
          maxZoom = 4.2;
          break;
        case "Ecuador":
          center.current.geometry.coordinates = [-80, -2.5];
          maxZoom = 5.2;
          break;
      }

      console.log(country.properties.name_en);

      const [minLng, minLat, maxLng, maxLat] = bbox(country);
      mapRef.current.flyTo({
        center: center.current.geometry.coordinates,
        zoom: initialViewState.zoom,
        pitch: initialViewState.pitch,
      });
      setTimeout(() => {
        mapRef.current.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            center: center.current.geometry.coordinates,
            padding: { top: 200, bottom: 200, left: 700, right: 700 },
            duration: 1000,
            maxZoom: maxZoom || 7.5,
            pitch: 40,
            linear: false,
          }
        );
      }, 1000);
    }
  };

  return (
    <Map
      initialViewState={initialViewState}
      ref={mapRef}
      onClick={onEvent}
      projection="globe"
      doubleClickZoom={false}
      touchPitch={false}
      interactiveLayerIds={["country-boundaries"]}
      mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
      style={{ width: "100%", height: "100%" }}
      mapboxAccessToken="pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
    >
      {popup && (
        <Popup
          anchor="bottom"
          longitude={Number(center.current?.geometry.coordinates[0])}
          latitude={Number(center.current?.geometry.coordinates[1])}
          onClose={() => setPopupInfo()}
          closeButton={true}
          closeOnClick={false}
        >
          <div>Country name: {countryName}</div>
        </Popup>
      )}
      <Source
        id="country-boundaries"
        type="vector"
        url="mapbox://mapbox.country-boundaries-v1"
      >
        <Layer
          id="country-boundaries"
          source="country-boundaries"
          source-layer="country_boundaries"
          type="fill"
          paint={{
            "fill-color": "rgba(0,0,0,0)",
          }}
        />
        <Layer
          id="country-boundaries-lines"
          source="country-boundaries"
          source-layer="country_boundaries"
          type="line"
          filter={filter}
          paint={{
            "line-color": "#ffffff",
            "line-width": 2,
          }}
        />
        <Layer
          id="country-boundaries-fill"
          source="country-boundaries"
          source-layer="country_boundaries"
          type="fill"
          filter={filter}
          paint={{
            "fill-color": "rgba( 0,232,250, .8 )",
          }}
        />
      </Source>
    </Map>
  );
}
