import fs from "fs";
import path from "path";
import Mymap from "../comps/map/mymap";

export const getServerSideProps = async () => {
  const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_GEO}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Failed to fetch API:", response.statusText);
      return {
        props: {
          country_center: [37, -95],
        },
      };
    }

    const data = await response.json();
    const { country_name } = data;

    if (country_name === "United States") {
      return {
        props: {
          country_center: [-95, 37],
        },
      };
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "worldcitiesdata.json"
    );
    const jsonData = fs.readFileSync(filePath, "utf8");
    const worldCitiesData = JSON.parse(jsonData);

    const countryData = worldCitiesData.find(
      (countryObj) => countryObj.country === country_name
    );
    const countryCenter = countryData ? countryData.counrty_center : [-95, 37];

    return {
      props: {
        country_name,
        country_center: countryCenter,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        country_center: countryCenter,
        error: error.message,
      },
    };
  }
};

export default function Map(props) {
  return (
    <>
      <Mymap
        country_name={props.country_name}
        country_center={props.country_center}
        listOpened={props.listOpened}
        setListOpened={props.setListOpened}
        searchOpened={props.searchOpened}
        dropDownOpened={props.dropDownOpened}
        mapLoaded={props.mapLoaded}
        mainMenuOpened={props.mainMenuOpened}
        setMainMenuOpened={props.setMainMenuOpened}
        panelShow={props.panelShow}
        setPanelShow={props.setPanelShow}
        setMapLoaded={props.setMapLoaded}
      />
    </>
  );
}
