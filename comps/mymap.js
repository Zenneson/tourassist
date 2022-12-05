import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function Mymap() {
  const { isLoaded } = useLoadScript({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: "AIzaSyAeYHu9_AGQDASLgQ8xiZ_Hd4GvwhOtdQk",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  return (
    <GoogleMap
      zoom={4.7}
      center={{ lat: 40, lng: -88 }}
      mapContainerClassName="mapContainer"
      mapId="d9abba45cff72fe"
    ></GoogleMap>
  );
}
