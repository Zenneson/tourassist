"use client";
import {
  Box,
  Button,
  Group,
  Modal,
  ScrollArea,
  useComputedColorScheme,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import Legal from "../app/legal";
import Intro from "./intro/intro";
import classes from "./styles/page.module.css";

const auth = getAuth();

export default function Home() {
  const { height, width } = useViewportSize();
  const [showLegal, setShowLegal] = useState(false);

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const images = [
    "ppl/ppl1.jpg",
    "ppl/ppl2.jpg",
    "ppl/ppl3.jpg",
    "ppl/ppl4.jpg",
    "ppl/ppl5.jpg",
    "ppl/ppl6.jpg",
    "ppl/ppl7.jpg",
    "ppl/ppl8.jpg",
  ];

  return (
    <>
      <Modal
        className={classes.legalModal}
        zIndex={1500}
        opened={showLegal}
        fullScreen={true}
        onClose={() => setShowLegal(false)}
        scrollAreaComponent={ScrollArea.Autosize}
        withCloseButton={false}
      >
        <Group pos={"absolute"} right={20} w={"100%"} justify="flex-end">
          <Button variant="default" onClick={() => setShowLegal(false)}>
            CLOSE
          </Button>
        </Group>
        <Legal />
      </Modal>
      <Intro auth={auth} setShowLegal={setShowLegal} />
      <Box
        opacity={1}
        pos="absolute"
        w={width}
        h={height}
        style={{
          zIndex: "1000",
          filter: "brightness(123%)",
          overflow: "hidden",
        }}
      >
        Placeholder
      </Box>
    </>
  );
}
