import Mymap from "../comps/mymap";
import Intro from "../comps/intro";

export default function Home(props) {
  let setProfileShow = props.setProfileShow;
  let setProfileOpened = props.setProfileOpened;
  let listOpened = props.listOpened;
  let setListOpened = props.setListOpened;
  let searchOpened = props.searchOpened;
  let tripSelected = props.tripSelected;
  let setTripSelected = props.setTripSelected;
  let dropDownOpened = props.dropDownOpened;
  let auth = props.auth;

  return (
    <>
      <Intro auth={auth} />
      <Mymap
        setProfileShow={setProfileShow}
        setProfileOpened={setProfileOpened}
        listOpened={listOpened}
        setListOpened={setListOpened}
        searchOpened={searchOpened}
        tripSelected={tripSelected}
        setTripSelected={setTripSelected}
        dropDownOpened={dropDownOpened}
      />
    </>
  );
}
