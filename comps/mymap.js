import { useMemo } from "react";
import {
  GoogleMap,
  useGoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

export default function Mymap() {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAeYHu9_AGQDASLgQ8xiZ_Hd4GvwhOtdQk"
      version="beta"
    >
      <GoogleMap
        id="mymap"
        zoom={4.7}
        center={{ lat: 40, lng: -88 }}
        mapContainerClassName="mapContainer"
        options={{ disableDefaultUI: true, mapId: "d9abba45cff72fe" }}
        onLoad={addCountryLayer}
      ></GoogleMap>
    </LoadScript>
  );
}

function addCountryLayer(map) {
  const countryLayer = map.getFeatureLayer(google.maps.FeatureType.COUNTRY);
  countryLayer.style = {
    strokeColor: "#c32e26",
    strokeWeight: 1,
    fillColor: "#c32e26",
    fillOpacity: 0.2,
  };
}
