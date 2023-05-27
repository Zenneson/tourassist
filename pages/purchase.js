import { useState, useRef } from "react";
import {
  Box,
  Badge,
  Card,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  Image,
  Title,
  Text,
  Space,
  Stack,
  Rating,
  Button,
} from "@mantine/core";
import {
  IconPlane,
  IconMapPin,
  IconPlaneDeparture,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconHourglass,
  IconArrowBigLeft,
  IconArrowBigRight,
} from "@tabler/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Purchase() {
  const [viewAlts, setViewAlts] = useState(false);
  const [isStartOfFlights, setIsStartOfFlights] = useState(true);
  const [isEndOfFlights, setIsEndOfFlights] = useState(false);
  const [isStartOfHotels, setIsStartOfHotels] = useState(true);
  const [isEndOfHotels, setIsEndOfHotels] = useState(false);

  const flightSettings = {
    swipeToSlide: true,
    speed: 250,
    cssEase: "linear",
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1390,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1055,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
    afterChange: function (currentSlide) {
      setIsEndOfFlights(
        currentSlide + flightSettings.slidesToShow >= flightData.length
      );
      setIsStartOfFlights(currentSlide === 0);
    },
  };

  const hotelSettings = {
    swipeToSlide: true,
    speed: 250,
    cssEase: "linear",
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1390,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1055,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
    afterChange: function (currentSlide) {
      setIsEndOfHotels(
        currentSlide + hotelSettings.slidesToShow >= hotelData.length
      );
      setIsStartOfHotels(currentSlide === 0);
    },
  };

  const flightSlider = useRef();
  const hotelSlider = useRef();

  const nextFlightSlide = () => {
    flightSlider.current.slickNext();
  };

  const prevFlightSlide = () => {
    flightSlider.current.slickPrev();
  };

  const nextHotelSlide = () => {
    hotelSlider.current.slickNext();
  };

  const prevHotelSlide = () => {
    hotelSlider.current.slickPrev();
  };

  const flightData = [
    {
      airline: "American",
      price: 617,
      duration: "16h 40m ( 1 stop )",
      depatureLocale: "DCA",
      arrivalLocale: "MEX",
      depatureTime: "6:30 AM",
      arrivalTime: "11:10 PM",
    },
    {
      airline: "United",
      price: 530,
      duration: "10h 40m ( 1 stop )",
      depatureLocale: "DCA",
      arrivalLocale: "MEX",
      depatureTime: "6:30 AM",
      arrivalTime: "6:10 PM",
    },
    {
      airline: "Delta",
      price: 584,
      duration: "13h 40m ( 1 stop )",
      depatureLocale: "BWI",
      arrivalLocale: "MEX",
      depatureTime: "9:30 AM",
      arrivalTime: "11:10 PM",
    },
    {
      airline: "Southwest",
      price: 640,
      duration: "12h 40m",
      depatureLocale: "BWI",
      arrivalLocale: "MEX",
      depatureTime: "10:30 AM",
      arrivalTime: "11:10 PM",
    },
    {
      airline: "Spirit",
      price: 570,
      duration: "8h 10m",
      depatureLocale: "DCA",
      arrivalLocale: "MEX",
      depatureTime: "10:00 AM",
      arrivalTime: "7:10 PM",
    },
    {
      airline: "Emirates",
      price: 1000,
      duration: "8h 10m",
      depatureLocale: "DCA",
      arrivalLocale: "MEX",
      depatureTime: "10:00 AM",
      arrivalTime: "7:10 PM",
    },
  ];

  const flights = flightData.map((flight, index) => (
    <Card key={index} p={"lg"} maw={"95%"} ml={"2.5%"} bg={"rgba(0,0,0,0.25)"}>
      <Group position="apart">
        <Badge size={"sm"}>{flight.airline}</Badge>
        <Title order={2} mr={5} ta={"right"} color="lime">
          ${flight.price}
        </Title>
      </Group>
      <Divider
        mt={5}
        labelPosition="center"
        label={<Text fw={700}>{flight.duration}</Text>}
        w={"100%"}
      />
      <Group position="apart" px={10} mt={10} spacing={0}>
        <Box ta={"center"}>
          <Title order={2}>{flight.depatureLocale}</Title>
          <Text size="xs" color="dimmed">
            {flight.depatureTime}
          </Text>
        </Box>
        <Group pb={15} opacity={0.4} spacing={5}>
          - <IconPlane size={20} /> -
        </Group>
        <Box ta={"center"}>
          <Title order={2}>{flight.arrivalLocale}</Title>
          <Text size="xs" color="dimmed">
            {flight.arrivalTime}
          </Text>
        </Box>
      </Group>
    </Card>
  ));

  const hotelData = [
    {
      image: "/img/intro/beach.jpg",
      name: "Hermoso alojamiento en Villa Cardiel Real Ibiza Playa del Carmen",
      location: "Av Revolucion 333, Tacubaya, Mexico City, Mexico",
      rating: 4,
      feature: "1 King Bed",
      price: 111,
    },
    {
      image: "/img/intro/coast.jpg",
      name: "El Serafin Hotel BoutiqueOpens in new window",
      location: "Independencia 22, 76000 Querétaro, Mexico",
      rating: 3,
      feature: "2 Queen Beds",
      price: 120,
    },
    {
      image: "/img/intro/boat.jpg",
      name: "Un Sueño Cabañas del Pacífico",
      location:
        "Calle Principal, Lado Playa, Playa San Agustinillo, 70946 San Agustinillo, Mexico",
      rating: 5,
      feature: "1 King Bed",
      price: 240,
    },
    {
      image: "/img/intro/planewindow.jpg",
      name: "Hotel Kavia Plus",
      location:
        "Av. Yaxchilan, Mz 15, Lote 13, SM 22 Entre calle Gladiolas y calle Orquideas, 77500 Cancún, Mexico ",
      rating: 4,
      feature: "1 Queen Bed",
      price: 111,
    },
    {
      image: "/img/intro/plane.jpg",
      name: "Quinta Maria en la Ruta del Vino",
      location:
        "Calle Grenache, 1. Rancho Jesus Maria. San Antonio de las Minas, 22760 Valle de Guadalupe, Mexico",
      rating: 4,
      feature: "1 King Bed",
      price: 150,
    },
    {
      image: "/img/intro/concert.jpg",
      name: "Quinta Maria en la Ruta del Vino",
      location:
        "Calle Grenache, 1. Rancho Jesus Maria. San Antonio de las Minas, 22760 Valle de Guadalupe, Mexico",
      rating: 4,
      feature: "1 King Bed",
      price: 150,
    },
  ];

  const hotels = hotelData.map((hotel, index) => (
    <Card key={index} p={"lg"} maw={"95%"} ml={"2.5%"} bg={"rgba(0,0,0,0.25)"}>
      <Card.Section mb={10}>
        <Image src={hotel.image} alt="Hotel Image" />
      </Card.Section>
      <Title order={6} lineClamp={1}>
        {hotel.name}
      </Title>
      <Text size="xs" color="dimmed" lineClamp={1}>
        <IconMapPin size={12} /> {hotel.location}
      </Text>
      <Divider
        mt={10}
        mb={5}
        labelPosition="center"
        label={<Rating defaultValue={4} color="blue" />}
        w={"100%"}
      />
      <Group position="apart">
        <Badge size={"md"}>{hotel.feature}</Badge>
        <Title order={2} ta={"right"} color="lime">
          ${hotel.price}
        </Title>
      </Group>
    </Card>
  ));

  return (
    <>
      <Space h={150} />
      <Center>
        <Box w={"70%"} miw={700} maw={1600}>
          <Group w={"100%"} position="apart" mb={30}>
            <Box w={"60%"}>
              <Title order={4} opacity={0.3} fs={"italic"}>
                Help me raise money to go on a Music Tour
              </Title>
              <Box
                mt={10}
                pl={12}
                pt={1}
                pb={10}
                sx={{
                  borderLeft: "2px solid rgba(255,255,255,0.035)",
                  cursor: "default",
                }}
              >
                <Group fz={11} mt={5} ml={2}>
                  <Text color="blue.2">Silver Spring</Text>→
                  <Text color="blue.2">Mexico</Text>→
                  <Text color="blue.2">Grenada</Text>→
                  <Text color="blue.2">Silver Spring</Text>
                </Group>
                <Flex align={"center"} gap={15} fz={13} mt={5}>
                  <Group spacing={5}>
                    <IconCalendarEvent size={15} opacity={0.2} /> May 5, 2024{" "}
                  </Group>
                  <Group spacing={5}>
                    <IconHourglass size={15} opacity={0.2} /> 45 Days Left
                  </Group>
                </Flex>
              </Box>
            </Box>
            <Box
              ta={"right"}
              pl={20}
              pr={5}
              pb={15}
              pt={5}
              sx={{
                borderRadius: "0 0 0 25px",
                borderBottom: "2px solid rgba(255,255,255,0.025)",
                borderLeft: "2px solid rgba(255,255,255,0.025)",
              }}
            >
              <Title opacity={0.2} fz={45}>
                $1,234.56
              </Title>
              <Text size="xs" color="dimmed" mt={-5}>
                AVIABLE FUNDS
              </Text>
            </Box>
          </Group>
          <Box
            p={20}
            mb={20}
            radius={3}
            bg={"rgba(0,0,0,0.3)"}
            w={"100%"}
            sx={{
              boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
              borderLeft: "2px solid rgba(255,255,255,0.035)",
            }}
          >
            <Group position="apart">
              <Stack
                spacing={0}
                pl={10}
                pt={5}
                pb={10}
                sx={{
                  borderLeft: "5px solid rgba(150,150,150,0.1)",
                }}
              >
                <Title
                  order={4}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  MEXICO
                </Title>
                <Text size="xs" color="dimmed">
                  Mexico, Region
                </Text>
              </Stack>
              <Flex gap={5} mr={5} mt={viewAlts ? 0 : -28}>
                <Stack pt={2} spacing={5}>
                  <Group spacing={7}>
                    {viewAlts && <Checkbox mr={5} checked color="gray" />}
                    <Badge variant="outline" color="gray" size="xs">
                      Silver Spring
                    </Badge>
                    <Text opacity={0.2}>→</Text>
                    <Badge variant="outline" color="gray" size="xs">
                      Mexico
                    </Badge>
                  </Group>
                  {viewAlts && (
                    <Group spacing={7}>
                      <Checkbox mr={5} color="gray" />
                      <Badge variant="outline" color="gray" size="xs">
                        Silver Spring
                      </Badge>
                      <Text opacity={0.2}>→</Text>
                      <Badge variant="outline" color="gray" size="xs">
                        Grenada
                      </Badge>
                    </Group>
                  )}
                </Stack>
                <Box
                  ml={5}
                  pl={2}
                  sx={{
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Button
                    variant="light"
                    radius={"xl"}
                    ml={5}
                    fz={8}
                    px={15}
                    compact
                    onClick={() => setViewAlts(!viewAlts)}
                  >
                    {viewAlts ? "HIDE" : "VIEW"} ALTS
                  </Button>
                </Box>
              </Flex>
            </Group>
            <Divider
              mt={15}
              color="dark"
              mb={10}
              size={"sm"}
              label={
                <Text fw={700} fz={14} fs={"italic"}>
                  <IconPlaneDeparture size={15} /> FLIGHTS
                </Text>
              }
            />
            <Box pos={"relative"}>
              <Button.Group
                pos={"absolute"}
                top={-35}
                right={0}
                display={
                  flightData.length >= flightSettings.slidesToShow
                    ? "inline-block"
                    : "none"
                }
              >
                <Button
                  variant="filled"
                  color="dark"
                  size="xs"
                  onClick={prevFlightSlide}
                  display={!isStartOfFlights ? "inline-block" : "none"}
                >
                  <IconArrowBigLeft size={15} />
                </Button>
                <Button
                  variant="filled"
                  color="dark"
                  size="xs"
                  display={
                    flightData.length > flightSettings.slidesToShow &&
                    !isEndOfFlights
                      ? "inline-block"
                      : "none"
                  }
                  onClick={nextFlightSlide}
                >
                  <IconArrowBigRight size={15} />
                </Button>
              </Button.Group>
              <Slider ref={flightSlider} {...flightSettings}>
                {flights}
              </Slider>
            </Box>
            <Divider
              mt={15}
              color="dark"
              mb={10}
              size={"sm"}
              label={
                <Text fw={700} fz={14} fs={"italic"}>
                  <IconBuildingSkyscraper size={15} /> HOTELS
                </Text>
              }
            />
            <Box pos={"relative"}>
              <Button.Group
                pos={"absolute"}
                top={-35}
                right={0}
                opacity={
                  flightData.length >= hotelSettings.slidesToShow
                    ? "inline-block"
                    : "none"
                }
              >
                <Button
                  variant="filled"
                  color="dark"
                  size="xs"
                  onClick={prevHotelSlide}
                  display={!isStartOfHotels ? "inline-block" : "none"}
                >
                  <IconArrowBigLeft size={15} />
                </Button>
                <Button
                  variant="filled"
                  color="dark"
                  size="xs"
                  display={
                    hotelData.length > hotelSettings.slidesToShow &&
                    !isEndOfHotels
                      ? "inline-block"
                      : "none"
                  }
                  onClick={nextHotelSlide}
                >
                  <IconArrowBigRight size={15} />
                </Button>
              </Button.Group>
              <Slider ref={hotelSlider} {...hotelSettings}>
                {hotels}
              </Slider>
            </Box>
          </Box>
        </Box>
      </Center>
    </>
  );
}
