import { useState } from "react";
import Mymap from "../comps/map/mymap";

export default function Map(props) {
  const {
    listOpened,
    setListOpened,
    searchOpened,
    dropDownOpened,
    mapLoaded,
    setMapLoaded,
  } = props;

  return (
    <>
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
