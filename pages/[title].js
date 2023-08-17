import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collectionGroup, getDocs } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import { useSessionStorage } from "@mantine/hooks";
import {
  useMantineColorScheme,
  Avatar,
  Button,
  Box,
  Input,
  Center,
  Divider,
  Modal,
  Group,
  Image,
  Flex,
  Progress,
  Title,
  Text,
  Stack,
  CloseButton,
  NumberInput,
  TextInput,
  Select,
  Textarea,
  ScrollArea,
  Tooltip,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconSourceCode,
  IconBrandWhatsapp,
  IconPencil,
  IconHeartHandshake,
  IconQuote,
  IconCurrencyDollar,
  IconCreditCard,
  IconBrandApple,
  IconBrandGoogle,
  IconBrandPaypal,
  IconAt,
  IconUser,
  IconCalendarEvent,
  IconQrcode,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Donations from "../comps/tripinfo/donations";
import Update from "../comps/tripinfo/update";
import TripContent from "../comps/tripinfo/tripContent";
import MainCarousel from "../comps/tripinfo/maincarousel";
import TripDescription from "../comps/tripinfo/tripdescription";
import { formatNumber, daysBefore } from "../libs/custom";

export default function Trippage(props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [modalMode, setModalMode] = useState("");
  const [altModal, setAltModal] = useState(false);
  const [paid, setPaid] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [tripImages, setTripImages] = useState([]);
  const router = useRouter();

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: [],
  });

  const [tripDesc, setTripDesc] = useSessionStorage({
    key: "tripDesc",
    defaultValue: [],
  });

  const [images, setImages] = useSessionStorage({
    key: "images",
    defaultValue: tripData.images,
  });

  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  const [donationsSum, setDonationsSum] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (props.trip) setDataLoaded(true);
    }, 1000);
  }, [props.trip]);

  useEffect(() => {
    router.prefetch("/thankyou");
    router.prefetch("/purchase");
  }, [router]);

  useEffect(() => {
    if (props.trip) {
      setTripData(props.trip);
      setTripImages(props.trip.images);
      setTripDesc(props.trip.tripDesc);
    }
  }, [images, props.trip, setTripData, setTripDesc]);

  const editor = useEditor({
    editable: true,
    extensions: [
      Link,
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder:
          "Add a detailed description to your trip here, to inspire support...",
      }),
    ],
    parseOptions: {
      preserveWhitespace: "full",
    },
    // content: content,
  });

  const comments = commentData.map((comment, index) => (
    <Box key={index}>
      <Group>
        <Avatar alt="" radius="xl">
          {comment.name.charAt(0)}
        </Avatar>
        <Box>
          <Text size="sm">{comment.name}</Text>
          <Text size="xs" color="dimmed">
            {comment.time}
          </Text>
        </Box>
      </Group>
      <Text size="sm" pl={55} pb={20}>
        {comment.text}
      </Text>
      {commentData.length !== index + 1 && <Divider opacity={0.25} my={10} />}
    </Box>
  ));

  const today = new Date();
  const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const showEditTripModal = () => {
    setImages(tripData.images);
    setModalMode("editTrip");
  };

  const showUpdateModal = () => {
    setAltModal(true);
    setModalMode("postUpdate");
  };

  const showDonateModal = () => {
    setModalMode("donating");
    setAltModal(true);
  };

  const closeAltModal = () => {
    setAltModal(false);
    setPaid(false);
  };

  const closeEditTripModal = () => {
    setModalMode("");
  };

  const DateChanger = () => {
    const [travelDate, setTravelDate] = useSessionStorage({
      key: "travelDate",
      defaultValue: tripData.travelDate,
    });

    return (
      <DateInput
        icon={<IconCalendarEvent size={20} />}
        iconWidth={50}
        variant="default"
        minDate={weekAhead}
        firstDayOfWeek={0}
        size="sm"
        ta={"right"}
        w={"100%"}
        maw={150}
        onChange={(e) => setTravelDate(new Date(e))}
        value={
          travelDate ? new Date(travelDate) : new Date(tripData.travelDate)
        }
        valueFormat="MMM DD, YYYY"
        sx={{
          "& .mantine-DateInput-input": {
            cursor: "pointer",
          },
        }}
      />
    );
  };

  const ModalsFunc = () => {
    return (
      <Box>
        <Modal
          centered
          withCloseButton={false}
          size={850}
          padding={"xl"}
          opened={modalMode === "editTrip"}
          scrollAreaComponent={ScrollArea.Autosize}
          onClose={closeEditTripModal}
          lockScroll={false}
          overlayProps={{
            blur: 9,
          }}
          sx={{
            "& .mantine-ScrollArea-root": {
              "& .mantine-ScrollArea-scrollbar": {
                width: 8,
              },
            },
          }}
          styles={(theme) => ({
            header: {
              backgroundColor: "transparent",
            },
            content: {
              backgroundColor: dark
                ? "rgba(0,0,0,0.9)"
                : "rgba(255,255,255,0.9)",
            },
            overlay: {
              backgroundColor: dark
                ? "rgba(0,0,0,0.5)"
                : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(9px)",
            },
          })}
        >
          {/* Close Alt Modal */}
          <Box maw={800}>
            <CloseButton
              pos={"absolute"}
              top={21}
              right={21}
              size={25}
              onClick={closeEditTripModal}
            />
            <Stack align="center" spacing={20}>
              <Title order={6} w={"100%"} ta={"left"} fs={"italic"}>
                EDIT TRIP DETAILS:
              </Title>
              <Group
                w={"100%"}
                pl={15}
                pt={5}
                pb={10}
                ml={-3}
                position="apart"
                sx={{
                  borderLeft: `3px solid ${
                    dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
                  }`,
                }}
              >
                <Text fw={700} fz={30} w={"70%"} fs={"italic"} lineClamp={1}>
                  {tripData.tripTitle}
                </Text>
                <DateChanger />
              </Group>
              <TripContent
                user={user}
                images={images}
                setImages={setImages}
                modalMode={modalMode}
                weekAhead={weekAhead}
              />
            </Stack>
          </Box>
        </Modal>
        <Modal
          pos={"relative"}
          withCloseButton={false}
          size={850}
          padding={"xl"}
          centered
          opened={altModal}
          onClose={closeAltModal}
          styles={(theme) => ({
            header: {
              backgroundColor: "transparent",
            },
            content: {
              backgroundColor: dark
                ? "rgba(0,0,0,0.9)"
                : "rgba(255,255,255,0.9)",
            },
            overlay: {
              backgroundColor: dark
                ? "rgba(0,0,0,0.3)"
                : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(9px)",
            },
          })}
        >
          {/* Close Edit Content Modal */}
          <CloseButton
            pos={"absolute"}
            top={21}
            right={21}
            size={25}
            onClick={closeAltModal}
          />
          {modalMode === "donating" && (
            <Box w={802}>
              <Title mb={5} color={dark ? "#00E8FC" : "#fa7500"}>
                <Flex align={"center"} gap={5}>
                  {!paid ? "DONATE" : "THANK YOU"}
                  <IconHeartHandshake size={35} />
                </Flex>
              </Title>
              <Divider w={"100%"} size={"xl"} opacity={0.4} mb={15} />
              {!paid && (
                <Group mb={15} grow>
                  <Stack>
                    <Button.Group>
                      <Button
                        size="xl"
                        w={"25%"}
                        variant="filled"
                        bg={dark ? "dark.5" : "gray.1"}
                        c={dark ? "gray.0" : "dark.2"}
                        sx={{
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#A6A7AB",
                          },
                        }}
                      >
                        <IconCreditCard size={30} />
                      </Button>
                      <Button
                        size="xl"
                        w={"25%"}
                        variant="filled"
                        bg={dark ? "dark.5" : "gray.1"}
                        c={dark ? "gray.0" : "dark.2"}
                        sx={{
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#A6A7AB",
                          },
                        }}
                      >
                        <IconBrandApple size={30} />
                      </Button>
                      <Button
                        size="xl"
                        w={"25%"}
                        variant="filled"
                        bg={dark ? "dark.5" : "gray.1"}
                        c={dark ? "gray.0" : "dark.2"}
                        sx={{
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#A6A7AB",
                          },
                        }}
                      >
                        <IconBrandGoogle size={30} />
                      </Button>
                      <Button
                        size="xl"
                        w={"25%"}
                        variant="filled"
                        bg={dark ? "dark.5" : "gray.1"}
                        c={dark ? "gray.0" : "dark.2"}
                        sx={{
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#A6A7AB",
                          },
                        }}
                      >
                        <IconBrandPaypal size={30} />
                      </Button>
                    </Button.Group>
                    <Divider />
                    <TextInput
                      variant="filled"
                      placeholder="E-mail Address"
                      icon={<IconAt size={20} opacity={0.4} />}
                    />
                    <TextInput
                      variant="filled"
                      placeholder="Name on Card"
                      icon={<IconUser size={20} opacity={0.4} />}
                    />
                    <Flex gap={10}>
                      <Input
                        placeholder="Card Number"
                        w={"60%"}
                        icon={<IconCreditCard size={20} opacity={0.4} />}
                      />
                      <Input placeholder="MM/YY" w={"20%"} />
                      <Input placeholder="CVV" w={"20%"} />
                    </Flex>
                    <Flex gap={10}>
                      <Select
                        placeholder="Country"
                        variant="filled"
                        data={[]}
                        w={"60%"}
                      />
                      <Input placeholder="Postal Code" w={"calc(40% + 10px)"} />
                    </Flex>
                  </Stack>
                  <Stack spacing={5}>
                    <NumberInput
                      icon={<IconCurrencyDollar size={35} />}
                      type="number"
                      size="xl"
                      mb={10}
                      hideControls
                      precision={2}
                      variant="filled"
                      placeholder="Enter Amount..."
                      sx={{
                        ".mantine-NumberInput-input": {
                          textAlign: "right",
                          fontWeight: 700,
                        },
                      }}
                    />
                    <Box
                      pl={20}
                      py={5}
                      sx={{
                        borderLeft: "3px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Flex align={"center"} gap={10}>
                        <Divider label="Processing fee" w={"100%"} />{" "}
                        <Text fz={12}>$0.00</Text>
                      </Flex>
                      <Flex align={"center"} gap={10}>
                        <Divider
                          label={
                            <Text fz={15} fw={700}>
                              Total
                            </Text>
                          }
                          w={"100%"}
                        />
                        <Text fz={14} fw={700}>
                          $0.00
                        </Text>
                      </Flex>
                    </Box>
                    <Group spacing={0} my={8}>
                      <Text fz={11} w={"70%"} pr={10}>
                        We use Stripe, a trusted payment processor, to securely
                        handle transactions and disburse funds, ensuring the
                        protection of your sensitive banking information.
                      </Text>
                      <Image
                        src="img/stripe.png"
                        fit="contain"
                        display={"block"}
                        opacity={0.3}
                        pl={10}
                        style={{
                          width: "30%",
                          borderLeft: "2px solid rgba(255,255,255,0.3)",
                        }}
                        alt=""
                      />
                    </Group>
                    {/* Complete Donation Button  */}
                    <Button
                      variant="filled"
                      size="xl"
                      w={"100%"}
                      onClick={() => setPaid(true)}
                    >
                      DONATE NOW
                    </Button>
                  </Stack>
                </Group>
              )}
              {paid && (
                <>
                  <Text w={"100%"} ta={"center"} c={"#777"}>
                    Thank you for your donation, please leave a message of
                    suppport{" "}
                  </Text>
                  <Textarea
                    placeholder="Bon voyage!"
                    variant="filled"
                    mt={10}
                    minRows={8}
                  />
                  <Group position="right" mt={5} w={"100%"}>
                    <Button
                      variant="filled"
                      size="md"
                      mt={10}
                      w={"40%"}
                      onClick={closeAltModal}
                    >
                      POST MESSAGE
                    </Button>
                  </Group>
                </>
              )}
            </Box>
          )}
          {(modalMode === "editUpdate" || modalMode === "postUpdate") && (
            <>
              <Title order={6} w={"100%"} ta={"left"} mb={15} fs={"italic"}>
                {modalMode === "editUpdate"
                  ? "EDIT UPDATE:"
                  : modalMode === "postUpdate"
                  ? "POST UPDATE:"
                  : ""}
              </Title>
              <Stack align="center">
                <Input
                  size={"xl"}
                  value={
                    modalMode === "editUpdate"
                      ? "Update number 3 of the trip"
                      : ""
                  }
                  w="100%"
                  placeholder="Update Title..."
                  maw={800}
                  onChange={(e) => e.preventDefault()}
                  wrapperProps={{
                    style: {
                      borderRadius: 3,
                    },
                  }}
                  sx={{
                    ".mantine-Input-input": {
                      background: dark ? "#101113" : "gray.3",
                      "&::placeholder": {
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "rgba(255,255,255,0.0.08)",
                      },
                    },
                  }}
                />
                <ScrollArea
                  h={300}
                  w={"100%"}
                  scrollbarSize={8}
                  scrollHideDelay={250}
                  sx={{
                    overflow: "hidden",
                    borderRadius: "3px",
                  }}
                >
                  <RichTextEditor
                    editor={editor}
                    position="relative"
                    bg={dark ? "dark.6" : "gray.2"}
                    sx={{
                      transition: "border-top 0.2s ease",
                      border: "none",
                      width: "100%",
                      minWidth: "500px",
                      ".mantine-RichTextEditor-toolbar": {
                        background: dark
                          ? "rgba(0, 0, 0, 0.7)"
                          : "rgba(255, 255, 255, 0.7)",
                        borderColor: "rgba(255,255,255,0)",
                      },
                      ".mantine-RichTextEditor-content": {
                        background: "rgba(0, 0, 0, 0)",
                        color: dark ? "dark.9" : "gray.0",
                        minHeight: "250px",
                        "& .ProseMirror": {
                          paddingLeft: "21px",
                          paddingRight: "21px",
                          minHeight: "250px",
                        },
                      },
                    }}
                  >
                    {editor && (
                      <>
                        <RichTextEditor.Toolbar sticky>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Italic />
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignRight />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                          </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                      </>
                    )}
                    <RichTextEditor.Content
                      sx={{
                        "& p": {
                          fontSize: ".9rem",
                        },
                      }}
                    />
                  </RichTextEditor>
                </ScrollArea>
                <Group position="right" mt={5} w={"100%"}>
                  <Button
                    variant="default"
                    size="md"
                    w={"40%"}
                    onClick={closeAltModal}
                  >
                    {modalMode === "editUpdate"
                      ? "SAVE UPDATE"
                      : modalMode === "postUpdate"
                      ? "POST UPDATE"
                      : ""}
                  </Button>
                </Group>
              </Stack>
            </>
          )}
        </Modal>
      </Box>
    );
  };

  return (
    <>
      <LoadingOverlay visible={!dataLoaded} overlayOpacity={1} />
      <Center mt={120}>
        <Flex
          gap={30}
          w={"80%"}
          maw={1200}
          pos={"relative"}
          h={"100%"}
          align={"flex-start"}
          sx={{
            overflow: "visible",
          }}
        >
          <Flex
            w={"calc(70% - 30px)"}
            direction={"column"}
            align={"center"}
            pos={"relative"}
          >
            <MainCarousel tripImages={tripImages} />
            <Divider
              w={"80%"}
              color="dark.4"
              size={"md"}
              my={tripData.images?.length > 0 ? 15 : 0}
              label={
                <Title
                  order={3}
                  px={5}
                  mb={10}
                  maw={"800px"}
                  color="gray.6"
                  fw={700}
                >
                  {tripData.tripTitle}
                </Title>
              }
            />
            <Center>
              <Button.Group
                sx={{
                  borderRadius: 50,
                  overflow: "hidden",
                }}
              >
                <Tooltip label="Share on Facebook">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconBrandFacebook size={20} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Instagram">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconBrandInstagram size={20} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Tiktok">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconBrandTiktok size={20} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Twitter">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconBrandTwitter size={20} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Whatsapp">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconBrandWhatsapp size={20} />
                  </Button>
                </Tooltip>
                <Tooltip label="HTML Embed Code">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconSourceCode size={20} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share with QR Code">
                  <Button
                    size={"lg"}
                    variant="filled"
                    bg={dark ? "dark.9" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                    sx={{
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#A6A7AB",
                      },
                    }}
                  >
                    <IconQrcode size={20} />
                  </Button>
                </Tooltip>
              </Button.Group>
            </Center>
            <Box
              className="pagePanel"
              w={"85%"}
              mt={20}
              mb={30}
              py={20}
              px={30}
              fz={14}
            >
              {user && user.email === tripData.user && (
                <Divider
                  labelPosition="right"
                  w={"100%"}
                  label={
                    // Edit Trip Details
                    <Button
                      compact
                      size="xs"
                      radius={25}
                      pl={10}
                      pr={15}
                      variant="subtle"
                      color="gray.6"
                      leftIcon={
                        <IconPencil
                          size={17}
                          style={{
                            marginRight: -5,
                            marginTop: -3,
                          }}
                        />
                      }
                      onClick={showEditTripModal}
                    >
                      Edit Trip Details
                    </Button>
                  }
                />
              )}
              <TripDescription />
            </Box>
            {user?.email === tripData.user && (
              <Button
                variant="default"
                w={"80%"}
                radius={25}
                mb={30}
                opacity={0.3}
                onClick={showUpdateModal}
                sx={{
                  "&:hover": {
                    opacity: 1,
                    background: dark
                      ? "rgba(0,0,0,0.3)"
                      : "rgba(255,255,255,0.3)",
                  },
                }}
              >
                POST UPDATE
              </Button>
            )}
            {/* {updates.length > 0 && ( */}
            <Update
              setAltModal={setAltModal}
              setModalMode={setModalMode}
              tripData={tripData}
              user={user}
            />
            {/* )} */}
            <Box className="pagePanel" w={"85%"} mb={50} p={"20px 30px"}>
              <Divider
                size={"xl"}
                w={"100%"}
                label={
                  <Flex align={"center"}>
                    <IconQuote size={40} opacity={0.2} />
                    <Title order={4}>DONOR MESSAGES</Title>
                  </Flex>
                }
              />
              <Box pl={10}>
                {user?.email !== tripData.user && (
                  <Divider
                    mb={20}
                    w={"100%"}
                    labelPosition="right"
                    label={
                      // Show Donate Modal Button Near Comments
                      <Button
                        size="xs"
                        radius={25}
                        px={15}
                        variant="light"
                        color="gray.6"
                        onClick={showDonateModal}
                      >
                        <Flex align={"center"} gap={5}>
                          DONATE
                          <IconHeartHandshake size={20} />
                        </Flex>
                      </Button>
                    }
                  />
                )}
                {commentData.length === 0 ? (
                  <Text w={"100%"} fz={12} ta={"center"}>
                    {user && user.email !== tripData.user
                      ? "Donate to leave a comment!"
                      : "Donor's comments will appear here"}
                  </Text>
                ) : (
                  comments
                )}
              </Box>
            </Box>
          </Flex>
          <Flex
            w={"30%"}
            h={"100%"}
            direction={"column"}
            pos={"sticky"}
            top={120}
            maw={360}
          >
            <Box
              className="pagePanel"
              pos={"relative"}
              w={"100%"}
              px={20}
              pt={15}
              pb={20}
              mb={20}
            >
              <Group spacing={0} w={"100%"} position="apart">
                <Stack spacing={0} w={"70%"}>
                  <Flex align={"flex-end"} mb={-2} gap={3} pl={5}>
                    <Title color="green.4" order={1}>
                      ${donationsSum}
                    </Title>
                    <Text fz={11} mb={8} span>
                      RAISED
                    </Text>
                  </Flex>
                  <Divider w={"90%"} opacity={0.4} my={3} pb={2} />
                  <Flex align={"flex-end"} opacity={0.4} gap={3} pl={5}>
                    <Title order={4}>${formatNumber(tripData.costsSum)}</Title>
                    <Text fz={11} mb={4} span>
                      GOAL
                    </Text>
                  </Flex>
                </Stack>
                <Box
                  w={"30%"}
                  pt={12}
                  bg={dark ? "dark.6" : "gray.3"}
                  sx={{
                    borderRadius: "3px",
                  }}
                >
                  <Text ta={"center"} fz={10} mb={-7}>
                    DAYS LEFT
                  </Text>
                  <Title pb={5} ta={"center"} color="gray.7">
                    {daysBefore(tripData?.travelDate).toString()}
                  </Title>
                </Box>
              </Group>
              <Progress
                value={50}
                color="green.7"
                bg={"gray.6"}
                size={"sm"}
                radius={"xl"}
                mt={10}
                mb={12}
              />
              {user && user.email === tripData.user && (
                <Button
                  w={"100%"}
                  radius={25}
                  variant="gradient"
                  gradient={{ from: "green.3", to: "green.9", deg: 45 }}
                  onClick={() => {
                    router.push("/purchase");
                  }}
                >
                  <Text>USE FUNDS</Text>
                </Button>
              )}
              {user?.email !== tripData.user && (
                // Main Donate Button
                <Button
                  fullWidth
                  radius={25}
                  variant="gradient"
                  gradient={{ from: "#0D3F82", to: "#2DC7F3", deg: 45 }}
                  onClick={showDonateModal}
                >
                  <Text fz={20}>
                    <Flex align={"center"} gap={5}>
                      DONATE <IconHeartHandshake size={23} />
                    </Flex>
                  </Text>
                </Button>
              )}
            </Box>
            <Box className="pagePanel">
              <Donations dHeight={"calc(100vh - 405px)"} />
            </Box>
          </Flex>
        </Flex>
      </Center>
      <ModalsFunc />
    </>
  );
}

export const getStaticPaths = async () => {
  // Fetch all documents from the 'trips' collection group
  const queryData = collectionGroup(firestore, "trips");
  let paths = [];

  try {
    const querySnapshot = await getDocs(queryData);
    paths = querySnapshot.docs.map((doc) => {
      // The document ID is used as 'title' in the URL
      const title = doc.id;
      return { params: { title } };
    });
  } catch (error) {
    console.error(error);
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { title } = params;

  // Query all 'trips' collection
  const query = collectionGroup(firestore, "trips");
  try {
    const querySnapshot = await getDocs(query);

    // Find the document with an ID matching the 'title'
    const tripDoc = querySnapshot.docs.find((doc) => doc.id === title);

    if (!tripDoc) {
      // No document found with the matching 'title'
      console.log("No document found with the matching 'title'");
      return {
        notFound: true,
      };
    }

    const trip = tripDoc.data();
    return {
      props: {
        trip,
      },
    };
  } catch (error) {
    console.error(error);
    // In case of error, return an empty props object
    return {
      props: {},
    };
  }
};
