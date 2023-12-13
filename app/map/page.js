import { route } from "./api/route";
import Mymap from "./comps/mymap";

const currentCenter = await route();

export default function Map() {
  return (
    <Mymap
      latitude={currentCenter.latitude}
      longitude={currentCenter.longitude}
    />
  );
}
