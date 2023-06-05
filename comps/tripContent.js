import { useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import {
  BackgroundImage,
  Box,
  Button,
  Center,
  Divider,
  Title,
  Text,
  Group,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  donateState,
  editUpdateState,
  addTripDecriptionState,
  addUpdateDecriptionState,
} from "../libs/atoms";
import {
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconUpload,
  IconX,
  IconPhoto,
} from "@tabler/icons";

export default function TripContent() {
  const [showToolbar, setShowToolbar] = useState(false);
  const [donating, setDonating] = useRecoilState(donateState);
  const [addTripDesc, setAddTripDesc] = useRecoilState(addTripDecriptionState);
  const [addUpdateDesc, setAddUpdateDesc] = useRecoilState(
    addUpdateDecriptionState
  );
  const router = useRouter();

  const tripDesc = "Content for trip description";
  const updateDetails = "Update Content";

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
    swipeToSlide: true,
    speed: 250,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    "img/women.jpg",
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
  ];

  const slides = images.map((image, index) => (
    <BackgroundImage
      radius={3}
      key={index}
      src={image}
      h={300}
      alt={`Image number ${index + 1}`}
    />
  ));

  const editor = useEditor({
    extensions: [
      Link,
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder:
          router.pathname === "/tripplanner"
            ? "Add a detailed description to your trip here, to inspire support..."
            : donating
            ? "Add a comment here..."
            : "Update us here...",
      }),
    ],
    content: donating
      ? ""
      : addTripDesc
      ? tripDesc
      : addUpdateDesc
      ? updateDetails
      : "",
  });

  return (
    <>
      {!donating && (
        <Group maw={800} spacing={20} w="100%" grow>
          {images.length > 0 && (
            <Box>
              <Slider
                ref={sliderRef}
                {...slideSettings}
                style={{
                  width: "390px",
                  height: "300px",
                }}
              >
                {slides}
              </Slider>
              <Group mt={15} spacing={15} grow>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    previous();
                  }}
                >
                  <IconChevronLeft size={20} />
                </Button>
                <Button color="red">
                  <IconTrash size={17} />
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    next();
                  }}
                >
                  <IconChevronRight size={20} />
                </Button>
              </Group>
            </Box>
          )}
          <Box>
            <Dropzone
              onDrop={(files) => console.log("accepted files", files)}
              onReject={(files) => console.log("rejected files", files)}
              accept={IMAGE_MIME_TYPE}
              ta="center"
              h={300}
              style={{
                border: "2px dashed rgba(255,255,255,0.05)",
                backgroundColor: "rgba(255,255,255,0.01)",
              }}
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
                  <IconUpload size={50} opacity={0.3} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} opacity={0.3} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} opacity={0.3} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" fw={700} inline>
                    DRAG IMAGES HERE
                  </Text>
                </div>
              </Group>
              <Center>
                <Divider
                  label="OR"
                  labelPosition="center"
                  my={5}
                  w={"60%"}
                  opacity={0.7}
                />
              </Center>
              <Button
                variant="light"
                color="gray"
                radius={"xl"}
                px={70}
                mt={7}
                fz={14}
                size="lg"
                compact
              >
                Select Files
              </Button>
            </Dropzone>
            <Title
              mt={15}
              order={6}
              py={9}
              ta={"center"}
              opacity={0.6}
              bg={"dark.5"}
              sx={{
                borderRadius: "3px",
              }}
            >
              {`${images.length} / 6 SPACES USED`}
            </Title>
          </Box>
        </Group>
      )}
      <RichTextEditor
        editor={editor}
        position="relative"
        bg={"dark.7"}
        onClick={() => {
          setShowToolbar(true);
          editor?.chain().focus().run();
        }}
        sx={{
          border: "none",
          overflow: "auto",
          width: "100%",
          minWidth: "500px",
          maxWidth: "800px",
          minHeight: donating ? "100px" : "200px",
          maxHeight: donating ? "100px" : "300px",
          borderTop: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        {editor && showToolbar && (
          <>
            <RichTextEditor.Toolbar>
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
              fontSize: "1rem",
              textAlign: "justify",
            },
          }}
        />
      </RichTextEditor>
    </>
  );
}
