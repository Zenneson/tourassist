"use client";
import { Box, Flex, ScrollArea, Stack, Text, Title } from "@mantine/core";
import classes from "../styles/chatBot.module.css";

export default function ChatArea(props) {
  const { messages, user } = props;

  return (
    <Flex
      className={classes.chatBotMain}
      direction={"column"}
      component={ScrollArea}
    >
      <Stack justify="flex-end">
        {messages.map((message) => {
          return (
            <Box key={message.id} className={classes.chatBotTextFrame}>
              <Title order={6} fz={"12px"} className={classes.chatBotTextTitle}>
                {message.role === "user"
                  ? user
                    ? user.email
                    : "User"
                  : "Tour Assistant"}
              </Title>
              <Text className={classes.chatBotText}>{message.content}</Text>
            </Box>
          );
        })}
      </Stack>
    </Flex>
  );
}
