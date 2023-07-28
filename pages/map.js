import Mymap from "../comps/map/mymap";

export default function Map(props) {
  return (
    <>
      <Mymap
        listOpened={props.listOpened}
        setListOpened={props.setListOpened}
        searchOpened={props.searchOpened}
        dropDownOpened={props.dropDownOpened}
        mapLoaded={props.mapLoaded}
        setMainMenuOpened={props.setMainMenuOpened}
        setMapLoaded={props.setMapLoaded}
      />
    </>
  );
}
