"use client";
import { isEqual, removeImageByName, updateEditedTrip } from "@libs/custom";
import { tripUpdated, updatingTrip } from "@libs/notifications";
import { useLoaderState, useTripPlannerState, useTripState } from "@libs/store";
import {
  Carousel,
  CarouselSlide,
  useAnimationOffsetEffect,
} from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import {
  ActionIcon,
  BackgroundImage,
  Badge,
  Box,
  Button,
  Center,
  FileButton,
  Flex,
  Group,
  LoadingOverlay,
  Overlay,
  Slider,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useWindowEvent } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Link, RichTextEditor } from "@mantine/tiptap";
import "@mantine/tiptap/styles.css";
import {
  IconCheck,
  IconChevronCompactLeft,
  IconChevronCompactRight,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import classes from "./styles/tripContent.module.css";

export default function TripContent(props) {
  let {
    user,
    tripData,
    images,
    modalMode,
    setModalMode,
    titleRef,
    setTripDesc,
  } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const [loading, setLoading] = useState(true);

  const { plannerImages, setPlannerImages: setPlannerImagesRaw } =
    useTripPlannerState();
  const [imageUpload, setImageUpload] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [scale, setScale] = useState(1);
  const [processingImage, setProcessingImage] = useState(false);

  const { tripDesc, updatedDesc } = useTripState();
  const setHideLoader = useLoaderState();

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const cropperRef = useRef(null);
  const cropperContainerRef = useRef(null);

  const [activeImages, setActiveImages] = useState(images);
  useEffect(() => {
    if (isEqual(activeImages, images)) return;
    setActiveImages(images);
  }, [images]);

  const [newImageAdded, setNewImageAdded] = useState(false);
  const [embla, setEmbla] = useState(null);
  useAnimationOffsetEffect(embla, 500);

  const slides =
    activeImages && activeImages.length > 0
      ? activeImages.map((image, index) => (
          <CarouselSlide key={index}>
            <Image
              radius={3}
              src={image.file}
              height={300}
              width={pathname === "/tripPlanner" ? 435 : 390}
              fetchPriority="high"
              priority="true"
              loading="eager"
              alt={image.name}
            />
          </CarouselSlide>
        ))
      : null;

  let content;
  if (pathname === "/tripPlanner") {
    content = tripDesc !== "" ? tripDesc?.toString() : "";
  } else if (params.hasOwnProperty("title")) {
    content = tripData?.tripDesc;
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
    content: tripDesc || content,
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
          tripData?.tripDesc?.toString()
      );
    }
  }, [editor, tripDesc, tripData, updatedDesc]);

  const setPlannerImages = useCallback(setPlannerImagesRaw, []);
  const [imageUpdated, setImageUpdated] = useState(false);
  useEffect(() => {
    if (activeImages !== plannerImages && !imageUpdated) {
      setPlannerImages(activeImages);
      setImageUpdated(true);
    }
  }, [activeImages, plannerImages, setPlannerImages, imageUpdated]);

  const handleScroll = (event) => {
    let newScale = scale - event.deltaY * 0.005;
    newScale = Math.min(Math.max(newScale, 1), 5);
    setScale(newScale);
  };

  const checkName = (name) => {
    let counter = 0;
    const baseName = name.substring(0, name.length - 4);
    const nameExists = (imageName) => {
      return activeImages.some((img) => img.name === imageName);
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
        setActiveImages((prevImages) => {
          const newImages = [...prevImages, imgObj]; // create new images array
          return newImages; // return new images array to update state
        });

        setProcessingImage(false);
        setImageUpload(null);
        setScale(1);
        setImageUpdated(false);
        setNewImageAdded(true);
      };
      reader.onerror = (error) => console.error("Error: ", error);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (newImageAdded && embla) {
      setTimeout(() => {
        embla.scrollTo(activeImages.length - 1); // Scroll to the last slide
        setNewImageAdded(false); // Reset the flag
      }, 500);
    }
  }, [newImageAdded, embla, activeImages.length]);

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

  const imageItems =
    activeImages && activeImages.length > 0
      ? activeImages.map((image, index) => {
          return (
            <Flex
              className={classes.tripImageWrapper}
              key={index}
              gap={10}
              align={"center"}
              p={"7px 10px"}
              onClick={() => {
                embla.scrollTo(index);
              }}
            >
              <Title
                order={6}
                w={25}
                ta={"center"}
                style={{
                  borderRadius: 5,
                  borderRight: `1px solid ${
                    dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                  }`,
                }}
              >
                {index + 1}
              </Title>
              <Text fz={10} w={"100%"} truncate="end">
                {image.name}
              </Text>
              <ActionIcon
                className={classes.trash}
                size={"sm"}
                maw={"10%"}
                variant="subtle"
                color="red.9"
                onClick={() => {
                  setActiveImages(
                    removeImageByName(
                      activeImages,
                      image.name,
                      params,
                      tripData?.tripId,
                      user
                    )
                  );
                }}
              >
                <IconTrash size={17} />
              </ActionIcon>
            </Flex>
          );
        })
      : null;

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
    const title = tripData.tripId;

    setModalMode("");
    setHideLoader(false);

    try {
      await updateEditedTrip(
        user.email,
        tripData,
        tripData.tripId,
        activeImages,
        newDesc,
        tripData.travelDate,
        title
      );
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const updateHandler = () => {
    updateTripData();
    notifications.update(tripUpdated);
  };

  return (
    <>
      {(modalMode === "editTrip" || pathname === "/tripPlanner") && (
        <>
          <Group gap={20} w="100%" align="flex-start" grow>
            <Box>
              {activeImages.length > 0 ? (
                <Carousel
                  getEmblaApi={setEmbla}
                  align={"center"}
                  withIndicators={activeImages.length > 1}
                  controlSize={60}
                  controlsOffset={-50}
                  nextControlIcon={
                    <IconChevronCompactRight
                      className={classes.carouselIcon}
                      size={60}
                    />
                  }
                  previousControlIcon={
                    <IconChevronCompactLeft
                      className={classes.carouselIcon}
                      size={60}
                    />
                  }
                  classNames={{
                    indicators: classes.indicators,
                    indicator: activeImages.length > 1 && classes.indicator,
                    control: classes.control,
                    root: classes.root,
                  }}
                >
                  {slides}
                </Carousel>
              ) : (
                <BackgroundImage
                  radius={3}
                  opacity={dark ? 0.05 : 0.1}
                  priority="true"
                  loading="eager"
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
            <Box h={300}>
              <FileButton
                accept={IMAGE_MIME_TYPE}
                disabled={activeImages.length === 6}
                opacity={activeImages.length === 6 ? 0.3 : 1}
                onChange={(file) => {
                  grabImage(file, "input");
                }}
              >
                {(props) => (
                  <Button
                    classNames={{ root: classes.uploadBtn }}
                    variant="light"
                    size="lg"
                    fullWidth
                    {...props}
                  >
                    <Group gap={7}>
                      <Title order={3}>
                        {activeImages.length === 6
                          ? "MAX REACHED"
                          : "UPLOAD IMAGE"}
                      </Title>
                      {activeImages.length < 6 && <IconUpload size={23} />}
                    </Group>
                  </Button>
                )}
              </FileButton>
              <Group
                justify="center"
                opacity={0.4}
                gap={5}
                fz={11}
                fs={"italic"}
                mt={10}
                mb={5}
              >
                You may drag and drop files into the browser window{" "}
              </Group>
              <Stack gap={0}>
                {imageItems}
                {activeImages.length < 6 && (
                  <Badge
                    variant="filled"
                    size="lg"
                    color={dark ? "dark.5" : "gray.5"}
                    c={dark ? "gray.0" : "gray.9"}
                    w={"60%"}
                    ml={"20%"}
                    opacity={0.2}
                    mt={5}
                    style={{
                      cursor: "default",
                    }}
                  >
                    {6 - activeImages.length} space
                    {activeImages.length < 5 ? "s" : ""} left
                  </Badge>
                )}
              </Stack>
              <Dropzone.FullScreen
                className={classes.dropzone}
                maxFiles={1}
                onDrop={(file) => {
                  grabImage(file, "dropzone");
                }}
                onReject={(file) => console.error("rejected files", file)}
                accept={IMAGE_MIME_TYPE}
                ta="center"
                active={activeImages.length < 6}
              >
                <Center h={"calc(100vh - 60px)"}>
                  <Group
                    justify="center"
                    gap={5}
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
      <RichTextEditor
        classNames={{
          root: classes.textEditorRoot,
          toolbar: classes.textEditorToolbar,
          content: classes.textEditorContent,
          typographyStylesProvider: classes.textEditorTypographyStylesProvider,
        }}
        editor={editor}
        position="relative"
        mih={modalMode === "editTrip" ? 200 : 250}
        bg={dark ? "dark.6" : "gray.2"}
        onBlur={() => {
          if (pathname === "/tripPlanner") setTripDesc(editor.getHTML());
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
      {pathname !== "/tripPlanner" && (
        <Group justify="flex-end" w={"100%"}>
          <Button variant="default" size="md" w={"25%"} onClick={updateHandler}>
            SUBMIT EDIT
          </Button>
        </Group>
      )}
      {showCropper && imageUpload && (
        <>
          <Box
            ref={cropperContainerRef}
            pos={"absolute"}
            top={45}
            style={{
              zIndex: 1000,
              opacity: loading ? 0 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <AvatarEditor
              ref={cropperRef}
              width={468}
              height={360}
              border={50}
              color={dark ? [0, 0, 0, 0.8] : [100, 100, 100, 0.4]} // RGBA
              image={imageUpload.file}
              scale={scale}
              onWheel={handleScroll}
              onLoadSuccess={() => setLoading(false)}
              style={{
                borderRadius: 3,
                overflow: "hidden",
              }}
            />
            <Slider
              classNames={{
                root: classes.sizeSlider,
                thumb: classes.sizeSliderThumb,
                bar: classes.sizeSliderBar,
                track: classes.sizeSliderTracker,
              }}
              mt={20}
              min={1}
              max={5}
              step={0.05}
              size={"lg"}
              thumbSize={38}
              thumbChildren={<IconPhoto size={17} stroke={2} />}
              defaultValue={1}
              label={null}
              value={scale}
              onChange={setScale}
            />
            <Group w={"100%"} mt={30} grow>
              {/* Selects YES Cropped Image to Image Slider  */}
              <Button
                className={classes.dimBtn}
                size="xl"
                variant="light"
                color={dark ? "dark.7" : "gray.0"}
                c={dark ? "gray.0" : "dark.8"}
                onClick={addImage}
              >
                <IconCheck stroke={5} size={35} />
              </Button>
              {/* Selects NO Cropped Image to Image Slider  */}
              <Button
                className={classes.dimBtn}
                size="xl"
                variant="light"
                color={dark ? "dark.7" : "gray.0"}
                c={dark ? "gray.0" : "dark.8"}
                onClick={dontAddImage}
              >
                <IconX stroke={5} size={35} />
              </Button>
            </Group>
          </Box>
          <Overlay
            color={dark ? "dark.7" : "#fff"}
            backgroundOpacity={dark ? 0.9 : 0.5}
            blur={7}
          />
          <LoadingOverlay
            visible={processingImage}
            loaderProps={{
              color: dark ? "#0d3f82" : "#2dc7f3",
              type: "bars",
            }}
            overlayProps={{
              backgroundOpacity: 1,
              color: dark ? "#0b0c0d" : "#f8f9fa",
            }}
          />
        </>
      )}
    </>
  );
}
