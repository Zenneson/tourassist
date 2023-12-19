"use client";
import {
  activeTripData,
  donationsAtom,
  fundsAtom,
  tripDataAtom,
  tripDescAtom,
  tripImagesAtom,
  updatesAtom,
} from "@libs/atoms";
import { useUser } from "@libs/context";
import { addComma, addEllipsis, daysBefore } from "@libs/custom";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
} from "@mantine/core";
import { useForceUpdate } from "@mantine/hooks";
import {
  IconBlockquote,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconCurrencyDollar,
  IconHeartHandshake,
  IconPencil,
  IconQrcode,
  IconSourceCode,
} from "@tabler/icons-react";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageLoader from "../../../comps/pageLoader/pageLoader";
import {
  useCalculateFunds,
  useLoadUpdateData,
  useSyncDonations,
  useUpdateSpentFunds,
  useUpdateTripData,
} from "../hooks/hooks";
import classes from "../styles/title.module.css";
import Donations from "./donations";
import MainCarousel from "./mainCarousel";
import ModalsItem from "./modalsItem";
import TripDescription from "./tripDescription";
import Updates from "./updates";

export default function TripWrapper(props) {
  const { dbTripData, title } = props;

  const { user, loading } = useUser();
  const router = useRouter();

  const [modalMode, setModalMode] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [donationMode, setDonationMode] = useState("donating");
  const [images, setImages] = useState([]);

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const [tripImages, setTripImages] = useAtom(tripImagesAtom);
  const [updates, setUpdates] = useAtom(updatesAtom);
  const [tripDesc, setTripDesc] = useAtom(tripDescAtom);
  const [tripData, setTripData] = useAtom(tripDataAtom);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [donationSum, setDonationSum] = useState(0);
  const [spentFunds, setSpentFunds] = useState(0);
  const [donorName, setDonorName] = useState("");
  const [stayAnon, setStayAnon] = useState(false);
  const [updateDataLoaded, setUpdateDataLoaded] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState(0);

  const [funds, setFunds] = useAtom(fundsAtom);
  const [donations, setDonations] = useAtom(donationsAtom);
  const setActiveTrip = useSetAtom(activeTripData);
  const forceUpdate = useForceUpdate();

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

  const ShareButtons = () => (
    <Center>
      <Button.Group className={classes.shareButtonGroup}>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Facebook">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandFacebook size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Instagram">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandInstagram size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Tiktok">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandTiktok size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Twitter">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandTwitter size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Whatsapp">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandWhatsapp size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="HTML Embed Code">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconSourceCode size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share with QR Code">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconQrcode size={20} />
          </Button>
        </Tooltip>
      </Button.Group>
    </Center>
  );

  useUpdateTripData(
    dbTripData,
    setTripData,
    tripData,
    setTripDesc,
    setUpdates,
    setTripImages
  );
  useSyncDonations(donations, tripData, setDonations, setDonationSum);
  useCalculateFunds(funds, donationSum, spentFunds, setFunds);
  useUpdateSpentFunds(tripData, setSpentFunds, spentFunds);
  useLoadUpdateData(updates, tripData, setUpdates, setUpdateDataLoaded);

  return (
    <>
      <PageLoader contentLoaded={imagesLoaded && tripData.length !== 0} />
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
            <MainCarousel setImagesLoaded={setImagesLoaded} />
            <Divider
              w={"100%"}
              maw={688}
              size={"md"}
              my={tripData?.images?.length > 0 ? 15 : 0}
              labelPosition="left"
              label={
                <Title
                  order={1}
                  px={5}
                  mb={tripData?.images?.length === 0 ? 15 : 0}
                  maw={"800px"}
                  fw={700}
                >
                  {addEllipsis(tripData?.tripTitle, 34)}
                </Title>
              }
            />
            <ShareButtons />
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
                  opacity={dark && 0.4}
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
              <TripDescription dark={dark} tripDesc={tripData?.tripDesc} />
            </Box>
            {updates && updates.length > 0 && (
              <Updates
                user={user}
                tripData={tripData}
                setCurrentUpdateId={setCurrentUpdateId}
                updates={updates}
                setUpdates={setUpdates}
                setModalMode={setModalMode}
              />
            )}
            <Box
              className="pagePanel"
              w={"85%"}
              mt={updates && updates.length === 1 ? 20 : 0}
              mb={25}
              p={"20px 30px"}
            >
              <Divider
                size={"md"}
                w={"100%"}
                labelPosition="left"
                label={
                  <Flex align={"center"}>
                    <IconBlockquote size={50} opacity={0.2} />
                    <Title ml={8} order={4}>
                      DONOR MESSAGES
                    </Title>
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
              <Box className={classes.infoPanel}>
                <Grid w={"100%"}>
                  <Grid.Col span="auto">
                    <Stack gap={0} w={"100%"}>
                      <Flex align={"flex-end"} mb={-2} gap={2}>
                        <Title order={1} fz={25}>
                          <Flex align={"center"} className={classes.funds}>
                            <IconCurrencyDollar
                              stroke={2}
                              size={30}
                              style={{
                                marginRight: -4,
                              }}
                            />
                            {addComma(donationSum)}
                          </Flex>
                        </Title>
                        <Text fz={11} mb={2} ml={2} opacity={0.2} span>
                          RAISED
                        </Text>
                      </Flex>
                      <Divider w={"100%"} className={classes.divider} my={3} />
                      <Flex align={"center"} gap={3} pl={5}>
                        <Title order={4} opacity={0.5}>
                          <Flex
                            align={"center"}
                            fz={17}
                            fw={400}
                            className={classes.costsSum}
                          >
                            <IconCurrencyDollar
                              stroke={1}
                              className={classes.dollarSign}
                              size={20}
                            />
                            {addComma(tripData?.costsSum)}
                          </Flex>
                        </Title>
                        <Text fz={11} opacity={0.2} mb={-3} span>
                          GOAL
                        </Text>
                      </Flex>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span="content">
                    <Box
                      w={90}
                      pt={8}
                      className={classes.daysLeftWrapper}
                      style={{ borderRadius: "3px" }}
                    >
                      <Title mt={-7} ta={"center"} className={classes.daysLeft}>
                        {daysBefore(tripData?.travelDate).toString()}
                      </Title>
                      <Text ta={"center"} fz={10} mt={-5} pb={5}>
                        DAYS LEFT
                      </Text>
                    </Box>
                  </Grid.Col>
                </Grid>
                <Progress
                  value={(donationSum / tripData?.costsSum) * 100}
                  classNames={{ section: classes.progress }}
                  bg={"gray.6"}
                  size={"md"}
                  mt={10}
                  mb={12}
                />
                {user && user.email === tripData?.user && (
                  <Button
                    className={classes.useFundsBtn}
                    w={"100%"}
                    variant="transparent"
                    onClick={() => {
                      router.push("/purchase");
                      setActiveTrip(tripData);
                    }}
                  >
                    <Text fw={700}>
                      USE FUNDS: ${addComma(donationSum - spentFunds)}
                    </Text>
                  </Button>
                )}
                {user?.email !== tripData?.user && (
                  // Main Donate Button
                  <Button
                    fullWidth
                    variant="transparent"
                    className={classes.donateBtn}
                    onClick={showDonateModal}
                  >
                    <Flex align={"center"} fz={20} gap={5}>
                      DONATE <IconHeartHandshake size={23} />
                    </Flex>
                  </Button>
                )}
              </Box>
            </Box>
            <Box className="pagePanel">
              <Donations
                donations={tripData?.donations}
                setDonations={setDonations}
                donationSectionLimit={10}
                dHeight={"calc(100vh - 455px)"}
              />
            </Box>
            {user?.email === tripData?.user ? (
              <Button
                className={classes.updateModalButton}
                mt={20}
                onClick={showUpdateModal}
                variant="transparent"
              >
                POST UPDATE
              </Button>
            ) : (
              <Button
                className={classes.startTripBtn}
                mt={20}
                onClick={() => router.push("/map")}
                variant="transparent"
              >
                PLAN YOUR TRIP
              </Button>
            )}
          </Flex>
        </Flex>
      </Center>
      <ModalsItem
        title={title}
        modalMode={modalMode}
        setModalMode={setModalMode}
        tripData={tripData}
        tripDesc={tripData?.tripDesc}
        travelDate={tripData?.travelDate}
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
        donationMode={donationMode}
        setDonationMode={setDonationMode}
        currentUpdateId={currentUpdateId}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        stayAnon={stayAnon}
        setStayAnon={setStayAnon}
        donorName={donorName}
        setDonorName={setDonorName}
        donations={donations}
      />
    </>
  );
}
