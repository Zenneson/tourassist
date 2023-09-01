import { useState, useEffect } from "react";
import { useMantineColorScheme, BackgroundImage, Box } from "@mantine/core";
import { useSessionStorage, useViewportSize } from "@mantine/hooks";
import { getAuth, signOut } from "firebase/auth";
import { loggedIn } from "../libs/custom";
import Intro from "../comps/intro";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { notifications } from "@mantine/notifications";
const moment = require("moment-timezone");

const auth = getAuth();

export default function Home() {
  const { height, width } = useViewportSize();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const slideSettings = {
    dots: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 5000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    "ppl/ppl1.jpg",
    "ppl/ppl2.jpg",
    "ppl/ppl3.jpg",
    "ppl/ppl4.jpg",
    "ppl/ppl5.jpg",
    "ppl/ppl6.jpg",
    "ppl/ppl7.jpg",
    "ppl/ppl8.jpg",
  ];

  const isWithin = (dateString, days) => {
    if (!dateString) return false;
    const inputDate = moment(dateString, "MMDDYY");
    const currentDate = moment().startOf("day");
    const daysDifference = currentDate.diff(inputDate, "days");
    return daysDifference >= 0 && daysDifference <= days;
  };

  const [dateChecked, setDateChecked] = useState(false);
  useEffect(() => {
    if (dateChecked || !user) return;
    if ((user && user.lastLogDate && isWithin(user.lastLogDate, 7)) === false) {
      setUser(null);
      signOut(auth);
    } else if (
      (user && user.lastLogDate && !isWithin(user.lastLogDate, 1)) === false ||
      (user && !user.lastLogDate)
    ) {
      const message = loggedIn(dark, user);
      notifications.show(message);
    }
    setDateChecked(true);
  }, [user, setUser, dateChecked, dark]);

  return (
    <>
      <Intro auth={auth} />
      <Box
        opacity={1}
        pos="absolute"
        w={width}
        h={height}
        sx={{
          zIndex: "1000",
          filter: "brightness(123%)",
          overflow: "hidden",
        }}
      >
        <Slider {...slideSettings}>
          {images.map((image, index) => (
            <BackgroundImage
              key={index}
              src={image}
              h={height}
              alt="intro"
              sx={{
                filter: dark
                  ? "brightness(70%) saturate(144%)"
                  : "brightness(110%) saturate(100%)",
              }}
            />
          ))}
        </Slider>
      </Box>
    </>
  );
}
