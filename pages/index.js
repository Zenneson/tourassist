import Mymap from "../comps/Mymap";
import { useRecoilState } from "recoil";
import { IconList } from "@tabler/icons";
import { listOpenedState, placeListState } from "../libs/atoms";
import { Button } from "@mantine/core";
import Intro from "../comps/intro";

export default function Home(props) {
  const [listOpened, setListOpened] = useRecoilState(listOpenedState);
  const [places, setPlaces] = useRecoilState(placeListState);

  return (
    <>
      <Intro />
      {places.length >= 1 && !listOpened && (
        <Button
          onClick={() => setListOpened(true)}
          sx={{
            backgroundColor: "#020202",
            opacity: 0.35,
            borderRadius: "0 5px 5px 0",
            position: "absolute",
            top: "105px",
            left: "0",
            padding: "0 8px",
            transition: "all 100ms ease-in-out",
            zIndex: 120,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
            "&:hover": {
              opacity: 1,
              backgroundColor: "#020202",
            },
          }}
        >
          <IconList size={15} />
        </Button>
      )}
      <Mymap />
    </>
  );
}
