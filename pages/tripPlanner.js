import { useState } from "react";
import { motion } from "framer-motion";
import {
  ActionIcon,
  Space,
  Stepper,
  Title,
  Center,
  Box,
  Text,
  NumberInput,
  Group,
  Divider,
  Stack,
  Button,
  Input,
  Popover,
  Flex,
  Badge,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForceUpdate, useWindowEvent } from "@mantine/hooks";
import { placeDataState } from "../libs/atoms";
import {
  IconCurrencyDollar,
  IconPlus,
  IconCirclePlus,
  IconUpload,
  IconX,
  IconPhoto,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
} from "@tabler/icons";
import { useRecoilState } from "recoil";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor, FloatingMenu, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { Carousel } from "@mantine/carousel";

export default function TripPlannerPage() {
  const [active, setActive] = useState(0);
  const [placeData, setPlaceData] = useRecoilState(placeDataState);
  const forceUpdate = useForceUpdate();

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
      <Group position="right">
        <Text size={12} fs="italic" color="dimmed" mt={-25}>
          {cost.cost || "NEW COST"}
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
    if (event.key === "Enter") {
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
          sx={{
            borderRadius: 3,
            background: "rgba(0,0,0,0.05)",
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
                <Costs key={index} cost={cost} />
              ))}
            {newCost[index] &&
              newCost[index].map((cost) => (
                <Costs key={Math.floor(Math.random() * 10000000)} cost={cost} />
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
                  size="xs"
                  variant="unstyled"
                  pl={10}
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

  return (
    <>
      <Space h={150} />
      <Center>
        <Flex
          w="100%"
          maw={1200}
          justify="flex-start"
          align="flex-start"
          gap={10}
        >
          <Box w="80%" miw={500}>
            {active === 0 && (
              <motion.div {...animation}>
                <Places />
                <Group position="right">
                  <Title order={1} fw={600}>
                    Trip Cost Total
                  </Title>
                  <NumberInput
                    icon={<IconCurrencyDollar />}
                    size="xl"
                    w={200}
                    mb={20}
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
                </Group>
              </motion.div>
            )}
            {active === 1 && (
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
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        },
                        ".mantine-Input-input": {
                          padding: "30px 5px",
                          "&::placeholder": {
                            textAlign: "center",
                            fontStyle: "italic",
                            color: "rgba(255,255,255,0.05)",
                          },
                        },
                      }}
                    />
                    <Flex
                      direction="column"
                      gap={10}
                      mt={20}
                      w="100%"
                      maw={800}
                      miw={600}
                    >
                      <Group grow spacing={10}>
                        <Input
                          icon={<IconBrandFacebook size={20} />}
                          placeholder="/Facebook"
                          variant="filled"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />
                        <Input
                          icon={<IconBrandInstagram size={20} />}
                          placeholder="@Instagram"
                          variant="filled"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />

                        <Input
                          icon={<IconBrandTiktok size={20} />}
                          placeholder="@TikTok"
                          variant="filled"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />
                        <Input
                          icon={<IconBrandTwitter size={20} />}
                          placeholder="@Twitter"
                          variant="filled"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />
                      </Group>
                    </Flex>
                    <Group
                      maw={800}
                      spacing={35}
                      w="100%"
                      position="apart"
                      grow
                    >
                      <Carousel
                        sx={{
                          border: "2px solid rgba(255,255,255,0.07)",
                          borderRadius: 3,
                          padding: "0 10px",
                        }}
                        withIndicators
                        height={252}
                        slideSize="100%"
                      >
                        <Carousel.Slide></Carousel.Slide>
                        <Carousel.Slide></Carousel.Slide>
                      </Carousel>
                      <Dropzone
                        onDrop={(files) => console.log("accepted files", files)}
                        onReject={(files) =>
                          console.log("rejected files", files)
                        }
                        accept={IMAGE_MIME_TYPE}
                        my={20}
                        ta="center"
                      >
                        <Group
                          position="center"
                          spacing="xl"
                          style={{ minHeight: 220, pointerEvents: "none" }}
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
                              Drag images here or click to select files
                            </Text>
                            <Text size="sm" color="dimmed" inline mt={7}>
                              Attach as many files as you like, each file should
                              not exceed 5mb
                            </Text>
                          </div>
                        </Group>
                      </Dropzone>
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
                <Title order={6} fw={600}>
                  Banking Info
                </Title>
              </motion.div>
            )}
          </Box>
          <Stepper
            active={active}
            onStepClick={setActive}
            iconPosition="right"
            orientation="vertical"
            miw={205}
            mt={50}
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
        </Flex>
      </Center>
    </>
  );
}
