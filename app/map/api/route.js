import { fetcher } from "../../libs/custom";

export async function route() {
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_GEO}`;
  const response = await fetcher(apiUrl);
  const { latitude, longitude } = response;
  const currentCenter = { longitude, latitude };
  return currentCenter;
}
