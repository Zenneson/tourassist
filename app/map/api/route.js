import { Client } from "@googlemaps/google-maps-services-js";
import { fetcher } from "@libs/custom";
import axios from "axios";

// MAP FETCHER
export const route = async () => {
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_GEO}`;
  const response = await fetcher(apiUrl);
  const { latitude, longitude } = response;
  const currentCenter = { longitude, latitude };
  return currentCenter;
};

// GOOGLE PLACES API

// const fetchPlaceData = async () => {
//   const textQuery = "City Landmarks in Paris"; // Replace with your query
//   const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
//   const url = "https://places.googleapis.com/v1/places:searchText";
//   const fieldMask = "places.photos"; // Include other fields as needed

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Goog-Api-Key': apiKey,
//         'X-Goog-FieldMask': fieldMask
//       },
//       body: JSON.stringify({ textQuery })
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const data = await response.json();
//     return data.places.map(place => place.photos); // Extracting photo references
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// };

// fetchPlaceData().then(photoRefs => {
//   console.log(photoRefs); // Process photo references as needed
// });

// const fetchPlacePhoto = async (photoReference) => {
//   const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
//   const maxHeight = 400; // Set desired max height
//   const maxWidth = 400; // Set desired max width
//   const url = `https://maps.googleapis.com/maps/api/place/photo?maxheight=${maxHeight}&maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.url; // This is the URL of the photo
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// };

// // Example usage
// fetchPlaceData().then(photoRefs => {
//   if (photoRefs.length > 0) {
//     fetchPlacePhoto(photoRefs[0][0].photoReference) // Assuming the first photo reference of the first place
//       .then(photoUrl => {
//         console.log(photoUrl); // Process the photo URL as needed
//       });
//   }
// });

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

const placesConfig = {
  baseURL: "https://maps.googleapis.com/maps/api/place",
  params: {
    key: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  },
};
const placesInstance = axios.create(placesConfig);
const placesClient = new Client(placesInstance);
