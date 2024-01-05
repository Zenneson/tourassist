"use client";
import { useUser } from "@libs/context";
import { timeStamper } from "@libs/custom";
import { useAppState } from "@libs/store";
import {
  ActionIcon,
  Box,
  Center,
  Flex,
  FocusTrap,
  Group,
  Kbd,
  Text,
  Textarea,
  Title,
  Tooltip,
  Transition,
} from "@mantine/core";
import { getHotkeyHandler, useFocusWithin, useOs } from "@mantine/hooks";
import {
  IconCommand,
  IconMessageChatbot,
  IconPointer,
  IconSend2,
} from "@tabler/icons-react";
import { useChat } from "ai/react";
import Image from "next/image";
import ChatArea from "./comps/chatArea";
import classes from "./styles/chatBot.module.css";

export default function ChatBot() {
  const {
    chatOpened,
    setChatOpened,
    setPanelOpened,
    setMainMenuOpened,
    setSearchOpened,
  } = useAppState();
  const { user } = useUser();
  const clientOs = useOs();
  const { ref, focused } = useFocusWithin();
  const arrow = (
    <IconPointer size={11} className={classes.chatLinkFrame} stroke={1} />
  );

  const chatId = user
    ? `${user.email}-${timeStamper()}`
    : `guest-${timeStamper()}`;
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "./api/route",
      id: chatId,
    });

  const toogleChat = () => {
    setChatOpened(!chatOpened);
    setMainMenuOpened(false);
    setPanelOpened(false);
    setSearchOpened(false);
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
              <ChatArea user={user} messages={messages} />
              <Box pos={"relative"} ref={ref}>
                <FocusTrap active={chatOpened}>
                  <form onSubmit={handleSubmit}>
                    <Textarea
                      autoFocus={true}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Message Tour - Assistant..."
                      classNames={{
                        root: classes.chatBotInputRoot,
                        input: classes.chatBotTextInput,
                      }}
                      onKeyDown={getHotkeyHandler([
                        ["mod+Enter", handleSubmit],
                      ])}
                    />
                    <ActionIcon
                      type="submit"
                      pos={"absolute"}
                      bottom={0}
                      right={0}
                      size={45}
                      radius={"15px 0 0 0"}
                      variant="subtle"
                      loading={isLoading}
                      className={classes.chatSendBtn}
                    >
                      <IconSend2 className={classes.chatSendIcon} />
                    </ActionIcon>
                  </form>
                </FocusTrap>
                {clientOs !== "undetermined" && (
                  <Text
                    fw={700}
                    fz={14}
                    className={`${classes.keySubmit} ${
                      focused && classes.keySubmitActive
                    }`}
                  >
                    <Flex component="span" align={"center"}>
                      <Kbd>
                        {clientOs === "macos" ? (
                          <IconCommand size={14} />
                        ) : (
                          "CTRL"
                        )}
                      </Kbd>
                      <span style={{ margin: "0px 5px" }}>+</span>
                      <Kbd>ENTER</Kbd>
                    </Flex>
                  </Text>
                )}
              </Box>
            </Box>
          </Center>
        )}
      </Transition>
    </>
  );
}

/* <Group>
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
</Group> */

// 1) Define the Scope and Capabilities:
// - Answer questions about the app
// - Answer questions about the user's trip
// - Answer questions about the user's campaign
// - Answer questions about the user's account
// - Answer questions about the the campaign's progress
// - Create a trip itenerary
// - Help complete the campign setup process
// - Help the user find a location on the map for their trip
// - Help the user find a hotel on the platform
// - Help the user find a flight on the platform
// - Help user manage theor flight and hotel bookings
// - Give the user tips on how to promote their campaign
// - Give the user tips on how to make their campaign more appealing to donors
// - Explain how the platform works
// - Troubleshoot issues with the platform
// - Help the user troubleshoot issues with their account

// 2) Gather and Prepare Data:
// - Where can I find realiable travel, scoial media, and crowdfunding tips to train the chatbot?
// - How can I capture all the possible data about this site to train the chatbot?
// - What are the most common questions users ask?
// - What are the most common issues users have?
// - What are the most common requests users have?
// - What are the most common complaints users have?
