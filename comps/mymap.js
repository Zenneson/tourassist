import { useMemo } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
      ></GoogleMap>
    </LoadScript>
  );
}
