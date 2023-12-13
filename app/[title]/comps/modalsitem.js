"use client";
import { DuffelPayments } from "@duffel/components";
import { travelDateAtom } from "@libs/atoms";
import { dateFormat, formatDonation } from "@libs/custom";
import { firestore } from "@libs/firebase";
import {
  addUpdateContent,
  addUpdateTitle,
  maxReached,
  noDonation,
  noDonorName,
  paymentError,
  postingUpdate,
  updatePosted,
} from "@libs/notifications";
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Divider,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { notifications } from "@mantine/notifications";
import { Link, RichTextEditor } from "@mantine/tiptap";
import "@mantine/tiptap/styles.css";
import {
  IconCalendarEvent,
  IconCurrencyDollar,
  IconHeartHandshake,
} from "@tabler/icons-react";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { doc, updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";
import classes from "../styles/modalsItem.module.css";
import TripContent from "./tripContent";

export default function ModalsItem(props) {
  const {
    title,
    tripData,
    modalMode,
    setModalMode,
    tripDesc,
    user,
    closeEditTripModal,
    dark,
    images,
    setImages,
    weekAhead,
    closeAltModal,
    updates,
    setUpdates,
    updateDataLoaded,
    donationMode,
    setDonationMode,
    currentUpdateId,
    donationAmount,
    setDonationAmount,
    stayAnon,
    setStayAnon,
    donorName,
    setDonorName,
    donations,
    setNewUpdate,
  } = props;
  const donationRef = useRef(null);
  const donorNameRef = useRef(null);
  const [paymentToken, setPaymentToken] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [tokenUpdated, setTokenUpdated] = useState(false);
  const [paid, setPaid] = useState(false);

  const processingFee = () => {
    return Math.ceil(Math.min(donationAmount * 0.03, 150)).toFixed(2);
  };

  const totalDonation = () => {
    const fee = Number(processingFee());
    const total = Math.min(donationAmount + fee, 5150);
    return formatDonation(total);
  };

  const DateChanger = () => {
    const [travelDate, setTravelDate] = useAtom(travelDateAtom);

    return (
      <DateInput
        classNames={{ input: classes.dateInput }}
        rightSection={<IconCalendarEvent size={20} />}
        rightSectionWidth={50}
        rightSectionPointerEvents="none"
        variant="default"
        minDate={weekAhead}
        firstDayOfWeek={0}
        size="sm"
        ta={"right"}
        w={"100%"}
        maw={150}
        onChange={(e) => setTravelDate(new Date(e))}
        value={new Date(travelDate)}
        valueFormat="MMM DD, YYYY"
      />
    );
  };

  const UpdateForm = () => {
    const updateEditor = useEditor({
      editable: true,
      extensions: [
        Link,
        StarterKit,
        TextStyle,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({
          placeholder:
            "Add an update about your trip. This could be a new milestone, a new goal, or a new challenge you're facing.",
        }),
      ],
      parseOptions: {
        preserveWhitespace: "full",
      },
    });

    const [allUpdates, setAllUpdates] = useState([]);
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateContent, setUpdateContent] = useState("");

    useEffect(() => {
      if (updates && allUpdates.length > 0) {
        setAllUpdates(updates);
      }
    }, [allUpdates, setAllUpdates]);

    useEffect(() => {
      const findUpdateById = (currentUpdateId) => {
        return updates.find((update) => update.updateId === currentUpdateId);
      };

      if (
        modalMode === "editUpdate" &&
        updates &&
        updateEditor &&
        currentUpdateId !== 0
      ) {
        const currentUpdate = findUpdateById(currentUpdateId);
        setUpdateTitle(currentUpdate.updateTitle);
        setUpdateContent(currentUpdate.updateContent);
        updateEditor.commands.setContent(updateContent);
      }
    }, [updateEditor, updateContent]);

    const handleUpdate = async () => {
      setNewUpdate(true);
      try {
        if (updateTitle === "") {
          notifications.show(addUpdateTitle);
          console.error("Update Title is empty");
          return;
        }
        if (
          updateEditor &&
          (updateEditor.getHTML() === "<p></p>" ||
            updateEditor.getHTML() === "")
        ) {
          notifications.show(addUpdateContent);
          console.error("Update Content is empty");
          return;
        }

        notifications.show(postingUpdate);

        let newUpdates;
        if (modalMode === "editUpdate") {
          const updateIndex = updates.findIndex(
            (update) => update.updateId === currentUpdateId
          );
          if (updateIndex !== -1) {
            const updateObj = { ...updates[updateIndex] };
            updateObj.updateTitle = updateTitle;
            updateObj.updateContent = updateEditor && updateEditor.getHTML();
            newUpdates = [...updates];
            newUpdates[updateIndex] = updateObj;
          } else {
            console.error("Update not found");
            return;
          }
        }

        if (modalMode === "postUpdate") {
          const updatesArray = Array.isArray(updates) ? updates : [];
          const updateObj = {
            updateTitle: updateTitle,
            updateContent: updateEditor && updateEditor.getHTML(),
            updateDate: dateFormat(new Date().toLocaleDateString()),
            updateId: updatesArray.length + 1 || 1,
          };
          newUpdates = [...updatesArray, updateObj];
        }

        setUpdates(newUpdates);
        setModalMode("");
        mutate(title, newUpdates, false);

        await updateDoc(
          doc(firestore, "users", user.email, "trips", tripData.tripId),
          { updates: newUpdates }
        );

        mutate(title);

        notifications.update(updatePosted);
        setNewUpdate(false);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <>
        <Input
          classNames={{ input: classes.updateInputTitle }}
          tabIndex={1}
          size={"xl"}
          w="100%"
          placeholder="Update Title..."
          maw={800}
          value={updateTitle || ""}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              updateEditor.commands.focus("end");
            }
          }}
          onChange={(e) => setUpdateTitle(e.target.value)}
          wrapperProps={{
            style: {
              borderRadius: 3,
            },
          }}
        />
        <ScrollArea
          h={300}
          w={"100%"}
          scrollbarSize={8}
          scrollHideDelay={250}
          style={{
            overflow: "hidden",
            borderRadius: "3px",
          }}
        >
          <RichTextEditor
            classNames={{
              root: classes.textEditor,
              toolbar: classes.textEditorToolbar,
              content: classes.textEditorContent,
            }}
            editor={updateEditor}
            position="relative"
            bg={dark ? "dark.6" : "gray.2"}
            onChange={() => {
              const content = updateEditor.getHTML();
              setUpdateContent(content);
            }}
          >
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
            <RichTextEditor.Content />
          </RichTextEditor>
        </ScrollArea>
        <Group justify="flex-end" w={"100%"}>
          <Button variant="default" size="md" w={"25%"} onClick={handleUpdate}>
            {modalMode === "editUpdate"
              ? "SAVE UPDATE"
              : modalMode === "postUpdate"
              ? "POST UPDATE"
              : ""}
          </Button>
        </Group>
      </>
    );
  };

  const updateDonations = async (data) => {
    const currentDonations = Array.isArray(donations) ? donations : [];
    const entry = {
      name: donorName,
      amount: donationAmount,
      time: data.created_at,
    };
    const newDonations = [...currentDonations, entry];
    mutate(
      title,
      (currentData) => {
        return { ...currentData, donations: newDonations };
      },
      false
    );
    await updateDoc(
      doc(firestore, "users", tripData.user, "trips", tripData.tripId),
      { donations: newDonations }
    );
    mutate(title);
  };

  const donationReq = () => {
    if (donationAmount === 0) {
      notifications.show(noDonation);
      donationRef.current.focus();
      donationRef.current.select();
      return;
    }
    if (donationAmount > 5000) {
      notifications.show(maxReached);
      setDonationAmount(5000);
      return;
    }
    if (donorName === "" && !stayAnon) {
      notifications.show(noDonorName);
      donorNameRef.current.focus();
      return;
    }

    const passingTotal = parseFloat(totalDonation().replace(/,/g, ""));
    fetch("/api/payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DUFFEL_AC}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Duffel-Version": "v1",
        "Accept-Encoding": "gzip",
      },
      body: passingTotal,
    })
      .then((response) => response.json())
      .then((data) => {
        const token = data.data.client_token;
        setPaymentToken(token);
        setPaymentId(data.data.id);
        setTokenUpdated(true);
      })
      .catch((error) => {
        console.error("Failed to create payment intent:", error);
      });
  };

  const successfulPayment = () => {
    setPaid(true);
    fetch("/api/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DUFFEL_AC}`,
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "Duffel-Version": "v1",
      },
      body: paymentId,
    })
      .then((response) => response.json())
      .then((data) => {
        setPaid(false);
        setDonationMode("thanks");
        updateDonations(data.data);
      })
      .catch((error) => {
        closeAltModal();
        notifications.show(paymentError(error, dark));
        console.error(error);
      });
  };

  const errorPayment = (error) => {
    closeAltModal();
    notifications.show(paymentError(error, dark));
    console.log(error);
  };

  useEffect(() => {
    if (tokenUpdated) {
      setDonationMode("pay");
      setTokenUpdated(false);
    }
  }, [tokenUpdated, setDonationMode]);

  const postMessage = () => {
    closeAltModal();
    // will add comment posting logic here
  };

  return (
    <Box>
      <Modal
        classNames={{
          header: classes.editTripModalHeader,
          content: classes.editTripModalContent,
          overlay: classes.editTripModalOverlay,
        }}
        withCloseButton={false}
        size={864}
        padding={"xl"}
        opened={modalMode === "editTrip"}
        scrollAreaComponent={ScrollArea.Autosize}
        onClose={closeEditTripModal}
        lockScroll={false}
        overlayProps={{
          color: dark ? "rgb(0,0,0)" : "rgb(255,255,255)",
          backgroundOpacity: dark ? 0.5 : 0.2,
          blur: 9,
        }}
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
          <Stack align="center" gap={20}>
            <Title order={6} w={"100%"} ta={"left"} fs={"italic"}>
              EDIT TRIP DETAILS:
            </Title>
            <Group
              w={"100%"}
              pl={10}
              pt={2}
              pb={5}
              ml={-3}
              justify="space-between"
              style={{
                borderLeft: `2px solid ${
                  dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
                }`,
              }}
            >
              <Text fw={700} fz={15} w={"70%"} fs={"italic"} lineClamp={1}>
                {tripData && tripData.tripTitle}
              </Text>
              <DateChanger />
            </Group>
            <TripContent
              user={user}
              images={images}
              tripDesc={tripDesc}
              tripData={tripData}
              setImages={setImages}
              modalMode={modalMode}
              setModalMode={setModalMode}
              weekAhead={weekAhead}
              setNewUpdate={setNewUpdate}
            />
          </Stack>
        </Box>
      </Modal>
      <Modal
        classNames={{
          header: classes.altModalModalHeader,
          content: classes.altModalModalContent,
          overlay: classes.altModalModalOverlay,
        }}
        pos={"relative"}
        withCloseButton={false}
        size={modalMode === "donating" ? "auto" : 850}
        padding={"xl"}
        opened={
          modalMode === "postUpdate" ||
          modalMode === "editUpdate" ||
          modalMode === "donating"
        }
        overlayProps={{
          color: dark ? "rgb(0,0,0)" : "rgb(255,255,255)",
          backgroundOpacity: dark ? 0.5 : 0.2,
          blur: 9,
        }}
        onClose={() => {
          closeAltModal();
        }}
      >
        {/* Close Modal */}
        <CloseButton
          pos={"absolute"}
          top={20}
          right={18}
          size={25}
          onClick={closeAltModal}
        />
        <ScrollArea.Autosize pos={"relative"} type="never">
          <LoadingOverlay
            visible={(modalMode === "editUpdate" && !updateDataLoaded) || paid}
            loaderProps={{ color: dark ? "#0d3f82" : "#2dc7f3", type: "bars" }}
            overlayProps={{ backgroundOpacity: 1 }}
          />
          {modalMode === "donating" && (
            <Box w={modalMode === "donating" ? "auto" : 800}>
              <Title mb={5} color={dark ? "#00E8FC" : "#0D3F82"}>
                <Flex align={"center"} gap={5}>
                  {donationMode === "thanks" ? "THANK YOU" : "DONATE"}
                  <IconHeartHandshake size={35} />
                </Flex>
              </Title>
              <Divider w={"100%"} size={"xl"} opacity={0.4} mb={15} />
              {donationMode === "donating" && (
                <Group mb={15} grow>
                  <Stack>
                    <Input
                      ref={donorNameRef}
                      placeholder={stayAnon ? "Anonymous" : "Name..."}
                      size="md"
                      maxLength={20}
                      w={"100%"}
                      value={!stayAnon ? donorName : "Anonymous"}
                      onChange={(e) => setDonorName(e.currentTarget.value)}
                      disabled={stayAnon}
                    />
                    <NumberInput
                      classNames={{ input: classes.donationInput }}
                      ref={donationRef}
                      leftSection={<IconCurrencyDollar size={35} />}
                      size="xl"
                      hideControls
                      variant="filled"
                      defaultValue={0}
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e)}
                      onClick={(e) => {
                        if (
                          e.target.value === 0 ||
                          e.target.value === "0" ||
                          e.target.value === "0.00"
                        ) {
                          e.target.select();
                        }
                      }}
                    />
                    <Group justify="flex-end" w={"100%"}>
                      <Checkbox
                        classNames={{ input: classes.donationCheck }}
                        size={"xs"}
                        labelPosition="left"
                        label="Stay Anonymous"
                        checked={stayAnon}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setStayAnon(!stayAnon);
                          }
                        }}
                        onChange={(e) => {
                          setStayAnon(e.currentTarget.checked);
                          if (e.currentTarget.checked) {
                            setDonorName("Anonymous");
                          } else {
                            setDonorName("");
                          }
                        }}
                      />
                    </Group>
                    <Button
                      variant="default"
                      size="sm"
                      w={"100%"}
                      onClick={donationReq}
                    >
                      Continue...
                    </Button>
                  </Stack>
                </Group>
              )}
              {donationMode === "pay" && paymentToken && (
                <Box color="#fff">
                  <Group justify="space-between" px={5} mb={5}>
                    <Text fz={15} fw={700} fs={"italic"}>
                      Thanks for the Assist...
                    </Text>
                    <Flex align={"flex-start"} gap={7}>
                      <Text fz={11} mt={5} fs={"italic"} fw={100} opacity={0.2}>
                        Donation
                      </Text>
                      <Text fz={20} fw={700} opacity={0.5}>
                        ${formatDonation(donationAmount)}
                      </Text>
                    </Flex>
                  </Group>
                  <Box
                    pl={20}
                    py={5}
                    mx={5}
                    mb={10}
                    style={{
                      borderLeft: "3px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <Flex align={"center"} gap={10}>
                      <Divider
                        labelPosition="left"
                        label="Processing fee"
                        w={"100%"}
                      />{" "}
                      <Text fz={12}>${processingFee()}</Text>
                    </Flex>
                    <Flex align={"center"} gap={10}>
                      <Divider
                        w={"100%"}
                        labelPosition="left"
                        label={
                          <Text fz={15} fw={700}>
                            Total
                          </Text>
                        }
                      />
                      <Text fz={14} fw={700}>
                        ${totalDonation()}
                      </Text>
                    </Flex>
                  </Box>
                  <DuffelPayments
                    paymentIntentClientToken={paymentToken}
                    onSuccessfulPayment={successfulPayment}
                    onFailedPayment={errorPayment}
                    debug={true}
                    styles={{
                      buttonCornerRadius: "3px",
                      fontFamily: "inherit",
                      accentColor: "#fff",
                    }}
                  />
                </Box>
              )}
              {donationMode === "thanks" && (
                <>
                  <Text w={"100%"} ta={"center"} c={"#777"}>
                    Thank you for your donation, please leave a message of
                    suppport{" "}
                  </Text>
                  <Textarea
                    placeholder="Bon voyage!"
                    variant="filled"
                    autosize
                    mt={10}
                    size="sm"
                    minRows={8}
                  />
                  <Group justify="flex-end" mt={20} w={"100%"} gap={0}>
                    <Button
                      variant="transparent"
                      c={dark ? "#fff" : "#000"}
                      fw={100}
                      fz={10}
                      onClick={closeAltModal}
                    >
                      No Thanks
                    </Button>
                    <Button
                      variant="default"
                      size="md"
                      w={"25%"}
                      onClick={postMessage}
                    >
                      POST
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
                <UpdateForm />
              </Stack>
            </>
          )}
        </ScrollArea.Autosize>
      </Modal>
    </Box>
  );
}
