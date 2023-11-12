"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collectionGroup, getDocs } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import { useSessionStorage } from "@mantine/hooks";
import useSWR, { preload } from "swr";
import {
  useComputedColorScheme,
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
  Grid,
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
  IconCurrencyDollar,
} from "@tabler/icons-react";
import Donations from "../comps/trip/donations";
import Updates from "../comps/trip/updates";
import MainCarousel from "../comps/trip/maincarousel";
import TripDescription from "../comps/trip/tripdescription";
import ModalsItem from "../comps/trip/modalsitem";
import { addComma, daysBefore, sumAmounts } from "../libs/custom";
import { useUser } from "../libs/context";
import classes from "./trippage.module.css";

export const getStaticPaths = async () => {
  const queryData = collectionGroup(firestore, "trips");
  let paths = [];

  try {
    const querySnapshot = await getDocs(queryData);
    paths = querySnapshot.docs.map((doc) => {
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

const fireFetcher = async (url) => {
  const query = collectionGroup(firestore, "trips");
  const querySnapshot = await getDocs(query);
  const tripDoc = querySnapshot.docs.find((doc) => doc.id === url);
  if (!tripDoc) {
    throw new Error("No document found with the matching 'title'");
  }
  return tripDoc.data();
};

export const getStaticProps = async ({ params }) => {
  const { title } = params;
  preload(title, fireFetcher);

  return {
    props: {
      title,
    },
    revalidate: 1,
  };
};

export default function Trippage(props) {
  const router = useRouter();
  const [modalMode, setModalMode] = useState("");
  const [updates, setUpdates] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [dontaionMode, setDonationMode] = useState("donating");
  const [images, setImages] = useState([]);
  const [newUpdate, setNewUpdate] = useState(false);

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const { user } = useUser();
  const { title } = router.query;

  const [donationAmount, setDonationAmount] = useState(0);
  const [donationSum, setDonationSum] = useState(0);
  const [spentFunds, setSpentFunds] = useState(0);
  const [donationProgress, setDonationProgress] = useState(0);
  const [donorName, setDonorName] = useState("");
  const [stayAnon, setStayAnon] = useState(false);
  const [updateDataLoaded, setUpdateDataLoaded] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState(0);
  const [isMutating, setIsMutating] = useState(false);

  const [carouselLoaded, setCarouselLoaded] = useSessionStorage({
    key: "carouselLoaded",
  });

  const [funds, setFunds] = useSessionStorage({
    key: "funds",
    defaultValue: 0,
  });

  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  const [activeTrip, setActiveTrip] = useSessionStorage({
    key: "activeTrip",
    defaultValue: [],
  });

  const {
    data: tripData,
    error,
    isLoading,
    isValidating,
  } = useSWR(title, fireFetcher);

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
    if (funds === 0 && donationSum > 0) {
      setFunds(donationSum - spentFunds);
    }
  }, [donationSum, spentFunds, funds, setFunds]);

  useEffect(() => {
    const calculatePercentage = () => {
      return (donationSum / tripData?.costsSum) * 100;
    };

    if (
      tripData &&
      donationProgress === 0 &&
      donations &&
      donations.length !== 0
    ) {
      setDonationProgress(calculatePercentage);
    }
  }, [donationProgress, donations, donationSum, tripData]);

  useEffect(() => {
    if (tripData?.spentFunds > 0) setSpentFunds(tripData.spentFunds);
  }, [tripData]);

  useEffect(() => {
    router.prefetch("/thankyou");
    router.prefetch("/purchase");
  }, [router]);

  useEffect(() => {
    if (tripData || newUpdate) {
      const dSum = Math.floor(sumAmounts(tripData?.donations));
      setDonationSum(dSum);
      setDonationProgress((dSum / tripData?.costsSum) * 100);
      setUpdates(tripData?.updates);
      setDonations(tripData?.donations);
      setNewUpdate(false);
      setIsMutating(false);
    }
  }, [
    images,
    tripData,
    updates,
    newUpdate,
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
          <Text size="xs" c="dimmed">
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
    setImages(tripData?.images);
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

  const isFinalLoading =
    isLoading || isValidating || isMutating || !carouselLoaded;

  if (isFinalLoading && modalMode === "") {
    return (
      <LoadingOverlay visible={true} overlayProps={{ backgroundOpacity: 1 }} />
    );
  }

  return (
    <>
      <Center mt={120}>
        <Flex
          gap={30}
          w={"80%"}
          maw={1200}
          pos={"relative"}
          h={"100%"}
          align={"flex-start"}
          style={{
            overflow: "visible",
          }}
        >
          <Flex
            w={"calc(70% - 30px)"}
            direction={"column"}
            align={"center"}
            pos={"relative"}
          >
            <MainCarousel tripImages={tripData?.images} />
            <Divider
              w={"80%"}
              color={dark ? "gray.6" : "dark.6"}
              size={"md"}
              my={tripData?.images?.length > 0 ? 15 : 0}
              labelPosition="left"
              label={
                <Title
                  order={3}
                  px={5}
                  mb={tripData?.images?.length === 0 ? 15 : 0}
                  maw={"800px"}
                  color={dark ? "gray.6" : "dark.6"}
                  fw={700}
                >
                  {tripData?.tripTitle}
                </Title>
              }
            />
            <Center>
              <Button.Group
                style={{
                  borderRadius: 50,
                  overflow: "hidden",
                }}
              >
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="Share on Facebook"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                  >
                    <IconBrandFacebook size={20} />
                  </Button>
                </Tooltip>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="Share on Instagram"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                  >
                    <IconBrandInstagram size={20} />
                  </Button>
                </Tooltip>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="Share on Tiktok"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                  >
                    <IconBrandTiktok size={20} />
                  </Button>
                </Tooltip>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="Share on Twitter"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                  >
                    <IconBrandTwitter size={20} />
                  </Button>
                </Tooltip>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="Share on Whatsapp"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                  >
                    <IconBrandWhatsapp size={20} />
                  </Button>
                </Tooltip>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="HTML Embed Code"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
                  >
                    <IconSourceCode size={20} />
                  </Button>
                </Tooltip>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label="Share with QR Code"
                >
                  <Button
                    className={classes.brightButton}
                    size={"xl"}
                    variant="filled"
                    bg={dark ? "dark.8" : "gray.3"}
                    c={dark ? "gray.0" : "dark.2"}
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
              mb={20}
              py={20}
              px={30}
              fz={14}
            >
              {user && user.email === tripData?.user && (
                <Divider
                  labelPosition="right"
                  color={dark && "gray.8"}
                  w={"100%"}
                  opacity={dark && 0.2}
                  label={
                    // Edit Trip Details
                    <Button
                      size="compact-xs"
                      radius={25}
                      pl={10}
                      pr={15}
                      variant="subtle"
                      color="gray.6"
                      leftSection={
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
              <TripDescription tripDesc={tripData?.tripDesc} />
            </Box>
            {updates && updates.length > 0 && (
              <Updates
                user={user}
                tripData={tripData}
                setCurrentUpdateId={setCurrentUpdateId}
                updates={updates}
                setUpdates={setUpdates}
                setModalMode={setModalMode}
                setIsMutating={setIsMutating}
              />
            )}
            <Box
              className="pagePanel"
              w={"85%"}
              mt={updates && updates.length === 1 ? 20 : 0}
              mb={50}
              p={"20px 30px"}
            >
              <Divider
                size={"md"}
                w={"100%"}
                labelPosition="left"
                label={
                  <Flex align={"center"}>
                    <IconQuote size={40} opacity={0.2} />
                    <Title order={4}>DONOR MESSAGES</Title>
                  </Flex>
                }
              />
              <Box pl={10}>
                {user?.email !== tripData?.user && (
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
                    {user && user.email !== tripData?.user
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
              <Grid w={"100%"}>
                <Grid.Col span="auto">
                  <Stack gap={0} w={"100%"}>
                    <Flex align={"flex-end"} mb={-2} gap={3}>
                      <Title color="green.4" order={1}>
                        <Flex align={"center"}>
                          <IconCurrencyDollar
                            stroke={1}
                            size={35}
                            style={{
                              marginRight: -4,
                            }}
                          />
                          {addComma(donationSum)}
                        </Flex>
                      </Title>
                      <Text fz={11} mb={8} span>
                        RAISED
                      </Text>
                    </Flex>
                    <Divider
                      w={"90%"}
                      color={dark ? "gray.6" : "dark.6"}
                      opacity={0.1}
                      my={3}
                    />
                    <Flex align={"center"} gap={3} pl={5}>
                      <Title order={4} opacity={0.5}>
                        <Flex align={"center"}>
                          <IconCurrencyDollar
                            stroke={1}
                            size={25}
                            style={{
                              marginRight: -4,
                            }}
                          />
                          {addComma(tripData?.costsSum)}
                        </Flex>
                      </Title>
                      <Text fz={11} span>
                        GOAL
                      </Text>
                    </Flex>
                  </Stack>
                </Grid.Col>
                <Grid.Col span="content">
                  <Box
                    w={100}
                    pt={12}
                    bg={dark ? "dark.6" : "gray.3"}
                    style={{
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
                </Grid.Col>
              </Grid>
              <Progress
                value={donationProgress}
                color="green.7"
                bg={"gray.6"}
                size={"sm"}
                radius={"xl"}
                mt={10}
                mb={12}
              />
              {user && user.email === tripData?.user && (
                <Button
                  w={"100%"}
                  radius={25}
                  variant="gradient"
                  gradient={{ from: "green.3", to: "green.9", deg: 45 }}
                  onClick={() => {
                    router.push("/purchase");
                    setActiveTrip(tripData);
                  }}
                >
                  <Text>USE FUNDS: ${addComma(donationSum - spentFunds)}</Text>
                </Button>
              )}
              {user?.email !== tripData?.user && (
                // Main Donate Button
                <Button
                  fullWidth
                  radius={25}
                  variant="gradient"
                  gradient={{ from: "#0D3F82", to: "#2DC7F3", deg: 45 }}
                  onClick={showDonateModal}
                >
                  <Flex align={"center"} fz={20} gap={5}>
                    DONATE <IconHeartHandshake size={23} />
                  </Flex>
                </Button>
              )}
            </Box>
            <Box className="pagePanel">
              <Donations
                donations={donations}
                setDonations={setDonations}
                donationSectionLimit={10}
                dHeight={"calc(100vh - 440px)"}
              />
            </Box>
            {user?.email === tripData?.user && (
              <Button
                className={classes.updateModalButton}
                variant="default"
                radius={"xl"}
                mt={20}
                bg={dark ? "dark.7" : "gray.3"}
                onClick={showUpdateModal}
              >
                POST UPDATE
              </Button>
            )}
          </Flex>
        </Flex>
      </Center>
      <ModalsItem
        modalMode={modalMode}
        setModalMode={setModalMode}
        tripData={tripData}
        tripDesc={tripData?.tripDesc}
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
        setNewUpdate={setNewUpdate}
        setIsMutating={setIsMutating}
      />
    </>
  );
}
