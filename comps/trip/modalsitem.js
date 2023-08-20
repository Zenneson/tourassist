import { useState, useEffect } from "react";
import {
  IconHeartHandshake,
  IconCurrencyDollar,
  IconCalendarEvent,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import {
  Box,
  Button,
  Modal,
  Flex,
  Divider,
  CloseButton,
  Stack,
  Title,
  Text,
  LoadingOverlay,
  Group,
  Image,
  NumberInput,
  Input,
  ScrollArea,
  Textarea,
} from "@mantine/core";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { useSessionStorage } from "@mantine/hooks";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { DateInput } from "@mantine/dates";
import TripContent from "./tripContent";
import { dateFormat } from "../../libs/custom";
import { notifications } from "@mantine/notifications";
import { DuffelPayments } from "@duffel/components";

export default function ModalsItem(props) {
  const {
    modalMode,
    setModalMode,
    tripData,
    user,
    router,
    closeEditTripModal,
    dark,
    images,
    setImages,
    weekAhead,
    closeAltModal,
    paid,
    setPaid,
    updates,
    setUpdates,
    updateDataLoaded,
    setUpdateDataLoaded,
  } = props;
  const [donationAmount, setDonationAmount] = useState(0);
  const [paymentToken, setPaymentToken] = useState(null);

  const addUpdateTitle = {
    color: "orange",
    icon: <IconAlertTriangle size={20} />,
    title: "Please add a title",
    autoClose: 3000,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const addUpdateContent = {
    color: "orange",
    icon: <IconAlertTriangle size={20} />,
    title: "You have not added any text to your update",
    autoClose: 3000,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const postingUpdate = {
    id: "postingUpdate",
    color: "green",
    icon: <IconCheck size={20} />,
    title: "Update posted!",
    autoClose: false,
    loading: true,
    withCloseButton: false,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const updatePosted = {
    id: "postingUpdate",
    color: "green",
    icon: <IconCheck size={20} />,
    title: "Update posted!",
    autoClose: 3000,
    loading: false,
    withCloseButton: true,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
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
        setUpdateDataLoaded(true);
      }
    }, [updateEditor, updateContent]);

    const handleUpdate = async () => {
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
        await updateDoc(
          doc(firestore, "users", user.email, "trips", tripData.tripId),
          { updates: newUpdates }
        );
        await router.replace(router.asPath);
        notifications.update(updatePosted);
        setUpdateTitle("");
        setUpdateDataLoaded(false);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <>
        <Input
          tabIndex={1}
          size={"xl"}
          w="100%"
          placeholder="Update Title..."
          maw={800}
          value={updateTitle}
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
            editor={updateEditor}
            position="relative"
            bg={dark ? "dark.6" : "gray.2"}
            onChange={() => {
              const content = updateEditor.getHTML();
              setUpdateContent(content);
            }}
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

  // TODO: DUFFEL FUNCS
  const successfulPayment = () => {
    // Show 'successful payment' page and confirm Duffel PaymentIntent
  };

  const errorPayment = (error) => {
    // Show error page
  };

  const donationReq = () => {
    fetch("/api/payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DUFFEL_AC}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Duffel-Version": "v1",
        "Accept-Encoding": "gzip",
      },
      body: donationAmount,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const token = data.client_token;
        setPaymentToken(token);
        setDonationAmount(0);
        setPaid(true);
      })
      .catch((error) => {
        console.error("Failed to create payment intent:", error);
      });
  };

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
            backgroundColor: dark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
          },
          overlay: {
            backgroundColor: dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
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
              setModalMode={setModalMode}
              weekAhead={weekAhead}
            />
          </Stack>
        </Box>
      </Modal>
      <Modal
        pos={"relative"}
        withCloseButton={false}
        size={modalMode === "donating" ? 540 : 850}
        padding={"xl"}
        centered
        opened={
          modalMode === "postUpdate" ||
          modalMode === "editUpdate" ||
          modalMode === "donating"
        }
        onClose={closeAltModal}
        styles={(theme) => ({
          header: {
            backgroundColor: "transparent",
          },
          content: {
            backgroundColor: dark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
          },
          overlay: {
            backgroundColor: dark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(9px)",
          },
        })}
      >
        <LoadingOverlay
          visible={modalMode === "editUpdate" && !updateDataLoaded}
          overlayOpacity={1}
        />
        {/* Close Modal */}
        <CloseButton
          pos={"absolute"}
          top={21}
          right={21}
          size={25}
          onClick={closeAltModal}
        />
        {modalMode === "donating" && (
          <Box w={modalMode === "donating" ? 490 : 800}>
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
                  {/* TODO: Duffel */}
                  <NumberInput
                    icon={<IconCurrencyDollar size={35} />}
                    size="xl"
                    mb={10}
                    hideControls
                    precision={2}
                    variant="filled"
                    defaultValue={0}
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e)}
                    parser={(value) => value.replace(/[\$\s,]/g, "")}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value))
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : 0
                    }
                    onClick={(e) => {
                      if (
                        e.target.value === 0 ||
                        e.target.value === "0" ||
                        e.target.value === "0.00"
                      ) {
                        e.target.select();
                      }
                    }}
                    sx={{
                      ".mantine-NumberInput-input": {
                        textAlign: "right",
                        fontWeight: 700,
                      },
                    }}
                  />
                  <DuffelPayments
                    // paymentIntentClientToken={paymentToken}
                    paymentIntentClientToken="eyJjbGllbnRfc2VjcmV0IjoicGlfM0psczlVQWcySmhFeTh2WTBSTm1MU0JkX3NlY3JldF9QUW9yZXNuU3laeWJadGRiejZwNzBCbUdPIiwicHVibGlzaGFibGVfa2V5IjoicGtfdGVzdF9EQUJLY0E2Vzh6OTc0cTdPSWY0YmJ2MVQwMEpwRmMyOUpWIn0="
                    onSuccessfulPayment={console.log}
                    onFailedPayment={console.log}
                    debug={true}
                    styles={{
                      buttonCornerRadius: "3px",
                      fontFamily: "inherit",
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
                  <Button
                    variant="filled"
                    size="xl"
                    w={"100%"}
                    onClick={donationReq}
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
              <UpdateForm />
            </Stack>
          </>
        )}
      </Modal>
    </Box>
  );
}
