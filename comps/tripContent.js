import { useState, useRef } from "react";
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
  Overlay,
  LoadingOverlay,
  Slider as MantineSlider,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEditor } from "@tiptap/react";
import imageCompression from "browser-image-compression";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconUpload,
  IconX,
  IconPhoto,
  IconCheck,
  IconFrame,
} from "@tabler/icons-react";
import AvatarEditor from "react-avatar-editor";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TripContent({
  addTripDesc,
  addUpdateDesc,
  donating,
  setTripDesc,
  images,
  setImages,
}) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [imageUpload, setImageUpload] = useState(null);
  const [scale, setScale] = useState(1);
  const [processingImage, setProcessingImage] = useState(false);

  const router = useRouter();

  const tripSummary = "Content for trip description";
  const updateDetails = "Update Content";

  const sliderRef = useRef();
  const cropperRef = useRef(null);
  const cropperContainerRef = useRef(null);

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
    autoplaySpeed: 4000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

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
      ? tripSummary
      : addUpdateDesc
      ? updateDetails
      : "",
  });

  const handleScroll = (event) => {
    let newScale = scale - event.deltaY * 0.005;
    newScale = Math.min(Math.max(newScale, 1), 5);
    setScale(newScale);
  };

  function removeImage(activeSlide) {
    setImages(images.filter((_, imgIndex) => imgIndex !== activeSlide));
  }

  async function addCroppedImage() {
    const canvas = cropperRef.current.getImage();
    const dataUrl = canvas.toDataURL();

    const blob = await (await fetch(dataUrl)).blob(); // convert dataUrl to Blob

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 650,
    };

    try {
      const compressedFile = await imageCompression(blob, options); // compress image
      const compressedDataUrl = URL.createObjectURL(compressedFile); // convert Blob to dataUrl

      setImages((prevImages) => [...prevImages, compressedDataUrl]); // add compressed image to the images array
      setProcessingImage(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {!donating && (
        <Group maw={800} spacing={20} w="100%" grow>
          {images.length > 0 && (
            <Box
              pos="relative"
              top={4}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <LoadingOverlay visible={processingImage} overlayBlur={3} />
              <Slider
                ref={sliderRef}
                afterChange={setActiveSlide}
                {...slideSettings}
                style={{
                  width: "390px",
                  height: "300px",
                }}
              >
                {slides}
              </Slider>
              <Group
                mt={images.length === 1 ? 18 : 25}
                spacing={15}
                h={40}
                grow
              >
                {images.length > 1 && (
                  <Button
                    variant="subtle"
                    color="gray"
                    h={"100%"}
                    onClick={() => {
                      previous();
                    }}
                  >
                    <IconChevronLeft size={20} />
                  </Button>
                )}
                <Button
                  h={"100%"}
                  variant="light"
                  color="red.9"
                  opacity={0.7}
                  onClick={() => removeImage(activeSlide)}
                  sx={{
                    transitions: "opacity 250ms ease",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <IconTrash size={21} />
                </Button>
                {images.length > 1 && (
                  <Button
                    variant="subtle"
                    color="gray"
                    h={"100%"}
                    onClick={() => {
                      next();
                    }}
                  >
                    <IconChevronRight size={20} />
                  </Button>
                )}
              </Group>
            </Box>
          )}
          <Box>
            <Dropzone
              mt={5}
              onDrop={(files) => {
                setImageUpload(files[0]);
                setLoading(true);
              }}
              onReject={(files) => console.log("rejected files", files)}
              accept={IMAGE_MIME_TYPE}
              ta="center"
              h={300}
              opacity={images.length === 6 ? 0.3 : 1}
              disabled={images.length === 6}
              style={{
                border: "2px dashed rgba(255,255,255,0.05)",
                backgroundColor: "rgba(255,255,255,0.01)",
                cursor: images.length === 6 ? "not-allowed" : "pointer",
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
              mt={25}
              py={12}
              fz={12}
              ta={"center"}
              bg={"dark.7"}
              color="gray"
              sx={{
                borderRadius: "3px",
              }}
            >
              {`${images.length} / 6 IMAGES UPLOADED`}
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
        onBlur={() => {
          setTripDesc(editor.getHTML());
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
      {imageUpload && (
        <>
          <Box
            ref={cropperContainerRef}
            pos={"absolute"}
            top={50}
            sx={{
              zIndex: 1000,
              opacity: loading ? 0 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <AvatarEditor
              ref={cropperRef}
              width={585}
              height={450}
              border={40}
              color={[0, 0, 0, 0.95]} // RGBA
              image={imageUpload}
              borderRadius={3}
              scale={scale}
              onWheel={handleScroll}
              onLoadSuccess={() => setLoading(false)}
              style={{
                borderTop: "2px solid rgba(255,255,255,0.1)",
              }}
            />
            <MantineSlider
              mt={20}
              min={1}
              max={5}
              step={0.05}
              thumbSize={20}
              thumbChildren={<IconFrame size={14} stroke={3} />}
              defaultValue={1}
              color="blue.3"
              label={null}
              showLabelOnHover={false}
              value={scale}
              onChange={setScale}
              sx={{
                zIndex: 1000,
                width: "100%",
                height: 5,
                "	.mantine-Slider-thumb": {
                  border: "none",
                },
              }}
            />
            <Group w={"100%"} mt={30} grow>
              <Button
                size="xl"
                variant="default"
                opacity={0.3}
                onClick={() => {
                  setImageUpload(null);
                  setScale(1);
                }}
              >
                <IconX stroke={5} size={35} />
              </Button>
              <Button
                size="xl"
                variant="default"
                opacity={0.3}
                onClick={() => {
                  cropperContainerRef.current.style.opacity = 0;
                  setProcessingImage(true);
                  addCroppedImage();
                  setImageUpload(null);
                  setScale(1);
                }}
              >
                <IconCheck stroke={5} size={35} />
              </Button>
            </Group>
          </Box>
          <Overlay opacity={0.3} blur={7} />
        </>
      )}
    </>
  );
}
