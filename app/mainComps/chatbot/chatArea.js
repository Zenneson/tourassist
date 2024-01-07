"use client";
import { Box, Grid, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconCpu, IconUserCircle } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import classes from "./styles/chatBot.module.css";

export default function ChatArea(props) {
  const { messages, user } = props;
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Stack justify="flex-end" gap={0} className={classes.messagesArea}>
      <ScrollArea>
        {messages.map((message) => {
          return (
            <Grid
              key={message.id}
              gutter={0}
              justify={message.role === "assistant" ? "flex-start" : "flex-end"}
              className={classes.chatTextGrid}
            >
              <Grid.Col
                span="content"
                order={message.role === "assistant" ? 1 : 2}
              >
                {message.role === "assistant" ? (
                  <IconCpu size={35} className={classes.assistantAvi} />
                ) : (
                  <IconUserCircle size={35} className={classes.userAvi} />
                )}
              </Grid.Col>
              <Grid.Col span={9} order={message.role === "assistant" ? 2 : 1}>
                <Box key={message.id} className={classes.chatBotTextFrame}>
                  <Title
                    order={6}
                    fz={"12px"}
                    className={classes.chatBotTextTitle}
                  >
                    {message.role === "user"
                      ? user && user.email
                        ? user.email
                        : "Guest"
                      : "Tour Assistant"}
                  </Title>
                  <Text
                    className={`${classes.chatBotText} whitespace-pre-line ${
                      message.role === "assistant"
                        ? classes.chatBotTextBotArrow
                        : classes.chatBotTextUserArrow
                    }`}
                  >
                    {message.content}
                  </Text>
                </Box>
              </Grid.Col>
            </Grid>
          );
        })}
        <div ref={endOfMessagesRef} />
      </ScrollArea>
    </Stack>
  );
}
