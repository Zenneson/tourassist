import { useState } from "react";
import Mymap from "../comps/map/mymap";
import Intro from "../comps/intro";

export default function Home(props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  let listOpened = props.listOpened;
  let setListOpened = props.setListOpened;
  let searchOpened = props.searchOpened;
  let dropDownOpened = props.dropDownOpened;
  let auth = props.auth;

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
