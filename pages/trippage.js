import { useState } from "react";
import { useRouter } from "next/router";
import {
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
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
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
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import Donations from "../comps/tripinfo/donations";
import Update from "../comps/tripinfo/update";
import TripContent from "../comps/tripinfo/tripContent";
import MainCarousel from "../comps/tripinfo/maincarousel";
import TripDescription from "../comps/tripinfo/tripdescription";

export default function Trippage(props) {
  const [altModal, setAltModal] = useState(false);
  const [editContentModal, setEditContentModal] = useState(false);
  const [editUpdate, setEditUpdate] = useState("");
  const [addTripDesc, setAddTripDesc] = useState(false);
  const [addUpdateDesc, setAddUpdateDesc] = useState(false);
  const [donating, setDonating] = useState(false);
  const router = useRouter();

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const [images, setImages] = useState([]);

  const commentData = [
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Just donated! Can't wait to see the team swimming with the Loch Ness Monster in Scotland! #LegendaryAdventure",
    },
    {
      name: "Jill Jailbreaker",
      time: "10 mintues ago",
      text: "Proud to support this amazing journey! Meeting the aliens at Area 51 sounds like a once-in-a-lifetime experience!",
    },
    {
      name: "Bill Horsefighter",
      time: "10 mintues ago",
      text: "Just backed this epic trip! Excited to watch you guys discover the lost city of Atlantis. Good luck!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Happy to contribute! Dinosaur-watching in Jurassic Park seems like a childhood dream come true! Have fun!",
    },
    {
      name: "Henry Silkeater",
      time: "10 mintues ago",
      text: "Donated! Can't wait to see the vlogs from this epic time-traveling trip. Say hi to the cavemen for me!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Supported! Have a blast exploring the underwater city of Rapture. Beware of the Big Daddies though! 😉",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Just gave my support! Enjoy your teleportation adventure to Mars. Can't wait for the Martian selfies!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Contributed to the cause! Have fun at the North Pole Santa's Workshop tour! Bring back some elf souvenirs!",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Proud to back this project! Can't wait to see the team climbing Mount Everest in just one day! 🏔️",
    },
    {
      name: "Anonymus",
      time: "10 mintues ago",
      text: "Donated! Good luck discovering the Fountain of Youth, you guys! Don't forget to share the secret! 😉",
    },
  ];

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

  const showEditContentModal = () => {
    setAltModal(true);
    setAddTripDesc(true);
    setDonating(false);
  };

  const showUpdateModal = () => {
    setEditContentModal(true);
    setDonating(false);
  };

  const showDonateModal = () => {
    setDonating(true);
    setEditContentModal(true);
  };

  const closeEditContentModal = () => {
    setEditContentModal(false);
    setAddTripDesc(false);
    setEditUpdate("");
  };

  const closeAltModal = () => {
    setAltModal(false);
    setAddTripDesc(false);
    setAddUpdateDesc(false);
  };

  const ModalsFunc = () => {
    return (
      <>
        <Modal
          withCloseButton={false}
          size={850}
          padding={"xl"}
          opened={altModal}
          centered
          onClose={closeAltModal}
          styles={(theme) => ({
            header: {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
            content: {
              backgroundColor: "rgba(0,0,0,0.9)",
            },
          })}
        >
          {/* Close Alt Modal */}
          <CloseButton
            pos={"absolute"}
            top={21}
            right={21}
            size={25}
            onClick={closeAltModal}
          />
          <Stack align="center">
            <Title order={4} w={"100%"} ta={"left"} fs={"italic"}>
              EDIT TRIP DETAILS:
            </Title>
            <Box
              w={"100%"}
              pl={15}
              pt={5}
              pb={10}
              ml={-3}
              sx={{
                borderLeft: "3px solid rgba(255,255,255,0.05)",
              }}
            >
              <Text
                color="blue.2"
                fw={400}
                mb={7}
                fs={"italic"}
                w={"100%"}
                ta={"left"}
              >
                Help me raise money to go on a Music Tour
              </Text>
              <Flex w={"100%"} justify={"flex-start"} align={"center"} gap={10}>
                <Text w={185} fz={12} fs={"italic"} fw={700}>
                  Change Travel Date:
                </Text>
                <DateInput
                  variant="filled"
                  defaultValue={new Date()}
                  size="sm"
                />
                <Divider w={"100%"} size={"sm"} />
              </Flex>
            </Box>
            <TripContent
              addTripDesc={addTripDesc}
              addUpdateDesc={addUpdateDesc}
              donating={donating}
              images={images}
              setImages={setImages}
            />
          </Stack>
        </Modal>
        <Modal
          pos={"relative"}
          withCloseButton={false}
          size={850}
          padding={"xl"}
          centered
          opened={editContentModal}
          onClose={closeEditContentModal}
          styles={(theme) => ({
            header: {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
            content: {
              backgroundColor: "rgba(0,0,0,0.9)",
            },
          })}
        >
          {/* Close Edit Content Modal */}
          <CloseButton
            pos={"absolute"}
            top={21}
            right={21}
            size={25}
            onClick={closeEditContentModal}
          />
          {donating && (
            <>
              <Title mb={5} color="#00E8FC">
                <Flex align={"center"} gap={5}>
                  DONATE
                  <IconHeartHandshake size={35} />
                </Flex>
              </Title>
              <Divider w={"100%"} size={"xl"} opacity={0.4} mb={15} />
              <Group mb={15} grow>
                <Stack>
                  <Button.Group>
                    <Button variant="default" size="xl" w={"25%"}>
                      <IconCreditCard size={30} />
                    </Button>
                    <Button variant="default" size="xl" w={"25%"}>
                      <IconBrandApple size={30} />
                    </Button>
                    <Button variant="default" size="xl" w={"25%"}>
                      <IconBrandGoogle size={30} />
                    </Button>
                    <Button variant="default" size="xl" w={"25%"}>
                      <IconBrandPaypal size={30} />
                    </Button>
                  </Button.Group>
                  <Divider />
                  <TextInput
                    placeholder="E-mail Address"
                    icon={<IconAt size={20} opacity={0.4} />}
                  />
                  <TextInput
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
                    <Select placeholder="Country" data={[]} w={"60%"} />
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
                    onClick={() => router.push("/thankyou")}
                  >
                    DONATE NOW
                  </Button>
                </Stack>
              </Group>
            </>
          )}
          <Title order={4} w={"100%"} ta={"left"} mb={15} fs={"italic"}>
            {editUpdate ? "EDIT UPDATE:" : !donating ? "POST UPDATE:" : ""}
          </Title>
          <Stack align="center">
            {!donating && (
              <Input
                size={"xl"}
                variant="filled"
                value={editUpdate && "Update number 3 of the trip"}
                w="100%"
                placeholder="Update Title..."
                maw={800}
                bg={"rgba(0,0,0,0)"}
                onChange={(e) => e.preventDefault()}
                sx={{
                  ".mantine-Input-input": {
                    borderTop: "2px solid rgba(255,255,255,0.2)",
                    background: "#0b0c0d",
                    "&::placeholder": {
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.0.08)",
                    },
                  },
                }}
              />
            )}
            {!donating && (
              <TripContent
                addTripDesc={addTripDesc}
                addUpdateDesc={addUpdateDesc}
                donating={donating}
                images={images}
                setImages={setImages}
              />
            )}
          </Stack>
        </Modal>
      </>
    );
  };

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
            <MainCarousel />
            <Divider
              w={"80%"}
              color="dark.4"
              size={"md"}
              mt={50}
              label={
                <Title order={3} px={5} maw={"800px"} color="gray.6" fw={700}>
                  Help me raise money to go on a Music Tour
                </Title>
              }
            />
            <Center mt={20}>
              <Button.Group>
                <Button variant="default" px={44}>
                  <IconBrandFacebook size={20} />
                </Button>
                <Button variant="default" px={44}>
                  <IconBrandInstagram size={20} />
                </Button>
                <Button variant="default" px={44}>
                  <IconBrandTiktok size={20} />
                </Button>
                <Button variant="default" px={44}>
                  <IconBrandTwitter size={20} />
                </Button>
                <Button variant="default" px={44}>
                  <IconBrandWhatsapp size={20} />
                </Button>
                <Button variant="default" px={44}>
                  <IconSourceCode size={20} />
                </Button>
              </Button.Group>
            </Center>
            <Box
              bg={"rgba(0,0,0,0.05)"}
              w={"85%"}
              mt={20}
              mb={30}
              py={20}
              px={30}
              fz={14}
              sx={{
                border: "1px solid rgba(0,0,0,0.15)",
                borderTop: "3px solid rgba(255,255,255,0.1)",
                boxShadow: "0 2px 5px 0 rgba(0,0,0,0.3)",
              }}
            >
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
                    onClick={showEditContentModal}
                  >
                    Edit Travel Details
                  </Button>
                }
              />
              <TripDescription />
            </Box>
            <Update
              setEditContentModal={setEditContentModal}
              setEditUpdate={setEditUpdate}
              setAddUpdateDesc={setAddUpdateDesc}
              setDonating={setDonating}
              images={images}
              setImages={setImages}
            />
            <Box
              bg={"rgba(0,0,0,0.05)"}
              w={"90%"}
              mt={25}
              mb={50}
              p={"20px 30px"}
              sx={{
                border: "1px solid rgba(0,0,0,0.15)",
                borderTop: "3px solid rgba(255,255,255,0.1)",
                boxShadow: "0 2px 5px 0 rgba(0,0,0,0.3)",
              }}
            >
              <Divider
                size={"xl"}
                w={"100%"}
                label={
                  <Flex align={"center"}>
                    <IconQuote size={40} opacity={0.2} />
                    <Title order={4}>WORDS OF SUPPORT</Title>
                  </Flex>
                }
              />
              <Box pl={10}>
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
                />{" "}
                {comments}
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
              bg={"rgba(0,0,0,0.05)"}
              w={"100%"}
              pt={15}
              pb={25}
              px={20}
              mb={20}
              sx={{
                border: "1px solid rgba(0,0,0,0.15)",
                borderTop: "3px solid rgba(255,255,255,0.1)",
                boxShadow: "0 2px 5px 0 rgba(0,0,0,0.3)",
              }}
            >
              <Group spacing={0} w={"100%"}>
                <Box w={"70%"} pl={20}>
                  <Text ta={"left"} fz={10} mb={-3}>
                    GOAL
                  </Text>
                  <Title order={2} ta={"left"} color="green.7">
                    $500
                    <Text ml={7} span inherit color="gray.7">
                      <Text fw={400} span inherit>
                        /
                      </Text>{" "}
                      $1,000
                    </Text>
                  </Title>
                </Box>
                <Box
                  w={"30%"}
                  sx={{
                    borderLeft: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Text ta={"center"} fz={10} mb={-7}>
                    DAYS LEFT
                  </Text>
                  <Title order={2} ta={"center"} color="gray.7">
                    15
                  </Title>
                </Box>
              </Group>
              <Progress
                value={50}
                color="green.7"
                striped
                animate
                bg={"gray.6"}
                size={"xl"}
                radius={"xl"}
                mt={5}
              />
              <Button.Group mt={10} w={"100%"}>
                {/* Go to Purchase Page  */}
                <Button
                  w={"100%"}
                  variant="filled"
                  color="green.9"
                  onClick={() => {
                    router.push("/purchase");
                  }}
                >
                  <Text>USE FUNDS</Text>
                </Button>
                {/* // Show Update Modal */}
                <Button
                  variant="filled"
                  color="blue"
                  fullWidth
                  onClick={showUpdateModal}
                >
                  POST UPDATE
                </Button>
              </Button.Group>
              {/* Show Donate Modal Button The Goal Section */}
              <Button
                mt={10}
                fullWidth
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
            </Box>
            <Box>
              <Donations dHeight={"calc(100vh - 410px)"} />
            </Box>
          </Flex>
        </Flex>
      </Center>
      <ModalsFunc />
    </>
  );
}
