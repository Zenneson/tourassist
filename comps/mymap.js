import { useMemo } from "react";
import {
  GoogleMap,
  useGoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

export default function Mymap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAeYHu9_AGQDASLgQ8xiZ_Hd4GvwhOtdQk",
    version: "beta",
  });

  const renderMap = () => (
    <GoogleMap
      id="mymap"
      zoom={4.2}
      center={{ lat: 40, lng: -88 }}
      mapContainerClassName="mapContainer"
      options={options}
      onLoad={addCountryLayer}
    ></GoogleMap>
  );

  return isLoaded ? renderMap() : <div>Loading...</div>;
}

const options = {
  disableDefaultUI: true,
  mapId: "d9abba45cff72fe",
};
const defaultStyle = {
  strokeColor: "#c32e26",
  strokeWeight: 1,
  fillColor: "#c32e26",
  fillOpacity: 0.1,
};
const clickedStyle = {
  ...defaultStyle,
  fillColor: "#c32e26",
  fillOpacity: 0.8,
};
let countryLayer;

function addCountryLayer(map) {
  if (!map.getMapCapabilities().isDataDrivenStylingAvailable) return;

  countryLayer = map.getFeatureLayer("COUNTRY");
  countryLayer.addListener("click", clickCountry);

  applyStyleToSelected();
}

function applyStyleToSelected(placeid) {
  countryLayer.style = (options) => {
    console.log(options.feature);
    if (placeid && options.feature.placeId == placeid) {
      return clickedStyle;
    }
    return defaultStyle;
  };
}

function clickCountry(event) {
  let feature = event.features[0];

  if (!feature.placeId) return;

  applyStyleToSelected(feature.placeId);
}
