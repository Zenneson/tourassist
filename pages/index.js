import { useState } from "react";
import Mymap from "../comps/map/mymap";
import Intro from "../comps/intro";
import { getAuth } from "firebase/auth";

const auth = getAuth();

export default function Home(props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { listOpened, setListOpened, searchOpened, dropDownOpened } = props;

  return (
    <>
      <Intro auth={auth} mapLoaded={mapLoaded} />
      <Mymap
        listOpened={listOpened}
        setListOpened={setListOpened}
        searchOpened={searchOpened}
        dropDownOpened={dropDownOpened}
        mapLoaded={mapLoaded}
        setMapLoaded={setMapLoaded}
      />
    </>
  );
}
