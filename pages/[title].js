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
  Center,
  Divider,
  Group,
  Flex,
  Progress,
  Title,
  Text,
  Stack,
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
  IconQrcode,
  IconTargetArrow,
} from "@tabler/icons-react";
import Donations from "../comps/trip/donations";
import Updates from "../comps/trip/updates";
import MainCarousel from "../comps/trip/maincarousel";
import TripDescription from "../comps/trip/tripdescription";
import ModalsItem from "../comps/trip/modalsitem";
import { formatNumber, daysBefore, sumAmounts } from "../libs/custom";

export const getStaticProps = async ({ params }) => {
  const { title } = params;
  const query = collectionGroup(firestore, "trips");
  try {
    const querySnapshot = await getDocs(query);
    const tripDoc = querySnapshot.docs.find((doc) => doc.id === title);
    if (!tripDoc) {
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
    return {
      props: {},
    };
  }
};

export default function Trippage(props) {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [modalMode, setModalMode] = useState("");
  const [updates, setUpdates] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [tripImages, setTripImages] = useState([]);
  const [dontaionMode, setDonationMode] = useState("donating");
  const dark = colorScheme === "dark";

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

  const [donationAmount, setDonationAmount] = useState(0);
  const [donationSum, setDonationSum] = useState(0);
  const [donationProgress, setDonationProgress] = useState(0);
  const [donorName, setDonorName] = useState("");
  const [stayAnon, setStayAnon] = useState(false);
  const [updateDataLoaded, setUpdateDataLoaded] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (props.trip) setDataLoaded(true);
    }, 1000);
  }, [props.trip]);

  useEffect(() => {
    if (
      donations &&
      tripData &&
      donations.length !== tripData.donations?.length
    ) {
      setDonations(tripData?.donations);
      setDonationSum(Math.floor(sumAmounts(tripData?.donations)));
    }
  }, [donations, donationSum, tripData, setDonations, setDonationSum]);

  useEffect(() => {
    const calculatePercentage = () => {
      return (donationSum / tripData.costsSum) * 100;
    };

    if (tripData && donationProgress === 0 && donations.length !== 0) {
      setDonationProgress(calculatePercentage);
    }
  }, [donationProgress, donations, donationSum, tripData]);

  useEffect(() => {
    router.prefetch("/thankyou");
    router.prefetch("/purchase");
  }, [router]);

  useEffect(() => {
    if (props.trip) {
      const dSum = Math.floor(sumAmounts(props.trip.donations));
      setDonationSum(dSum);
      setDonationProgress((dSum / props.trip.costsSum) * 100);
      setTripData(props.trip);
      setTripImages(props.trip.images);
      setTripDesc(props.trip.tripDesc);
      setUpdates(props.trip.updates);
      setDonations(props.trip.donations);
    }
  }, [
    images,
    props.trip,
    setTripData,
    setTripDesc,
    setDonations,
    setDonationSum,
    setDonationProgress,
  ]);

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
    setModalMode("postUpdate");
  };

  const showDonateModal = () => {
    setModalMode("donating");
  };

  const closeAltModal = () => {
    setModalMode("");
    setDonationMode("donating");
    setDonationAmount(0);
    setStayAnon(false);
    setDonorName("");
  };

  const closeEditTripModal = () => {
    setModalMode("");
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
                  mb={tripData.images?.length === 0 ? 15 : 0}
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
                    size={"xl"}
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
                    <IconBrandFacebook size={26} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Instagram">
                  <Button
                    size={"xl"}
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
                    <IconBrandInstagram size={26} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Tiktok">
                  <Button
                    size={"xl"}
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
                    <IconBrandTiktok size={26} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Twitter">
                  <Button
                    size={"xl"}
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
                    <IconBrandTwitter size={26} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share on Whatsapp">
                  <Button
                    size={"xl"}
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
                    <IconBrandWhatsapp size={26} />
                  </Button>
                </Tooltip>
                <Tooltip label="HTML Embed Code">
                  <Button
                    size={"xl"}
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
                    <IconSourceCode size={26} />
                  </Button>
                </Tooltip>
                <Tooltip label="Share with QR Code">
                  <Button
                    size={"xl"}
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
                    <IconQrcode size={26} />
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
            {updates && updates.length > 0 && (
              <Updates
                setCurrentUpdateId={setCurrentUpdateId}
                updates={updates}
                setUpdates={setUpdates}
                setModalMode={setModalMode}
                tripData={tripData}
                user={user}
              />
            )}
            <Box
              className="pagePanel"
              w={"85%"}
              mt={updates && updates.length === 1 ? 30 : 0}
              mb={50}
              p={"20px 30px"}
            >
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
                      ${donationSum}
                    </Title>
                    <Text fz={11} mb={8} span>
                      RAISED
                    </Text>
                  </Flex>
                  <Divider w={"90%"} opacity={0.4} my={3} />
                  <Flex align={"center"} gap={3} pl={5}>
                    <IconTargetArrow size={20} stroke={1} opacity={0.2} />
                    <Title order={4} opacity={0.5}>
                      ${formatNumber(tripData.costsSum)}
                    </Title>
                    <Text fz={11} span>
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
                value={donationProgress}
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
                  <Text>USE FUNDS: ${donationSum}</Text>
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
              <Donations
                donations={donations}
                setDonations={setDonations}
                donationSectionLimit={10}
                dHeight={"calc(100vh - 405px)"}
              />
            </Box>
          </Flex>
        </Flex>
      </Center>
      <ModalsItem
        modalMode={modalMode}
        setModalMode={setModalMode}
        tripData={tripData}
        user={user}
        router={router}
        closeEditTripModal={closeEditTripModal}
        dark={dark}
        images={images}
        setImages={setImages}
        weekAhead={weekAhead}
        closeAltModal={closeAltModal}
        updates={updates}
        setUpdates={setUpdates}
        updateDataLoaded={updateDataLoaded}
        setUpdateDataLoaded={setUpdateDataLoaded}
        dontaionMode={dontaionMode}
        setDonationMode={setDonationMode}
        currentUpdateId={currentUpdateId}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        stayAnon={stayAnon}
        setStayAnon={setStayAnon}
        donorName={donorName}
        setDonorName={setDonorName}
        donations={donations}
        setDonations={setDonations}
      />
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
