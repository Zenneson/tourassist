import { useRef } from "react";
import {
  ActionIcon,
  BackgroundImage,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Menu,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconSourceCode,
  IconBrandWhatsapp,
  IconShare,
  IconPencil,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Update({
  setEditContentModal,
  setEditUpdate,
  setAddUpdateDesc,
  setDonating,
  images,
}) {
  const [showall, toggle] = useToggle(["hide", "show"]);

  const slideSettings = {
    dots: false,
    fade: true,
    infinite: true,
    autoplay: true,
    swipeToSlide: true,
    speed: 250,
    autoplaySpeed: 5000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  const imagesone = [
    "img/women.jpg",
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
  ];

  const imagestwo = [
    "img/intro/street.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewindow.jpg",
  ];

  const imagesthree = [
    "img/intro/happyguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/plane.jpg",
  ];

  const updateData = [
    {
      month: "May",
      day: "5",
      year: "2023",
      updateImages: ["img/intro/bluehair.jpg"],
      title: "Heres an update on the Trip",
      content:
        "Hello from Bali! Day 5 has been packed with incredible experiences. We started our day with a sunrise yoga session, feeling the warmth of the sun as we stretched and centered ourselves. Next, we participated in an engaging Indonesian cooking class, learning to create delicious local dishes from scratch. Our day continued with a visit to the breathtaking Tegalalang Rice Terraces, where we marveled at the lush green landscape and intricate irrigation system. To top it all off, we embarked on an exhilarating whitewater rafting adventure down the Ayung River, feeling the adrenaline rush through our veins. Throughout our time here, new friendships have been formed, and unforgettable memories are being made in this beautiful paradise.",
    },
    {
      month: "June",
      day: "1",
      year: "2023",
      title: "Another upadate on the Trip",
      content: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          <p>
            Greetings from Seminyak! Day 8 has been yet another day filled with
            memorable experiences and unforgettable moments. Our day commenced
            with a leisurely bike ride through the picturesque countryside,
            where we took in the vibrant sights and sounds of local life. The
            vibrant colors of the flora and the warm smiles of the villagers
            made the ride an absolute pleasure. As we pedaled along, we made a
            stop at a traditional Balinese compound to learn more about the
            fascinating culture and customs of the island.
          </p>
          <p>
            Next, we visited the bustling Seminyak marketplace, immersing
            ourselves in the lively atmosphere and indulging in some retail
            therapy. From beautiful handicrafts to exquisite textiles, the
            market had something for everyone. After shopping to our
            hearts&apos; content, we headed to a trendy beach club to unwind and
            soak up the sun. With refreshing cocktails in hand and the sound of
            the waves crashing nearby, we truly embraced the laid-back island
            lifestyle.
          </p>
          <p>
            As the day turned into evening, we were treated to a stunning sunset
            dinner at a clifftop restaurant. With panoramic views of the ocean
            and a gentle breeze rustling through the palm trees, we savored an
            exquisite fusion of Balinese and international cuisine. Surrounded
            by good company and spectacular views, we couldn&apos;t have asked
            for a more perfect end to another incredible day in paradise.
          </p>
        </pre>
      ),
    },
    {
      month: "June",
      day: "20",
      year: "2023",
      updateImages: imagestwo,
      title: "Huge Update about the Trip",
      content:
        "Greetings from Ubud! Day 6 has been another day filled with wonder and excitement. We began by visiting the enchanting Sacred Monkey Forest Sanctuary, where we had the opportunity to interact with friendly, curious macaques in their natural habitat. Witnessing these playful creatures up close was a truly remarkable experience. Following our time at the sanctuary, we indulged in a rejuvenating Balinese massage at a serene spa, allowing us to fully relax and unwind. The soothing atmosphere and skilled therapists left us feeling refreshed and recharged, ready for more adventures in this magical island.",
    },
    {
      month: "July",
      day: "4",
      year: "2023",
      updateImages: imagesthree,
      title: "Update number 3 of the trip",
      content:
        "Hello from Uluwatu! Day 7 has been nothing short of spectacular. Our journey took us to the awe-inspiring Uluwatu Temple, perched atop dramatic cliffs with breathtaking views of the Indian Ocean. The temple's unique location and stunning architecture left us all in awe. As the sun began to set, we were treated to a captivating Kecak fire dance performance, an unforgettable display of culture and tradition. The rhythmic chanting and mesmerizing movements had us all enthralled. To conclude our day, we enjoyed a sumptuous beachside seafood feast, savoring the delectable flavors of the island's fresh catch. This unforgettable day has truly been the cherry on top of our extraordinary journey.",
    },
  ];

  function Carousel({ images }) {
    const sliderRef = useRef();
    const { hovered, ref } = useHover();

    const next = () => {
      sliderRef.current.slickNext();
    };

    const previous = () => {
      sliderRef.current.slickPrev();
    };

    if (images.length === 1) {
      return (
        <BackgroundImage
          radius={3}
          src={images[0]}
          h={300}
          mx={"5%"}
          mb={30}
          alt="intro"
        />
      );
    }

    return (
      <Group
        ref={ref}
        spacing={0}
        w={"100%"}
        h={300}
        mb={30}
        sx={{ overflow: "hidden" }}
      >
        {hovered && (
          // Previous Image Button
          <Button
            h={"80%"}
            mb={7}
            radius={"3px 0 0 3px"}
            onClick={previous}
            variant="outline"
            color={"dark.4"}
            p={0}
            w={"5%"}
            sx={{
              border: "none",
              "&:hover": {
                color: "#fff",
              },
            }}
          >
            <IconChevronLeft size={50} />
          </Button>
        )}
        <Slider
          ref={sliderRef}
          {...slideSettings}
          style={{
            marginLeft: hovered ? 0 : "5%",
            width: "calc(100% - 10%)",
          }}
        >
          {images.map((image, index) => (
            <BackgroundImage
              radius={3}
              key={index}
              src={image}
              h={300}
              alt="intro"
            />
          ))}
        </Slider>
        {hovered && (
          // Next Image Button
          <Button
            h={"80%"}
            mb={7}
            radius={"3px 0 0 3px"}
            onClick={next}
            variant="outline"
            color={"dark.4"}
            p={0}
            w={"5%"}
            sx={{
              border: "none",
              "&:hover": {
                color: "#fff",
              },
            }}
          >
            <IconChevronRight size={50} />
          </Button>
        )}
      </Group>
    );
  }

  const UpdateContent = ({ content }) => {
    const [readmore, toggle] = useToggle(["closed", "open"]);

    return (
      <>
        <Text mt={10} lineClamp={readmore === "closed" && 5}>
          {content}
        </Text>
        <Divider
          labelPosition="right"
          w={"100%"}
          mt={20}
          label={
            // Read More Toggle
            <Button
              compact
              size="xs"
              radius={25}
              px={15}
              variant="subtle"
              color="gray.6"
              onClick={toggle}
            >
              {readmore === "closed" ? "Read More" : "Show Less"}
            </Button>
          }
        />
      </>
    );
  };

  const updateTrip = () => {
    setEditUpdate(true);
    setAddUpdateDesc(true);
    setDonating(false);
    setEditContentModal(true);
  };

  const updates = updateData.map((update, index) => (
    <Flex
      key={index}
      pos={"relative"}
      radius={3}
      bg={"rgba(0,0,0,0.05)"}
      w={"85%"}
      mt={20}
      py={20}
      px={30}
      fz={14}
      gap={10}
      sx={{
        border: "1px solid rgba(0,0,0,0.15)",
        borderTop: "3px solid rgba(255,255,255,0.1)",
        boxShadow: "0 2px 5px 0 rgba(0,0,0,0.3)",
      }}
    >
      {/* Show Update Modal Button  */}
      <ActionIcon
        pos={"absolute"}
        top={17}
        right={10}
        color="gray.7"
        onClick={updateTrip}
      >
        <IconPencil />
      </ActionIcon>
      <Flex direction={"column"} w={"15%"}>
        <Stack
          spacing={0}
          sx={{
            borderRadius: "3px",
            overflow: "hidden",
            boxShadow: "0 2px 10px 0 rgba(0,0,0,0.1)",
          }}
        >
          <Text
            w={"100%"}
            bg={"blue.9"}
            ta={"center"}
            py={5}
            fw={700}
            fz={12}
            sx={{
              zIndex: 1,
              textTransform: "uppercase",
              boxShadow: "0 5px 5px 0 rgba(0,0,0,0.15)",
            }}
          >
            {update.month}
          </Text>
          <Title ta={"center"} bg={"dark.5"} pt={5}>
            {update.day}
          </Title>
          <Text w={"100%"} bg={"dark.5"} ta={"center"} pb={5}>
            {update.year}
          </Text>
        </Stack>
        <Menu>
          <Menu.Target>
            <Center mt={15}>
              <ActionIcon size={"xl"}>
                <IconShare size={"100%"} />
              </ActionIcon>
            </Center>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <IconBrandFacebook />
            </Menu.Item>
            <Menu.Item>
              <IconBrandInstagram />
            </Menu.Item>
            <Menu.Item>
              <IconBrandTiktok />
            </Menu.Item>
            <Menu.Item>
              <IconBrandTwitter />
            </Menu.Item>
            <Menu.Item>
              <IconBrandWhatsapp />
            </Menu.Item>
            <Menu.Item>
              <IconSourceCode />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <Flex direction={"column"} w={"85%"}>
        <Center>
          {update.updateImages && <Carousel images={update.updateImages} />}
        </Center>
        <Box
          mx={"5%"}
          py={5}
          pl={20}
          sx={{
            borderLeft: "2px solid rgba(255,255,255,0.15)",
          }}
        >
          <Title order={3}>{update.title}</Title>
          <UpdateContent content={update.content} />
        </Box>
      </Flex>
    </Flex>
  ));

  return (
    <>
      {showall === "hide" ? updates[updates.length - 1] : updates}

      <Divider
        labelPosition="left"
        w={"80%"}
        mt={20}
        label={
          // Show all updates toggle
          <Button
            compact
            size="xs"
            radius={25}
            px={15}
            variant="subtle"
            color="gray.6"
            onClick={toggle}
          >
            Show {showall === "hide" ? "All Updates" : "Last Update Only"}
          </Button>
        }
        mb={20}
      />
    </>
  );
}
