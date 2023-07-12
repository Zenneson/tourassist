import Mymap from "../comps/mymap";
import Intro from "../comps/intro";

export default function Home(props) {
  let setPanelShow = props.setPanelShow;
  let setMainMenuOpened = props.setMainMenuOpened;
  let listOpened = props.listOpened;
  let setListOpened = props.setListOpened;
  let searchOpened = props.searchOpened;
  let dropDownOpened = props.dropDownOpened;
  let auth = props.auth;

  return (
    <>
      <Intro auth={auth} />
      <Mymap
        setPanelShow={setPanelShow}
        setMainMenuOpened={setMainMenuOpened}
        listOpened={listOpened}
        setListOpened={setListOpened}
        searchOpened={searchOpened}
        dropDownOpened={dropDownOpened}
      />
    </>
  );
}
