import Mymap from "../comps/mymap";
import Intro from "../comps/intro";
import DropDown from "../comps/dropdown";

export default function Home(props) {
  let setProfileShow = props.setProfileShow;
  let setProfileOpened = props.setProfileOpened;
  let listOpened = props.listOpened;
  let setListOpened = props.setListOpened;
  let searchOpened = props.searchOpened;
  let places = props.places;
  let setPlaces = props.setPlaces;
  let loginOpened = props.loginOpened;
  let tripSelected = props.tripSelected;
  let setTripSelected = props.setTripSelected;
  let dropDownOpened = props.dropDownOpened;
  let setDropDownOpened = props.setDropDownOpened;
  let auth = props.auth;

  return (
    <>
      <Intro auth={auth} />
      <DropDown
        dropDownOpened={dropDownOpened}
        setDropDownOpened={setDropDownOpened}
      />
      <Mymap
        setProfileShow={setProfileShow}
        setProfileOpened={setProfileOpened}
        setListOpened={setListOpened}
        listOpened={listOpened}
        searchOpened={searchOpened}
        places={places}
        setPlaces={setPlaces}
        loginOpened={loginOpened}
        tripSelected={tripSelected}
        setTripSelected={setTripSelected}
        dropDownOpened={dropDownOpened}
      />
    </>
  );
}
