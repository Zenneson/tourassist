import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  useMantineColorScheme,
  BackgroundImage,
  Box,
  Button,
  Center,
  Flex,
  FileButton,
  Text,
  Group,
  Overlay,
  Stack,
  ScrollArea,
  LoadingOverlay,
  Slider as MantineSlider,
  Title,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useSessionStorage, useWindowEvent } from "@mantine/hooks";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import imageCompression from "browser-image-compression";
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
import { notifications } from "@mantine/notifications";
import { updateEditedTrip, removeImageByName } from "../../libs/custom";
import AvatarEditor from "react-avatar-editor";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TripContent(props) {
  let { images, setImages, modalMode, setModalMode, user, titleRef } = props;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [loading, setLoading] = useState(true);
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
    defaultValue: tripData.tripDesc,
  });
  const [travelDate, setTravelDate] = useSessionStorage({
    key: "travelDate",
    defaultValue: tripData.travelDate,
  });
  const [updatedDesc, setUpdatedDesc] = useSessionStorage({
    key: "updatedDesc",
    defaultValue: "",
  });

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
      src={image.file}
      h={300}
      alt={image.name}
    />
  ));

  const updatingTrip = {
    id: "updatingTrip",
    title: "Updating Trip Details...",
    message: "Please wait while we update your trip details.",
    color: "green",
    loading: true,
    withCloseButton: false,
    autoClose: false,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const tripUpdated = {
    id: "updatingTrip",
    title: "Trip Details Updated",
    loading: false,
    withCloseButton: true,
    color: "green",
    autoClose: 3000,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  let content;
  if (router.pathname === "/tripplanner") {
    content = tripDesc !== "" ? tripDesc?.toString() : "";
  } else if (router.query.hasOwnProperty("title")) {
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

  useWindowEvent("keydown", (e) => {
    if (e.key === "Tab" && document.activeElement === titleRef.current) {
      e.preventDefault();
      if (titleRef.current) {
        editor.commands.focus();
      }
    }
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(
        updatedDesc.toString() ||
          tripDesc?.toString() ||
          tripData.tripDesc?.toString()
      );
    }
  }, [editor, tripDesc, tripData, updatedDesc]);

  const handleScroll = (event) => {
    let newScale = scale - event.deltaY * 0.005;
    newScale = Math.min(Math.max(newScale, 1), 5);
    setScale(newScale);
  };

  const checkName = (name) => {
    let counter = 0;
    const baseName = name.substring(0, name.length - 4);
    const nameExists = (imageName) => {
      return images.some((img) => img.name === imageName);
    };
    while (nameExists(name)) {
      counter++;
      name = `${baseName}_${counter}.png`;
    }
    return name;
  };

  async function addCroppedImage() {
    const canvas = cropperRef.current.getImage();
    const dataUrl = canvas.toDataURL();

    const response = await fetch(dataUrl);
    const blob = await response.blob(); // convert dataUrl to Blob

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 650,
    };

    try {
      const compressedFile = await imageCompression(blob, options); // compress image

      const reader = new FileReader();
      reader.onloadend = () => {
        const compressedDataUrl = reader.result; // convert Blob to dataUrl

        const uniqueName = checkName(imageUpload.name);
        const imgObj = {
          name: uniqueName,
          file: compressedDataUrl,
        };
        setImages((prevImages) => {
          const newImages = [...prevImages, imgObj]; // create new images array
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

  const imageItems = images.map((image, index) => {
    return (
      <Flex
        key={index}
        align={"center"}
        gap={10}
        p={10}
        sx={{
          borderRadius: 3,
          cursor: "pointer",
          ":hover": {
            backgroundColor: dark
              ? "rgba(255, 255, 255, 0.01)"
              : "rgba(0, 0, 0, 0.03)",
          },
        }}
      >
        <Title
          order={6}
          w={25}
          ta={"center"}
          sx={{
            borderRadius: 5,
            borderRight: `1px solid ${
              dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
            }`,
          }}
        >
          {index + 1}
        </Title>
        <Text fz={12} w={"100%"} truncate>
          {image.name}
        </Text>
        <ActionIcon
          size={"sm"}
          maw={"10%"}
          variant="subtle"
          color="red.9"
          opacity={0.3}
          sx={{
            ":hover": {
              opacity: 1,
            },
          }}
          onClick={() => {
            setImages(
              removeImageByName(
                images,
                image.name,
                router.query,
                tripData.tripId,
                user
              )
            );
          }}
        >
          <IconTrash size={17} />
        </ActionIcon>
      </Flex>
    );
  });

  const grabImage = (file, type) => {
    const imgObj = {
      name: type === "dropzone" ? file[0].name : file.name,
      file: type === "dropzone" ? file[0] : file,
    };
    setImageUpload(imgObj);
    setLoading(true);
    setShowCropper(true);
  };

  const updateTripData = async () => {
    const newDesc = updatedDesc || editor.getHTML();
    notifications.show(updatingTrip);
    try {
      const imageObjects = await updateEditedTrip(
        user.email,
        tripData.tripId,
        images,
        newDesc,
        travelDate
      );

      setTripDesc(newDesc);
      setImages(imageObjects);
      await router.replace("/" + tripData.tripId);

      notifications.update(tripUpdated);
      setModalMode("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {(modalMode === "editTrip" || router.pathname === "/tripplanner") && (
        <>
          <Group spacing={20} w="100%" grow>
            <Box>
              {images.length > 0 ? (
                <>
                  <Box
                    h={300}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Slider
                      ref={sliderRef}
                      {...slideSettings}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {slides}
                    </Slider>
                  </Box>
                  {images.length > 1 && (
                    <Group spacing={15} h={40} mt={10} grow>
                      <Button variant="subtle" color="gray" onClick={previous}>
                        <IconChevronLeft size={20} />
                      </Button>
                      <Button variant="subtle" color="gray" onClick={next}>
                        <IconChevronRight size={20} />
                      </Button>
                    </Group>
                  )}
                </>
              ) : (
                <BackgroundImage
                  radius={3}
                  opacity={dark ? 0.1 : 0.4}
                  src={
                    dark
                      ? "img/placeholder/bags_blk.jpg"
                      : "img/placeholder/bags_wht.jpg"
                  }
                  h={300}
                  alt={"Placeholder Image"}
                />
              )}
            </Box>
            <Box h={images.length > 1 ? 350 : 300}>
              <FileButton
                accept={IMAGE_MIME_TYPE}
                disabled={images.length === 6}
                opacity={images.length === 6 ? 0.3 : 1}
                onChange={(file) => {
                  grabImage(file, "input");
                }}
              >
                {(props) => (
                  <Button variant="default" size="lg" fullWidth {...props}>
                    <Group spacing={7}>
                      <Title order={3}>
                        {images.length === 6 ? "MAX REACHED" : "UPLOAD IMAGE"}
                      </Title>
                      {images.length < 6 && <IconUpload size={23} />}
                    </Group>
                  </Button>
                )}
              </FileButton>
              <Group
                position="center"
                opacity={0.4}
                spacing={5}
                fz={11}
                fs={"italic"}
                mt={10}
                mb={5}
              >
                You may drag and drop files into the browser window{" "}
              </Group>
              <Stack spacing={2}>
                {imageItems}
                {images.length < 6 && (
                  <Badge
                    variant="filled"
                    size="lg"
                    color={dark ? "dark.4" : "gray.5"}
                    c={dark ? "dark.9" : "gray.0"}
                    w={"60%"}
                    ml={"20%"}
                    opacity={dark ? 0.2 : 0.5}
                    mt={5}
                    sx={{
                      cursor: "default",
                    }}
                  >
                    {6 - images.length} space{images.length < 5 ? "s" : ""} left
                  </Badge>
                )}
              </Stack>
              <Dropzone.FullScreen
                maxFiles={1}
                onDrop={(file) => {
                  grabImage(file, "dropzone");
                }}
                onReject={(file) => console.error("rejected files", file)}
                accept={IMAGE_MIME_TYPE}
                ta="center"
                active={images.length < 6}
                styles={{
                  root: {
                    border: `5px dashed ${
                      dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                    } !important`,
                    background: dark
                      ? "rgba(0, 0, 0, 0) !important"
                      : "rgba(255, 255, 255, 0) !important",
                    ":hover": {
                      backgroundColor: dark
                        ? "rgba(0, 0, 0, 0.1) !important"
                        : "rgba(255, 255, 255, 0.1) !important",
                    },
                  },
                }}
              >
                <Center h={"calc(100vh - 60px)"}>
                  <Group
                    position="center"
                    spacing={5}
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
                </Center>
              </Dropzone.FullScreen>
            </Box>
          </Group>
        </>
      )}
      {/* Text Editor */}
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
      {router.pathname !== "/tripplanner" && (
        <Group position="right" w={"100%"}>
          <Button
            variant="default"
            size="md"
            w={"25%"}
            onClick={updateTripData}
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
              color={dark ? [0, 0, 0, 0.7] : [100, 100, 100, 0.4]} // RGBA
              image={imageUpload.file}
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
              color="blue.4"
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