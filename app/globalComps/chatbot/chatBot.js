import {
  ActionIcon,
  Box,
  Dialog,
  Flex,
  Group,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconMessageCircleQuestion,
  IconMessageForward,
  IconPointer,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import classes from "./styles/chatBot.module.css";

export default function ChatBot() {
  const router = useRouter();
  const chatInputRef = useRef(null);

  const [chatOpened, setChatOpened] = useSessionStorage({
    key: "chatOpened",
    defaultValue: false,
  });

  const openChat = () => {
    setChatOpened(true);
    setTimeout(() => {
      chatInputRef.current.focus();
    }, 400);
  };

  useEffect(() => {
    router.prefetch("/admin");
  }, [router]);

  return (
    <>
      <Tooltip
        classNames={{ tooltip: "toolTip" }}
        position="bottom"
        label={"Tour Assistant"}
      >
        <Image
          className={classes.globeImg}
          src="/img/chatlogo.png"
          width={60}
          height={60}
          alt="Chatbot"
          priority={true}
          onClick={openChat}
        />
      </Tooltip>
      <Dialog
        className={classes.chatBotModal}
        opened={chatOpened}
        withCloseButton={false}
        keepMounted={true}
        shadow="xl"
        size={"400px"}
        h={"600px"}
        p={"0px"}
        zIndex={3000}
        radius={"5px 5px 0 0"}
        position={{ bottom: 25, right: 25 }}
        onClose={() => setChatOpened(false)}
        transitionProps={{
          transition: "slide-left",
          duration: 250,
        }}
      >
        <Group px={15} justify="space-between" className={classes.chatBotTitle}>
          <Flex align={"center"} gap={5}>
            <IconMessageCircleQuestion size={20} stroke={1} />
            <Title order={6} fz={"12px"}>
              Tour - Assistant
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
          <Flex direction={"column"}>
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
          </Flex>
          <Box className={classes.chatBotTextFrame}>
            <Title order={6} fz={"12px"} className={classes.chatBotTextTitle}>
              Tour Assistant
            </Title>
            <Text fz={"12px"} className={classes.chatBotText}>
              This is your virtual travel assistant, here to guide you on an
              exciting journey of crafting your dream trip through crowdfunding.
            </Text>
          </Box>
        </Flex>
        <Box pos={"relative"}>
          <Textarea
            ref={chatInputRef}
            radius={0}
            classNames={{ input: classes.chatBotTextInput }}
            placeholder="Prompt..."
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
      </Dialog>
    </>
  );
}
