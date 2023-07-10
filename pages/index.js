import Mymap from "../comps/mymap";
import Intro from "../comps/intro";

export default function Home(props) {
  let setProfileShow = props.setProfileShow;
  let setProfileOpened = props.setProfileOpened;
  let listOpened = props.listOpened;
  let setListOpened = props.setListOpened;
  let searchOpened = props.searchOpened;
  let loginOpened = props.loginOpened;
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
        setListOpened={setListOpened}
        listOpened={listOpened}
        searchOpened={searchOpened}
        loginOpened={loginOpened}
        tripSelected={tripSelected}
        setTripSelected={setTripSelected}
        dropDownOpened={dropDownOpened}
      />
    </>
  );
}
