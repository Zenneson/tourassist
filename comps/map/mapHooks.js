import { useRef } from "react";
import { atom } from "jotai";
import centerOfMass from "@turf/center-of-mass";
import { getNewCenter } from "../../public/data/getNewCenter";
import { IconAlertTriangle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export const mainMenuOpenedAtom = atom(false, (get, set, update) =>
  set(mainMenuOpenedAtom, update)
);

export const areaAtom = atom({ label: "" }, (get, set, update) =>
  set(areaAtom, update)
);

export const topCitiesAtom = atom([], (get, set, update) =>
  set(topCitiesAtom, update)
);

export const countrySearchAtom = atom("", (get, set, update) =>
  set(countrySearchAtom, update)
);

export const placeSearchAtom = atom("", (get, set, update) =>
  set(placeSearchAtom, update)
);

export const countrySearchDataAtom = atom("", (get, set, update) =>
  set(countrySearchDataAtom, update)
);

export const placeSearchDataAtom = atom("", (get, set, update) =>
  set(placeSearchDataAtom, update)
);

export const locationDrawerAtom = atom("", (get, set, update) =>
  set(locationDrawerAtom, update)
);

export const lngLatAtom = atom([0, 0], (get, set, update) =>
  set(lngLatAtom, update)
);

export const showStatesAtom = atom(false, (get, set, update) =>
  set(showStatesAtom, update)
);

export const listStatesAtom = atom(false, (get, set, update) =>
  set(listStatesAtom, update)
);

export const showMainMarkerAtom = atom(false, (get, set, update) =>
  set(showMainMarkerAtom, update)
);

export const showModalAtom = atom(false, (get, set, update) =>
  set(showModalAtom, update)
);

export const placesAtom = atom([], (get, set, update) =>
  set(placesAtom, update)
);

export const placeLocationAtom = atom({}, (get, set, update) =>
  set(placeLocationAtom, update)
);

export const listOpenedAtom = atom({}, (get, set, update) =>
  set(listOpenedAtom, update)
);

const addPlaces = (place) => {
  let newPlace = JSON.parse(JSON.stringify(place));
  newPlace.order = places.length + 1;
  let newPlaces = [...places, newPlace];
  setPlaces(newPlaces);
};

const checkPlace = (place) => {
  let placeExists = false;
  places.forEach((p) => {
    if (p.place === place.place && p.region === place.region) {
      placeExists = true;
    }
  });
  return placeExists;
};

const fetchCities = async (location) => {
  try {
    const path =
      location.country === "United States"
        ? "/data/uscitiesdata.json"
        : "/data/worldcitiesdata.json";
    const res = await fetch(path);
    const data = await res.json();

    if (!data) {
      return {
        notFound: true,
      };
    }

    const filterKey =
      location.country === "United States" && location.type === "region"
        ? "state"
        : "country";
    const dataArray = data.filter((region) => {
      if (!region[filterKey]) return;
      const filterKeyLower = region[filterKey].toLowerCase();
      const labelLower = location.label.toLowerCase();
      return filterKeyLower === labelLower;
    });
    const regionCities = dataArray[0]?.cities;
    let topFive = [];
    regionCities &&
      regionCities.map((city) => {
        topFive.push([city.name, city.center, location.label]);
      });
    atom({ key: "topCities", default: topFive });
  } catch (error) {
    console.error("Error:", error);
    return {
      notFound: true,
    };
  }
};

const usStates = async () => {
  try {
    const res = await fetch("/data/uscitiesdata.json");
    const data = await res.json();

    if (!data) {
      return {
        notFound: true,
      };
    }

    let states = [];
    data.map((state) => {
      states.push({
        value: state.state,
        label: state.state,
        center: state.center,
        country: "United States",
      });
    });
    atom({ key: "listStatesAtom", default: states });
  } catch (error) {
    console.error("Error:", error);
    return {
      notFound: true,
    };
  }
};

const getCords = (feature) => {
  let center = feature.center;
  if (feature && feature.geometry && feature.geometry.type) {
    center = centerOfMass(feature);
  }
  return center?.geometry.coordinates;
};

export const resetState = (center) => {
  atom({
    key: "countrySearch",
    default: "",
  });
  atom({
    key: "placeSearch",
    default: "",
  });
  atom({
    key: "countrySearchData",
    default: [],
  });
  atom({
    key: "placeSearchData",
    default: [],
  });
  atom({
    key: "locationDrawer",
    default: true,
  });
  atom({
    key: "lngLat",
    default: center,
  });
};

export const locationHandler = (feature, mapRef) => {
  console.log("FEATURE:    ", feature);

  atom({ key: "topCities", default: [] });

  if (feature == null) return;
  let locationObj = {};
  locationObj.type =
    feature.group ||
    (feature.source === "country-boundaries" ? "country" : "region") ||
    "city";
  locationObj.type = locationObj.type.toLowerCase();
  locationObj.label =
    feature.label ||
    feature.properties?.name_en ||
    feature.properties?.name ||
    feature.properties?.NAME ||
    "";
  locationObj.country =
    feature.country ||
    (feature.properties?.NAME && "United States") ||
    feature.properties?.name_en ||
    "";
  locationObj.state = feature.region || feature.properties?.NAME || "";
  locationObj.center = feature.center || getCords(feature);
  locationObj.shortcode =
    feature.shortcode ||
    feature.isoName ||
    feature.properties?.iso_3166_1 ||
    "";
  locationObj.shortcode = locationObj.shortcode.toLowerCase();
  if (locationObj.label === "Czech Republic") locationObj.label = "Czechia";
  if (locationObj.label === "Aland Islands")
    locationObj.label = "Åland Islands";
  if (locationObj.label === "East Timor") locationObj.label = "Timor-Leste";
  if (locationObj.label === "Myanmar") locationObj.label = "Myanmar (Burma)";
  if (locationObj.label === "Réunion") locationObj.label = "Reunion";
  if (locationObj.label === "Saint Barthélemy")
    locationObj.label = "Saint-Barthélemy";

  resetState(locationObj.center);
  goToLocation(locationObj, mapRef);
};

const calcView = (place) => {
  const { country, type, label } = place;
  let zoom = getNewCenter(place).maxZoom;
  let pitch = 40;
  atom({ key: "areaAtom", default: place });

  if ((country === "United States" && type === "region") || type !== "city") {
    fetchCities(place);
  }
  if (country === "United States" && type === "country") {
    usStates(place);
    pitch = 25;
  }
  if (type === "city" || (country !== "United States" && type === "region")) {
    zoom = 12;
    pitch = 75;
    if (label === "District of Columbia") {
      zoom = 10;
    }
  }
  return { zoom, pitch };
};

export const goToLocation = (place, mapRef) => {
  const { zoom, pitch } = calcView(place);
  const coords =
    place.type === "country" ? getNewCenter(place).newCenter : place.center;

  atom({
    key: "showStatesAtom",
    default: false,
  });
  atom({
    key: "showMainMarkerAtom",
    default: false,
  });

  let newCoords = coords;
  if (newCoords && Array.isArray(newCoords)) {
    newCoords = { lng: newCoords[0], lat: newCoords[1] };
  } else if (newCoords && newCoords.lon) {
    newCoords = { lng: newCoords.lon, lat: newCoords.lat };
  }

  place.type === "country" &&
    mapRef.current.flyTo({
      center: newCoords,
      zoom: 3,
      duration: 800,
      pitch: 0,
    });

  const moveTime = place.type === "country" ? 400 : 200;
  const moveDuration = place.type === "country" ? 1500 : 2200;

  setTimeout(() => {
    mapRef.current?.flyTo({
      center: coords,
      duration: moveDuration,
      zoom: zoom,
      pitch: pitch,
      essential: true,
    });
  }, moveTime);
};

export const choosePlace = (choice) => {
  atom({ key: "mainMenuOpenedAtom", default: false });
  const place = {
    label: area.label,
    place: area.label,
    type: area.type,
    coordinates: area.center,
    country: area.country,
    region:
      area.type === "city" && area.country === "United States"
        ? `${area.state || area.region}, ${area.country}`
        : area.country === area.label
        ? ""
        : area.country,
  };

  atom({ key: "placeLocationAtom", default: [place] });
  if (choice === "tour") {
    atom({ key: "listOpenedAtom", default: true });
    if (checkPlace(place)) {
      notifications.show({
        color: "orange",
        icon: <IconAlertTriangle size={20} />,
        style: {
          backgroundColor: dark ? "#2e2e2e" : "#fff",
        },
        title: "Location already added",
        message: `${area.label} was already added to your tour`,
      });
      return;
    }
    addPlaces(place);
    resetGlobe();
  }
  if (choice === "travel") {
    atom({ key: "showModalAtom", default: true });
  }
};

const placeType = (place) => {
  if (place === "country" || place.type === "country") return "Country";
  if (place === "region" || place.type === "region") return "Region";
  if (place === "place" || place.type === "place") return "City";
};

export const handleChange = async (field) => {
  let shortCode = area.shortcode;
  if (field === "place" && area.country === "United States") shortCode = "us";

  let endpoint;
  if (field === "country") {
    endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${countrySearch}.json?&autocomplete=true&fuzzyMatch=true&limit=5&types=country%2Cregion%2Cplace&language=en&access_token=${mapboxAccessToken}`;
  } else {
    endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeSearch}.json?country=${shortCode}&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion&limit=5&language=en&access_token=${mapboxAccessToken}`;
  }

  try {
    const response = await fetch(endpoint);
    const results = await response.json();
    const data = results.features.map((feature) => ({
      label: feature.text,
      value: feature.id,
      id: feature.id,
      type: feature.place_type[0],
      group: placeType(feature.place_type[0]),
      country: feature.place_name.split(", ").pop(),
      region: feature.place_name.split(", ", 2)[1],
      center: feature.center,
      shortcode: feature.properties?.short_code,
    }));

    const searchData = data.map((item) => {
      if (item.value === "place.345549036") {
        return {
          ...item,
          label: "Washington D.C.",
        };
      }
      return item;
    });

    if (field === "country")
      atom({ key: "countrySearchDataAtom", default: searchData });
    if (field === "place")
      atom({ key: "placeSearchDataAtom", default: searchData });
  } catch (error) {
    console.error("Error fetching data for Country Autocomplete: ", error);
  }
};
