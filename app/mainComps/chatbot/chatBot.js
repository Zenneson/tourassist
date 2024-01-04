import { useAppState } from "@libs/store";
import {
  ActionIcon,
  Badge,
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
import {
  IconMessageChatbot,
  IconMessageForward,
  IconPointer,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRef } from "react";
import classes from "./styles/chatBot.module.css";

export default function ChatBot() {
  const {
    chatOpened,
    setChatOpened,
    setPanelOpened,
    setMainMenuOpened,
    setSearchOpened,
  } = useAppState();
  const chatInputRef = useRef(null);

  const toogleChat = () => {
    setChatOpened(!chatOpened);
    setMainMenuOpened(false);
    setPanelOpened(false);
    setSearchOpened(false);

    setTimeout(() => {
      chatInputRef.current.focus();
    }, 400);
  };

  const arrow = (
    <IconPointer size={11} className={classes.chatLinkFrame} stroke={1} />
  );

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
          onClick={toogleChat}
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
                <Flex align={"center"} gap={5} opacity={0.4}>
                  <IconMessageChatbot size={30} stroke={1} />
                  <Title order={6} fz={"17px"} fw={400}>
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
                  <Group>
                    <Badge variant="light" rightSection={arrow}>
                      How do I pick a location?
                    </Badge>
                    <Badge variant="light" rightSection={arrow}>
                      How I book travel and accommodations?
                    </Badge>
                    <Badge variant="light" rightSection={arrow}>
                      What is Tour Assist?
                    </Badge>
                    <Badge variant="light" rightSection={arrow}>
                      How do I start a campaign for my trip?
                    </Badge>
                  </Group>
                  <Box className={classes.chatBotTextFrame}>
                    <Title
                      order={6}
                      fz={"12px"}
                      className={classes.chatBotTextTitle}
                    >
                      Tour Assistant
                    </Title>
                    <Text className={classes.chatBotText}>
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
                  classNames={{
                    root: classes.chatBotInputRoot,
                    input: classes.chatBotTextInput,
                  }}
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
