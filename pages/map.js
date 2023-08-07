import Mymap from "../comps/map/mymap";

export const getServerSideProps = async () => {
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_GEO}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Failed to fetch API:", response.statusText);
      return {
        props: {
          latitude: 37,
          longitude: -95,
        },
      };
    }

    const data = await response.json();
    const { latitude, longitude } = data;
    return {
      props: {
        latitude,
        longitude,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        latitude: 37,
        longitude: -95,
      },
    };
  }
};

export default function Map(props) {
  return (
    <>
      <Mymap
        latitude={props.latitude}
        longitude={props.longitude}
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
