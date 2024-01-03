import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Group,
  ScrollArea,
  Text,
  Textarea,
  Title,
  Tooltip,
  Transition,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconMessageChatbot,
  IconMessageForward,
  IconPointer,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import classes from "./styles/chatBot.module.css";

export default function ChatBot() {
  const chatInputRef = useRef(null);

  const [chatOpened, setChatOpened] = useSessionStorage({
    key: "chatOpened",
    defaultValue: false,
  });

  const openChat = () => {
    setChatOpened(!chatOpened);
    setTimeout(() => {
      chatInputRef.current.focus();
    }, 400);
  };

  return (
    <>
      {/* SVG Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="morpho-customize">
            <feFlood x="4" y="4" height="1" width="1" />
            <feComposite width="4" height="5" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={3} />
          </filter>
        </defs>
      </svg>
      <Tooltip
        classNames={{ tooltip: "toolTip" }}
        position="bottom"
        label={"Tour Assistant"}
      >
        <Image
          className={`${classes.globeImg} ${
            chatOpened ? classes.globeImgActive : classes.globeImgInactive
          }`}
          src="/img/aiglobe.gif"
          width={80}
          height={80}
          alt="Chatbot"
          priority={true}
          onClick={openChat}
        />
      </Tooltip>
      <Transition
        mounted={chatOpened}
        keepMounted={true}
        duration={500}
        transition="fade"
        timingFunction="ease"
      >
        {(styles) => (
          <Center style={styles} className={classes.chatBotCenter}>
            <Box className={classes.chatBotModal}>
              <Group className={classes.chatBotTitle}>
                <Flex align={"center"} gap={5}>
                  <IconMessageChatbot size={30} stroke={1} opacity={0.5} />
                  <Title order={6} fz={"15px"}>
                    Tour - Assistant
                  </Title>
                </Flex>
              </Group>
              <Flex
                className={classes.chatBotMain}
                direction={"column"}
                component={ScrollArea}
              >
                <Flex direction={"column-reverse"}>
                  <Flex fz={12} gap={5} align={"center"}>
                    <Link className={classes.chatBotLink} href="#">
                      How do I pick a location?
                    </Link>
                    <IconPointer
                      size={11}
                      className={classes.chatLinkFrame}
                      stroke={1}
                    />
                  </Flex>
                  <Flex fz={12} gap={5} align={"center"}>
                    <Link className={classes.chatBotLink} href="#">
                      How I book travel and accommodations?
                    </Link>
                    <IconPointer
                      size={11}
                      className={classes.chatLinkFrame}
                      stroke={1}
                    />
                  </Flex>
                  <Flex fz={12} gap={5} align={"center"}>
                    <Link className={classes.chatBotLink} href="#">
                      What is Tour Assist?
                    </Link>
                    <IconPointer
                      size={11}
                      className={classes.chatLinkFrame}
                      stroke={1}
                    />
                  </Flex>
                  <Flex fz={12} gap={5} align={"center"}>
                    <Link className={classes.chatBotLink} href="#">
                      How do I start a campaign for my trip?
                    </Link>
                    <IconPointer
                      size={11}
                      className={classes.chatLinkFrame}
                      stroke={1}
                    />
                  </Flex>
                  <Box className={classes.chatBotTextFrame}>
                    <Title
                      order={6}
                      fz={"12px"}
                      className={classes.chatBotTextTitle}
                    >
                      Tour Assistant
                    </Title>
                    <Text fz={"12px"} className={classes.chatBotText}>
                      This is your virtual travel assistant, here to guide you
                      on an exciting journey of crafting your dream trip through
                      crowdfunding.
                    </Text>
                  </Box>
                </Flex>
              </Flex>
              <Box pos={"relative"}>
                <Textarea
                  ref={chatInputRef}
                  classNames={{ input: classes.chatBotTextInput }}
                  placeholder="Message Tour - Assistant..."
                />
                <ActionIcon
                  pos={"absolute"}
                  bottom={0}
                  right={0}
                  size={45}
                  radius={"15px 0 0 0"}
                  variant="subtle"
                  className={classes.chatSendBtn}
                >
                  <IconMessageForward className={classes.chatSendIcon} />
                </ActionIcon>
              </Box>
            </Box>
          </Center>
        )}
      </Transition>
    </>
  );
}
