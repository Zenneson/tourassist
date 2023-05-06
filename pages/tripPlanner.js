import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Autocomplete,
  ActionIcon,
  Space,
  Stepper,
  Title,
  Center,
  Box,
  Text,
  Image,
  NumberInput,
  Group,
  Divider,
  Stack,
  Button,
  Input,
  Popover,
  Flex,
  Badge,
  Transition,
  BackgroundImage,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  useForceUpdate,
  useWindowEvent,
  useLocalStorage,
} from "@mantine/hooks";
import LoginComp from "../comps/loginComp";
import { placeDataState } from "../libs/atoms";
import {
  IconCurrencyDollar,
  IconPlus,
  IconCirclePlus,
  IconUpload,
  IconX,
  IconPhoto,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconBuildingBank,
} from "@tabler/icons";
import { useRecoilState } from "recoil";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { useRouter } from "next/router";
import Slider from "react-slick";

export default function TripPlannerPage() {
  const [startLocaleSearch, setStartLocaleSearch] = useState("");
  const [startLocaleData, setStartLocaleData] = useState([]);
  const [startLocale, setStartLocale] = useState("");
  const [placeData, setPlaceData] = useRecoilState(placeDataState);
  const forceUpdate = useForceUpdate();
  const startLocaleRef = useRef(null);
  const newCostRef = useRef(null);
  const router = useRouter();
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });
  const sliderRef = useRef();

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

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

  const images = [
    "img/women.jpg",
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
  ];

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // AMADEUS API ---------------------------
  var Amadeus = require("amadeus");
  var amadeus = new Amadeus({
    clientId: "Hq9S6iCxG0COAsAAYRUKfEVgMo7Eqng8",
    clientSecret: "3duQ8ajKZtZah6ns",
  });

  // amadeus.shopping.flightOffersSearch
  //   .get({
  //     originLocationCode: "SYD",
  //     destinationLocationCode: "BKK",
  //     departureDate: "2023-06-01",
  //     adults: "1",
  //   })
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (responseError) {
  //     console.log(responseError.code);
  //   });
  // AMADEUS API END -----------------------

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder:
          "Add a detailed description to your trip to inspire support and show your commitment. The more you share about your plans and goals, the more people will be drawn to your journey. Let your words paint a picture and connect with those who want to join you on your adventure. Get creative and share why your trip means so much to you!",
      }),
    ],
    content: "",
  });

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const Costs = (cost, index) => (
    <div key={index}>
      <Group position="right" mr={20}>
        <Text size={12} fs="italic" color="dimmed" mt={-25}>
          <Badge variant="default">{cost.cost || "NEW COST"}</Badge>
        </Text>
        <div
          style={{
            marginTop: -25,
            width: "50%",
            border: "1px dotted rgba(0,0,0,0.4)",
          }}
        ></div>
        <NumberInput
          icon={<IconCurrencyDollar />}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""
          }
          stepHoldDelay={500}
          stepHoldInterval={100}
          precision={2}
          min={0}
          size="md"
          w={150}
          mb={20}
          variant="filled"
        />
      </Group>
    </div>
  );

  const [newCost, setNewCost] = useState([]);
  let formValue = "";
  const AddCost = (event) => {
    let index =
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.id ||
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    newCost[index]?.push(formValue.toUpperCase());
    forceUpdate();
  };

  useWindowEvent("keydown", (event) => {
    if (event.key === "Enter" && newCostRef.current) {
      AddCost(event);
    }
  });

  const Places = () =>
    placeData.map((place, index) => {
      newCost[index] = newCost[index] || [];
      return (
        <Box
          id={index}
          key={index}
          p={20}
          mb={20}
          radius={3}
          bg={"rgba(0,0,0,0.05)"}
          sx={{
            border: "1px solid rgba(0,0,0,0.15)",
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
                borderLeft: "5px solid rgba(150,150,150,0.035)",
              }}
            >
              <Title
                order={4}
                fw={600}
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {place.place}
              </Title>
              <Text size="xs" color="dimmed">
                {place.region}
              </Text>
            </Stack>
            <div
              style={{
                width: "40%",
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            ></div>
          </Group>
          <Box id={index}>
            {place.costs &&
              place.costs.map((cost, index) => (
                <Box key={index} pos="relative">
                  <ActionIcon
                    pos="absolute"
                    variant="default"
                    opacity={0.2}
                    right={-13}
                    top={-1}
                    h={43}
                    onClick={(event) => {
                      const placeIndex =
                        event.target.parentElement.parentElement?.id;
                      const costIndex = index;
                      let newPlaceData = [...placeData];
                      let copyData = JSON.parse(JSON.stringify(newPlaceData));
                      copyData[placeIndex]?.costs.splice(costIndex, 1);
                      setPlaceData(copyData);
                    }}
                  >
                    <IconTrash size={17} pointerEvents="none" />
                  </ActionIcon>
                  <Costs cost={cost} />
                </Box>
              ))}
            {newCost[index] &&
              newCost[index].map((cost, index) => (
                <Box key={index} pos="relative">
                  <ActionIcon
                    pos="absolute"
                    variant="default"
                    opacity={0.2}
                    right={-13}
                    top={-1}
                    h={43}
                    onClick={(event) => {
                      const placeIndex =
                        event.target.parentElement.parentElement?.id;
                      const costIndex = index;
                      let newPlaceData = [...newCost];
                      let copyData = JSON.parse(JSON.stringify(newPlaceData));
                      copyData[placeIndex] = copyData[placeIndex].filter(
                        (_, i) => i !== costIndex
                      );
                      setNewCost(copyData);
                    }}
                  >
                    <IconTrash size={17} pointerEvents="none" />
                  </ActionIcon>
                  <Costs
                    cost={cost}
                    styles={{
                      width: "100%",
                    }}
                  />
                </Box>
              ))}
          </Box>
          <Divider opacity={0.2} color="#000" />
          <Group mt={20} position="right">
            <Popover
              width={250}
              position="left"
              shadow="xl"
              trapFocus
              radius="xl"
            >
              <Popover.Target>
                <Button
                  id={index}
                  variant="subtle"
                  size="xs"
                  color="gray"
                  leftIcon={<IconPlus size={15} />}
                  sx={{
                    opacity: 0.1,
                    transition: "opacity 0.2s ease-in-out",
                    "&:hover": {
                      opacity: 0.5,
                    },
                  }}
                >
                  <span id={index}>ADD COST</span>
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Input
                  placeholder="NEW COST"
                  variant="unstyled"
                  ref={newCostRef}
                  size="xs"
                  pl={10}
                  maxLength={25}
                  onChange={(value) => (formValue = value.target.value)}
                  sx={{
                    ".mantine-Input-input": {
                      textTransform: "uppercase",
                      "&:focus": {
                        border: "none",
                      },
                    },
                  }}
                  rightSection={
                    <ActionIcon
                      onClick={(event) => {
                        AddCost(event);
                      }}
                    >
                      <IconCirclePlus />
                    </ActionIcon>
                  }
                />
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Box>
      );
    });

  const handleChange = async (e) => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${startLocaleSearch}.json?&autocomplete=true&&fuzzyMatch=true&types=place%2Cregion%2Ccountry&limit=5&access_token=pk.eyJ1IjoiemVubmVzb24iLCJhIjoiY2xiaDB6d2VqMGw2ejNucXcwajBudHJlNyJ9.7g5DppqamDmn1T9AIwToVw`;

    if (startLocaleSearch.length > 1) {
      try {
        const response = await fetch(endpoint);
        const results = await response.json();
        const data = results.features.map((feature) => ({
          label: feature.label,
          value: feature.place_name,
          place_name: feature.place_name,
          place_type: feature.place_type,
          center: feature.center,
          geometry: feature.geometry,
          text: feature.text,
          bbox: feature.bbox,
          context: feature.context,
          all: feature,
        }));
        setStartLocaleData(data);
      } catch (error) {
        console.log("Error fetching data for Country Autocomplete: ", error);
      }
    }
  };

  const handleSelect = (e) => {
    setStartLocale(e.value);
    console.log(e.all);
  };

  return (
    <>
      <Center w={"100%"} h={"100%"} hidden={startLocale}>
        <Autocomplete
          size="xl"
          w={500}
          defaultValue=""
          value={startLocaleSearch}
          placeholder="Start Location?"
          onItemSubmit={(e) => handleSelect(e)}
          ref={startLocaleRef}
          data={startLocaleData}
          filter={(value, item) => item}
          onClick={function (event) {
            event.preventDefault();
            startLocaleRef.current.select();
          }}
          onChange={function (e) {
            setStartLocaleSearch(e);
            handleChange(e);
          }}
          sx={{
            "& .mantine-Autocomplete-input": {
              backgroundColor: "transparent",
              border: "none",
              borderRadius: 0,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              "&::placeholder": {
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: 1000,
                fontSize: 30,
              },
            },
          }}
        />
      </Center>
      <Transition
        mounted={startLocale}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Box>
            <Space h={150} />
            <Center>
              <Flex
                w="100%"
                maw={1200}
                justify="flex-start"
                align="flex-start"
                gap={10}
              >
                <Box w="80%" miw={500} px="xl">
                  {active === 0 && (
                    <motion.div {...animation}>
                      <Places />
                    </motion.div>
                  )}
                  {active === 1 && (
                    // NOTE - Trip Info
                    <motion.div {...animation}>
                      <Title order={6} fw={600}>
                        <Stack align="center">
                          <Input
                            size={40}
                            variant="subtle"
                            placeholder="Trip Name"
                            autoFocus
                            w="100%"
                            maw={800}
                            sx={{
                              "&.mantine-Input-wrapper": {
                                borderBottom:
                                  "1px solid rgba(255,255,255,0.05)",
                              },
                              ".mantine-Input-input": {
                                padding: "30px 5px",
                                "&::placeholder": {
                                  fontWeight: 1000,
                                  fontStyle: "italic",
                                  color: "rgba(255,255,255,0.05)",
                                },
                              },
                            }}
                          />
                          <Group
                            maw={800}
                            spacing={20}
                            w="100%"
                            position="apart"
                            grow
                          >
                            <Box>
                              <Slider
                                ref={sliderRef}
                                {...slideSettings}
                                style={{
                                  width: "100%",
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
                              <Group mt={10} spacing={15} grow>
                                <Button
                                  variant="outline"
                                  color="gray"
                                  compact
                                  onClick={() => {
                                    previous();
                                  }}
                                >
                                  <IconChevronLeft size={20} />
                                </Button>
                                <Button color="red" compact>
                                  <IconTrash size={17} />
                                </Button>
                                <Button
                                  variant="outline"
                                  color="gray"
                                  compact
                                  onClick={() => {
                                    next();
                                  }}
                                >
                                  <IconChevronRight size={20} />
                                </Button>
                              </Group>
                            </Box>
                            <Box>
                              <Dropzone
                                onDrop={(files) =>
                                  console.log("accepted files", files)
                                }
                                onReject={(files) =>
                                  console.log("rejected files", files)
                                }
                                accept={IMAGE_MIME_TYPE}
                                ta="center"
                                mih={300}
                              >
                                <Group
                                  position="center"
                                  spacing={5}
                                  mt={80}
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                >
                                  <Dropzone.Accept>
                                    <IconUpload size={50} />
                                  </Dropzone.Accept>
                                  <Dropzone.Reject>
                                    <IconX size={50} />
                                  </Dropzone.Reject>
                                  <Dropzone.Idle>
                                    <IconPhoto size={50} stroke={1.5} />
                                  </Dropzone.Idle>

                                  <div>
                                    <Text size="xl" inline>
                                      Drag images here
                                    </Text>
                                  </div>
                                </Group>
                                <Button
                                  variant="default"
                                  radius={"xl"}
                                  px={50}
                                  mt={7}
                                  size="lg"
                                  compact
                                >
                                  Select Files
                                </Button>
                              </Dropzone>
                              <Title
                                mt={15}
                                order={6}
                                py={4}
                                ta={"center"}
                                bg={"dark.5"}
                                sx={{
                                  borderRadius: "3px",
                                }}
                              >
                                {`\[ 3 / 6 \] SPACES USED`}
                              </Title>
                            </Box>
                          </Group>
                          <RichTextEditor
                            editor={editor}
                            position="relative"
                            sx={{
                              overflow: "auto",
                              width: "100%",
                              minWidth: "500px",
                              maxWidth: "800px",
                              minHeight: "160px",
                              maxHeight: "250px",
                            }}
                          >
                            {editor && (
                              <>
                                <Badge
                                  hidden={!editor.isFocused}
                                  pos="absolute"
                                  variant="dot"
                                  color="lime"
                                  opacity={0.4}
                                  top={5}
                                  left={5}
                                  radius={3}
                                  fz={7}
                                  size="xs"
                                >
                                  Highlight text to edit
                                </Badge>
                                <BubbleMenu editor={editor}>
                                  <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.ColorPicker
                                      colors={[
                                        "#ff0000",
                                        "#ffb300",
                                        "#ff00c3",
                                        "#0011ff",
                                        "#00e1ff",
                                        "#046e18",
                                        "#01fd4d",
                                        "#000000",
                                        "#1a1a1a",
                                        "#4d4d4d",
                                        "#808080",
                                        "#b3b3b3",
                                        "#cccccc",
                                        "#ffffff",
                                      ]}
                                    />
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.H1 />
                                    <RichTextEditor.H2 />
                                    <RichTextEditor.H3 />
                                    <RichTextEditor.H4 />
                                    <RichTextEditor.BulletList />
                                    <RichTextEditor.OrderedList />
                                  </RichTextEditor.ControlsGroup>
                                  <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.UnsetColor />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.AlignLeft />
                                    <RichTextEditor.AlignRight />
                                    <RichTextEditor.AlignCenter />
                                    <RichTextEditor.AlignJustify />
                                    <RichTextEditor.Link />
                                    <RichTextEditor.Unlink />
                                  </RichTextEditor.ControlsGroup>
                                </BubbleMenu>
                              </>
                            )}
                            <RichTextEditor.Content
                              sx={{
                                "& p": {
                                  fontSize: "1rem",
                                  textAlign: "justify",
                                  paddingTop: "10px",
                                },
                              }}
                            />
                          </RichTextEditor>
                        </Stack>
                      </Title>
                    </motion.div>
                  )}
                  {active === 2 && (
                    <motion.div {...animation}>
                      {/* NOTE - Banking Info */}
                      <Center w={"100%"} h={"50vh"}>
                        <Stack w={"70%"}>
                          <Box hidden={user}>
                            <LoginComp />
                            <Divider mt={20} opacity={0.4} />
                          </Box>
                          <Center>
                            <Button
                              leftIcon={<IconBuildingBank size={34} />}
                              variant="gradient"
                              gradient={{
                                from: "green.5",
                                to: "green.9",
                                deg: 180,
                              }}
                              color="gray.0"
                              size="xl"
                              w={"90%"}
                              sx={{
                                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                              }}
                            >
                              <Title order={3}>ADD BANKING INFORMATION</Title>
                            </Button>
                          </Center>
                          <Divider my={3} opacity={0.4} />
                          <Group spacing={0}>
                            <Text fz={12} w={"70%"}>
                              We use Stripe, a trusted payment processor, to
                              securely handle transactions and disburse funds,
                              ensuring the protection of your sensitive banking
                              information.
                            </Text>
                            <Image
                              src="img/stripe.png"
                              fit="contain"
                              display={"block"}
                              opacity={0.3}
                              style={{
                                width: "30%",
                                borderLeft: "2px solid rgba(255,255,255,0.3)",
                              }}
                              alt=""
                            />
                          </Group>
                        </Stack>
                      </Center>
                    </motion.div>
                  )}
                </Box>
                <Box>
                  <Stepper
                    active={active}
                    onStepClick={setActive}
                    iconPosition="right"
                    orientation="vertical"
                    miw={205}
                    mt={20}
                    mr={20}
                    size="xs"
                    w="20%"
                  >
                    <Stepper.Step
                      label="Cost Calculator"
                      description="Calculate all your trip costs"
                    />
                    <Stepper.Step
                      label="Trip Details"
                      description="Tell us your story"
                    />
                    <Stepper.Step
                      label="Banking Info"
                      description="Link a Payment Account"
                    />
                  </Stepper>
                  <Divider
                    mt={-20}
                    mb={5}
                    opacity={0.5}
                    size={"xs"}
                    variant="solid"
                    label={"Total Cost"}
                    labelPosition="center"
                  />
                  <NumberInput
                    icon={<IconCurrencyDollar />}
                    size="xl"
                    mb={20}
                    w={225}
                    stepHoldDelay={500}
                    stepHoldInterval={100}
                    variant="filled"
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value))
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                    }
                    precision={2}
                    min={0}
                  />
                  <Button
                    fullWidth
                    variant="default"
                    mb={10}
                    hidden={active === 0}
                    onClick={prevStep}
                  >
                    <IconChevronUp />
                  </Button>
                  <Button
                    fullWidth
                    variant={active === 2 ? "fill" : "default"}
                    bg={active === 2 ? "blue" : "primary"}
                    onClick={() => {
                      if (active !== 2) {
                        nextStep();
                      }
                      if (active === 2) {
                        router.push("/trippage", undefined, { shallow: true });
                      }
                    }}
                  >
                    {active === 2 ? "DONE" : <IconChevronDown />}
                  </Button>
                </Box>
              </Flex>
            </Center>
          </Box>
        )}
      </Transition>
    </>
  );
}
