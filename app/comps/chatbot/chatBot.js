import {
  ActionIcon,
  Box,
  Button,
  Dialog,
  Flex,
  Group,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { IconMessageCircleQuestion, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./styles/chatBot.module.css";

export default function ChatBot() {
  const router = useRouter();

  const [chatOpened, setChatOpened] = useSessionStorage({
    key: "chatOpened",
    defaultValue: false,
  });

  return (
    <>
      <Box
        className={classes.globeCanvas}
        bg={"#777"}
        w={"120px"}
        h={"120px"}
        onClick={() => router.push("/admin")}
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
          <Group grow>
            <Button size="xs" variant="transparent">
              How do I pick a location?
            </Button>
            <Button size="xs" variant="transparent">
              How I book travel and accommodations?
            </Button>
          </Group>
          <Group grow>
            <Button size="xs" variant="transparent">
              What is Tour Assist?
            </Button>
            <Button size="xs" variant="transparent">
              How do I start a campaign for my trip?
            </Button>
          </Group>
          <Box className={classes.chatBotTextFrame}>
            <Title order={6} fz={"12px"} className={classes.chatBotTextTitle}>
              Tour Assistant
            </Title>
            <Text fz={"12px"} className={classes.chatBotText}>
              This is your virtual travel assistant, here to guide you on an
              exciting journey of crafting your dream trip through crowdfunding.
              Whether you need tips on creating a compelling campaign, seeking
              the perfect travel destination, or exploring ways to make your
              travel dreams come true, I'm here to help. How can we start our
              adventure today?
            </Text>
          </Box>
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
        <Textarea
          classNames={{ input: classes.chatBotTextInput }}
          minRows={3}
          placeholder="Prompt..."
        />
      </Dialog>
    </>
  );
}
