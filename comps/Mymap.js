import { useState, useEffect, useRef, useMemo } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import bbox from "@turf/bbox";
import centerOfMass from "@turf/center-of-mass";

export default function Mymap() {
  const mapRef = useRef();
  const center = useRef();
  const [countryName, setCountryName] = useState('');
  const [popup, setPopup] = useState(false);

  const [allData, setAllData] = useState(null);
  const [clickedCountry, setClickedCountry] = useState(null);

  const filter = useMemo(() => ['in', 'name_en', countryName], [countryName]);
  useEffect(() => {
    fetch("data/countries.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data"));
  }, []);
  const setPopupInfo = () => {
    console.log(false)
    setPopup(false);
    // mapRef.current.setZoom(2.5);
    mapRef.current.setPitch(0);
    mapRef.current.flyTo({
      center: center.current.geometry.coordinates,
      zoom: 2.5,
      speed: 1,
      pitch: 0,
    });
  }
  const onEvent = (event) => {
    const country = event.features[0];

    if (country) {
      setCountryName(country.properties.name_en);
      center.current = centerOfMass(country);
      setPopup(true);
      // mapRef.current.flyTo({
      //   center: [center.current.geometry.coordinates[0], center.current.geometry.coordinates[1]],
      //   essential: true // this animation is considered essential with respect to prefers-reduced-motion 
      // });
      mapRef.current.fitBounds(bbox(country), {
        // easing: true,
        duration: 1000,
        linear: false,
      });
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
      interactiveLayerIds={["country-boundaries"]}
      mapStyle="mapbox://styles/zenneson/clbh8pxcu001f14nhm8rwxuyv"
      style={{ width: "100%", height: "100%" }}
      mapboxAccessToken="pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw"
    >
      {popup && (
        <Popup
          anchor="top"
          longitude={Number(center.current?.geometry.coordinates[0])}
          latitude={Number(center.current?.geometry.coordinates[1])}
          onClose={() => setPopupInfo()}
          closeButton={true}
          closeOnClick={false}
        >
          <div>
            Country name: {countryName}
          </div>
        </Popup>
      )}
      {/* <Source type="geojson" data={allData}>
        <Layer
          id="country-data"
          type="fill"
          paint={{
            "fill-color": "#00e8fc",
            "fill-opacity": 0,
          }}
        />
      </Source> */}
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
            "line-width": 2
          }}

        />
        <Layer
          id="country-boundaries-fill"
          source="country-boundaries"
          source-layer="country_boundaries"
          type="fill"
          filter={filter}
          paint={{
            "fill-color": "rgba( 255, 255, 255, .5 )",
          }}
        />
      </Source>

    </Map>
  );
}
