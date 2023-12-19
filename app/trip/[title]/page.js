import { getTripData } from "./api/route";
import TripWrapper from "./comps/tripWrapper";

export default async function Trippage(props) {
  const title = props.params.title;
  const tripData = await getTripData(title);

  return <TripWrapper title={title} dbTripData={tripData} />;
}
