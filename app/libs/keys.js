let cloudRun = false;
const isCloudRun = () => {
  if (process.env.GOOGLE_CLOUD_PROJECT || process.env.K_SERVICE) return true;
};

export const mapboxAccessToken = cloudRun
  ? "projects/tourassist-836db/secrets/NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN/versions/latest"
  : process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const duffelAccessKey = cloudRun
  ? "projects/tourassist-836db/secrets/NEXT_PUBLIC_DUFFEL_AC/versions/latest"
  : process.env.NEXT_PUBLIC_DUFFEL_AC;

export const geoAccessToken = cloudRun
  ? "projects/tourassist-836db/secrets/NEXT_PUBLIC_IP_GEO/versions/latest"
  : process.env.NEXT_PUBLIC_IP_GEO;

export const googleApiKey = cloudRun
  ? "projects/tourassist-836db/secrets/NEXT_PUBLIC_GOOGLE_PLACES_API_KEY/versions/latest"
  : process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export const fireKey = cloudRun
  ? "projects/tourassist-836db/secrets/NEXT_PUBLIC_FIREBASE_API_KEY/versions/latest"
  : process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
