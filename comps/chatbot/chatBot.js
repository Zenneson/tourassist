import { useRef, useEffect, useState } from "react";
import { useSpring } from "@react-spring/web";
import { useSessionStorage, useWindowEvent, mergeRefs } from "@mantine/hooks";
import {
  useComputedColorScheme,
  Box,
  Dialog,
  Textarea,
  Title,
  Flex,
  FocusTrap,
  Group,
  ActionIcon,
  ScrollArea,
  Button,
} from "@mantine/core";
import { IconMessageCircleQuestion, IconX } from "@tabler/icons-react";
import createGlobe from "cobe";
import classes from "./chatBot.module.css";

export default function ChatBot(props) {
  const { pageHistory } = props;
  const canvasRef = useRef();
  const chatBotIconRef = useRef();
  const [globe, setGlobe] = useState(null);
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const [startAnimation, setStartAnimation] = useSessionStorage({
    key: "startAnimation",
    initialValue: false,
  });

  const [visibleState, setVisibleState] = useSessionStorage({
    key: "visibleState",
    initialValue: false,
  });

  const [chatOpened, setChatOpened] = useSessionStorage({
    key: "chatOpened",
    initialValue: false,
  });

  const [{ speed, diffuse }, setAnimation] = useSpring(() => ({
    speed: 0.01,
    diffuse: 5,
  }));

  const animationClass = startAnimation ? classes.loadInAnimation : "";
  const visibleStateClass = visibleState ? classes.visible : "";

  useEffect(() => {
    if (pageHistory.length === 0) {
      setStartAnimation(true);
    }
    if (pageHistory.length > 0) {
      setStartAnimation(false);
      setVisibleState(true);
    }
  }, []);

  useWindowEvent("beforeunload", (url) => {
    setStartAnimation(false);
    setVisibleState(false);
  });

  useEffect(() => {
    setAnimation({
      speed: chatOpened ? 0.05 : 0.008,
      diffuse: chatOpened ? 0 : 2,
    });
  }, [chatOpened, setAnimation]);

  useEffect(() => {
    let phi = 0;

    if (canvasRef.current && !globe) {
      const theGlobe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 240,
        height: 240,
        phi: 2.16,
        theta: -0.25,
        dark: 1,
        diffuse: 2,
        mapSamples: 100000,
        mapBrightness: 12,
        mapBaseBrightness: 0.1,
        opacity: 0.75,
        markerColor: [1, 1, 1],
        glowColor: [0.02, 1, 2],
        baseColor: [0.01, 0.5, 1],
        markers: [],
        onRender: (state) => {
          state.phi = phi;
          phi += speed.get();
          state.diffuse = diffuse.get();
        },
      });
      setGlobe(theGlobe);
    }

    return () => {
      globe && globe.destroy();
    };
  }, [globe]);

  return (
    <>
      <svg
        className={`${classes.chatBotIcon} ${visibleStateClass} ${animationClass} icon icon-tabler icon-tabler-letter-a-small`}
        ref={chatBotIconRef}
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 16v-6a2 2 0 1 1 4 0v6" />
        <path d="M10 13h4" />
      </svg>
      <svg
        className={`${classes.chatBotIcon} ${visibleStateClass} ${animationClass} ${classes.moveRight} icon icon-tabler icon-tabler-letter-i-small`}
        ref={chatBotIconRef}
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 8v8" />
      </svg>
      <canvas
        className={`${classes.globeCanvas} ${visibleStateClass} ${animationClass}`}
        ref={canvasRef}
        onClick={() => setChatOpened(!chatOpened)}
      />
      <Dialog
        className={classes.chatBotModal}
        opened={chatOpened}
        withCloseButton={false}
        keepMounted={true}
        shadow="xl"
        size={"600px"}
        h={"34.5vh"}
        p={"0px"}
        radius={"5px 5px 0 0"}
        position={{ bottom: 160, right: 16 }}
        onClose={() => setChatOpened(false)}
        transitionProps={{
          transition: "slide-left",
          duration: 500,
        }}
      >
        <Group px={15} justify="space-between" className={classes.chatBotTitle}>
          <Flex align={"center"} gap={5}>
            <IconMessageCircleQuestion size={20} stroke={1} />
            <Title order={6} fz={"12px"}>
              Tour - Assist - Ant
            </Title>
          </Flex>
          <ActionIcon
            className={classes.chatBotCloseBtn}
            onClick={() => setChatOpened(false)}
            variant="transparent"
          >
            <IconX size={20} stroke={3} />
          </ActionIcon>
        </Group>
        <Flex direction={"column-reverse"} className={classes.chatBotMain}>
          Results
        </Flex>
      </Dialog>
      <Dialog
        className={classes.chatBotTextDialog}
        opened={chatOpened}
        position={{ bottom: 25, right: 16 }}
        radius={"0 0 5px 5px"}
        keepMounted={true}
        size={"600px"}
        h={"135px"}
        p={"0px"}
        transitionProps={{
          transition: "slide-left",
          duration: 500,
        }}
      >
        <FocusTrap active={chatOpened}>
          <Textarea
            classNames={{ input: classes.chatBotTextInput }}
            minRows={3}
            placeholder="Prompt..."
          />
        </FocusTrap>
      </Dialog>
    </>
  );
}
