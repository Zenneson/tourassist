import { useCallback, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";

let map, infoWindow, countryLayer;

export default function Mymap() {
  const mapRef = useRef();
  const onLoad = useCallback(function onLoad(mapInstance) {
    mapRef.current = mapInstance;
    map = mapInstance;
    addCountryLayer(mapInstance);
  }, []);

  return (
    <GoogleMap
      id="mymap"
      zoom={4.2}
      center={{ lat: 40, lng: -88 }}
      mapContainerStyle={containerStyle}
      options={options}
      onLoad={onLoad}
    ></GoogleMap>
  );
}

const containerStyle = {
  width: "100%",
  height: "100vh",
};
const options = {
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
  clickableIcons: false,
  keyboardShortcuts: false,
  maxZoom: 13,
  minZoom: 4,
  gestureHandling: "greedy",
  mapId: "d9abba45cff72fe",
};
const defaultStyle = {
  strokeColor: "#fff",
  strokeWeight: 0.01,
  fillColor: "#fff",
  fillOpacity: 0.01,
};
const clickedStyle = {
  ...defaultStyle,
  fillColor: "#c32e26",
  fillOpacity: 0.8,
};

function addCountryLayer(map) {
  if (!map.getMapCapabilities().isDataDrivenStylingAvailable) return;

  countryLayer = map.getFeatureLayer("COUNTRY");
  countryLayer.addListener("click", clickCountry);
  infoWindow = new google.maps.InfoWindow({});

  applyStyleToSelected();
}

function applyStyleToSelected(placeid) {
  countryLayer.style = (options) => {
    if (placeid && options.feature.placeId == placeid) {
      return clickedStyle;
    }
    return defaultStyle;
  };
}

function clickCountry(event) {
  let feature = event.features[0];

  if (!feature.placeId) return;

  console.log(feature.placeId);
  applyStyleToSelected(feature.placeId);

  let content =
    '<span style="font-size:small">Display name: ' +
    feature.displayName +
    "<br/> Place ID: " +
    feature.placeId +
    "<br/> Feature type: " +
    feature.featureType +
    "</span>";

  updateInfoWindow(content, event.latLng);
}

function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    shouldFocus: false,
  });
}
