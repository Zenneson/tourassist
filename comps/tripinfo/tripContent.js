import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import {
  useMantineColorScheme,
  BackgroundImage,
  Box,
  Button,
  Center,
  Divider,
  Title,
  Text,
  Group,
  Overlay,
  ScrollArea,
  LoadingOverlay,
  Slider as MantineSlider,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEditor } from "@tiptap/react";
import imageCompression from "browser-image-compression";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
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
import { parseDate } from "../../libs/custom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TripContent(props) {
  const {
    images,
    setImages,
    setAltModal,
    modalMode,
    setModalMode,
    user,
    weekAhead,
  } = props;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [imageUpload, setImageUpload] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [scale, setScale] = useState(1);
  const [processingImage, setProcessingImage] = useState(false);
  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: [],
  });
  const [tripDesc, setTripDesc] = useSessionStorage({
    key: "tripDesc",
    defaultValue: "",
  });
  const [travelDate, setTravelDate] = useSessionStorage({
    key: "travelDate",
    defaultValue: weekAhead,
  });

  const storage = getStorage();
  const router = useRouter();

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

  let content;
  if (router.pathname === "/tripplanner") {
    content = tripDesc !== "" ? tripDesc.toString() : "";
  } else if (
    router.pathname !== "/tripplanner" &&
    tripData &&
    tripData.tripDesc
  ) {
    content = tripData.tripDesc;
  }

  const editor = useEditor({
    editable: true,
    extensions: [
      Link,
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder:
          "Add a detailed description to your trip here, to inspire support...",
      }),
    ],
    parseOptions: {
      preserveWhitespace: "full",
    },
    content: content,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(
        tripDesc.toString() || tripData.tripDesc?.toString()
      );
    }
  }, [editor, tripDesc, tripData]);

  const handleScroll = (event) => {
    let newScale = scale - event.deltaY * 0.005;
    newScale = Math.min(Math.max(newScale, 1), 5);
    setScale(newScale);
  };

  function removeImage(activeSlide) {
    if (images.length === 1) {
      setImages([]);
      return;
    }
    setImages(images.filter((_, imgIndex) => imgIndex !== activeSlide));
  }

  // TODO - add setState vars to hold images for different upload types
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
          if (sliderRef.current) {
            sliderRef.current.slickGoTo(images.length); // go to the last slide
          }
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

  const updateEditedTrip = async () => {
    try {
      const imageUploadPromises = images.map(async (imageDataUrl, index) => {
        const storageRef = ref(
          storage,
          `images/${user.email}/${tripData.tripId}/trip_img_${index}.png`
        );
        const snapshot = await uploadString(
          storageRef,
          imageDataUrl,
          "data_url",
          {
            contentType: "image/png",
          }
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      });

      const imageURLs = await Promise.all(imageUploadPromises);

      const tripRef = doc(
        firestore,
        "users",
        user.email,
        "trips",
        tripData.tripId
      );
      updateDoc(tripRef, {
        images: imageURLs,
        travelDate: parseDate(travelDate),
        tripDesc: tripDesc,
      });
      setModalMode("");
      setAltModal(false);
      setTripDesc(editor.getHTML());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {modalMode === "editTrip" && (
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
                  width: "100%",
                  height: "100%",
                }}
              >
                {slides}
              </Slider>
              <Group mt={17} spacing={15} h={40} grow>
                {images.length > 1 && (
                  // Previous Slide
                  <Button variant="subtle" color="gray" onClick={previous}>
                    <IconChevronLeft size={20} />
                  </Button>
                )}
                {/* Remove Image */}
                <Button
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
                  <Button variant="subtle" color="gray" onClick={next}>
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
                  color={dark ? "dark.4" : "gray.6"}
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
              mt={23}
              py={12}
              fz={12}
              ta={"center"}
              bg={dark ? "dark.6" : "gray.1"}
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
      <ScrollArea
        h={300}
        scrollbarSize={8}
        scrollHideDelay={250}
        sx={{
          overflow: "hidden",
          borderRadius: "3px",
        }}
      >
        <RichTextEditor
          editor={editor}
          position="relative"
          bg={dark ? "dark.6" : "gray.2"}
          onBlur={() => {
            if (router.pathname === "/tripplanner")
              setTripDesc(editor.getHTML());
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
              minHeight: "200px",
              "& .ProseMirror": {
                paddingLeft: "21px",
                paddingRight: "21px",
              },
            },
          }}
        >
          {editor && (
            <>
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
            </>
          )}
          <RichTextEditor.Content
            sx={{
              "& p": {
                fontSize: ".9rem",
              },
            }}
          />
        </RichTextEditor>
      </ScrollArea>
      {router.pathname !== "/tripplanner" && (
        <Group position="right" mt={5} w={"100%"}>
          <Button
            variant="default"
            size="md"
            w={"25%"}
            onClick={modalMode === "editTrip" ? updateEditedTrip : null}
          >
            SUBMIT EDIT
          </Button>
        </Group>
      )}
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
              color={dark ? [0, 0, 0, 0.7] : [255, 255, 255, 0.7]} // RGBA
              image={imageUpload}
              borderRadius={3}
              scale={scale}
              onWheel={handleScroll}
              onLoadSuccess={() => setLoading(false)}
              style={{
                borderTop: dark
                  ? "2px solid rgba(255,255,255,0.1)"
                  : "2px solid rgba(0,0,0,0.1)",
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
          <Overlay color={dark ? "dark.7" : "gray.0"} opacity={0.3} blur={7} />
          <LoadingOverlay
            overlayColor={dark ? "dark.7" : "gray.0"}
            visible={processingImage}
            overlayBlur={0}
            overlayOpacity={0}
          />
        </>
      )}
    </>
  );
}
