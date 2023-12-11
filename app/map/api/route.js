import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios";
import { fetcher } from "../../libs/custom";

// MAP FETCHER
export async function route() {
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_GEO}`;
  const response = await fetcher(apiUrl);
  const { latitude, longitude } = response;
  const currentCenter = { longitude, latitude };
  return currentCenter;
}

// GOOGLE PLACES API
let city = "New York";
const textConfig = {
  params: {
    key: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    type: "point_of_interest,establishment,tourist_attraction,park,museum,art_gallery,food,cafe,restaurant,bar,night_club,shopping_mall,stadium,amusement_park,aquarium,zoo,park,natural_feature,place_of_worship",
    query: `cityscape OR skyline OR sunset OR sunrise OR street food OR local markets OR festivals OR parks OR landmarks OR historic sites OR gardens OR rivers OR bridges OR cultural events OR public art OR architecture OR panoramic views OR crowds OR street performers OR outdoor activities OR nightlife in ${city}`,
  },
};
const textInstance = axios.create(textConfig);
const textClient = new Client(textInstance);

// textClient
//   .textSearch()
//   .then((response) => {
//     const results = response.data.results;
//     console.log("🚀 ~ file: route.js:27 ~ .then ~ results:", results);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const placesConfig = {
  baseURL: "https://maps.googleapis.com/maps/api/place",
  params: {
    key: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  },
};
const placesInstance = axios.create(placesConfig);
const placesClient = new Client(placesInstance);

// placesClient
//   .placePhoto()
//   .then((r) => {
//     console.log(r.data.results[0]);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
