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
  // images,
  setImages,
}) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [imageUpload, setImageUpload] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [scale, setScale] = useState(1);
  const [processingImage, setProcessingImage] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);

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

  const images = [
    "img/intro/coast.jpg",
    "img/intro/bluehair.jpg",
    "img/intro/street.jpg",
    "img/intro/concert.jpg",
    "img/intro/planewindow.jpg",
    "img/intro/happyguy.jpg",
    "img/intro/boat.jpg",
    "img/intro/plane.jpg",
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

    const response = await fetch(dataUrl);
    const blob = await response.blob(); // convert dataUrl to Blob

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 650,
    };

    try {
      const compressedFile = await imageCompression(blob, options); // compress image

      const reader = new FileReader();
      reader.onloadend = () => {
        const compressedDataUrl = reader.result; // convert Blob to dataUrl

        setImages((prevImages) => {
          const newImages = [...prevImages, compressedDataUrl]; // create new images array
          return newImages; // return new images array to update state
        });

        // use setTimeout to ensure that the state has been updated before calling slickGoTo
        setTimeout(() => {
          sliderRef.current.slickGoTo(images.length); // go to the last slide
        }, 0);

        setProcessingImage(false);
        setImageUpload(null);
        setScale(1);
      };
      reader.onerror = (error) => console.error("Error: ", error);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error(error);
    }
  }

  const addImage = () => {
    cropperContainerRef.current.style.display = "none"; // hide the cropper
    setProcessingImage(true);
    // Start the image compression operation in a new event loop
    setTimeout(() => addCroppedImage(), 0);
  };

  const dontAddImage = () => {
    setImageUpload(null);
    setScale(1);
  };

  const focusEditor = () => {
    setShowToolbar(true);
    editor?.chain().focus().run();
  };

  const blurEditor = () => {
    setShowToolbar(false);
    setEditorFocused(false);
    setTripDesc(editor.getHTML());
  };

  return (
    <>
      {!donating && (
        <Group spacing={20} w="100%" grow>
          {images.length > 0 && (
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
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
                  // Previous Slide
                  <Button
                    variant="subtle"
                    color="gray"
                    h={"100%"}
                    onClick={previous}
                  >
                    <IconChevronLeft size={20} />
                  </Button>
                )}
                {/* Remove Image */}
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
                  // Next Slide
                  <Button
                    variant="subtle"
                    color="gray"
                    h={"100%"}
                    onClick={next}
                  >
                    <IconChevronRight size={20} />
                  </Button>
                )}
              </Group>
            </Box>
          )}
          <Box>
            <Dropzone
              onDrop={(files) => {
                setImageUpload(files[0]);
                setLoading(true);
                setShowCropper(true);
              }}
              onReject={(files) => console.log("rejected files", files)}
              accept={IMAGE_MIME_TYPE}
              ta="center"
              h={300}
              opacity={images.length === 6 ? 0.3 : 1}
              disabled={images.length === 6}
              style={{
                border: "2px dashed rgba(255,255,255,0.05)",
                backgroundColor: "#0c0c0c",
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
              bg={"#131314"}
              sx={{
                borderRadius: "3px",
              }}
            >
              {`${images.length} / 6 IMAGES UPLOADED`}
            </Title>
          </Box>
        </Group>
      )}
      {/* Text Editor */}
      <RichTextEditor
        editor={editor}
        position="relative"
        bg={editorFocused ? "#373A40" : "dark.5"}
        onClick={focusEditor}
        onFocus={() => {
          setEditorFocused(true);
        }}
        onBlur={blurEditor}
        sx={{
          transition: "border-top 0.2s ease",
          border: "none",
          overflow: "auto",
          width: "100%",
          minWidth: "500px",
          minHeight: donating ? "100px" : "200px",
          maxHeight: donating ? "100px" : "300px",
          borderTop: "2px solid rgba(255,255,255,0.2)",
          ".mantine-RichTextEditor-content": {
            background: "rgba(0, 0, 0, 0)",
            color: editorFocused && "#fff",
          },
          ".mantine-RichTextEditor-toolbar": {
            background: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(255,255,255,0.2)",
          },
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
      {showCropper && imageUpload && (
        <>
          <Box
            ref={cropperContainerRef}
            pos={"absolute"}
            top={40}
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
              border={50}
              color={[0, 0, 0, 0.7]} // RGBA
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
              {/* Selects NO Cropped Image to Image Slider  */}
              <Button
                size="xl"
                variant="default"
                opacity={0.3}
                onClick={dontAddImage}
              >
                <IconX stroke={5} size={35} />
              </Button>
              {/* Selects YES Cropped Image to Image Slider  */}
              <Button
                size="xl"
                variant="default"
                opacity={0.3}
                onClick={addImage}
              >
                <IconCheck stroke={5} size={35} />
              </Button>
            </Group>
          </Box>
          <Overlay opacity={0.3} blur={7} />
          <LoadingOverlay
            visible={processingImage}
            overlayBlur={0}
            overlayOpacity={0}
          />
        </>
      )}
    </>
  );
}
