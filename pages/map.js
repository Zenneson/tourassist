import { useEffect } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { signOut } from "firebase/auth";
import { loggedIn } from "../libs/custom";
import { notifications } from "@mantine/notifications";
import fs from "fs";
import path from "path";
import Mymap from "../comps/map/mymap";
const moment = require("moment-timezone");

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
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const isWithin = (dateString, days) => {
    if (!dateString) return false;
    const inputDate = moment(dateString, "MMDDYY");
    const currentDate = moment().startOf("day");
    const daysDifference = currentDate.diff(inputDate, "days");
    return daysDifference >= 0 && daysDifference <= days;
  };

  const [dateChecked, setDateChecked] = useSessionStorage({
    key: "dateChecked",
    defaultValue: false,
  });

  useEffect(() => {
    if (dateChecked || !user) return;
    if ((user && user.lastLogDate && isWithin(user.lastLogDate, 7)) === false) {
      setUser(null);
      signOut(auth);
    } else if (
      (user && user.lastLogDate && !isWithin(user.lastLogDate, 1)) ||
      (user && !user.lastLogDate)
    ) {
      const message = loggedIn(dark, user);
      notifications.show(message);
    }
    setDateChecked(true);
  }, [dark, user, setUser, dateChecked, setDateChecked]);

  if (props.error) console.log(props.error);
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
        setMainMenuOpened={props.setMainMenuOpened}
        setMapLoaded={props.setMapLoaded}
      />
    </>
  );
}
