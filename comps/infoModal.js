import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import { Modal, Title, Text } from "@mantine/core";

export const infoOpenedState = atom({
  key: "infoOpenedState",
  default: false,
});

export default function InfoModal() {
  const [infoOpened, setInfoOpened] = useRecoilState(infoOpenedState);

  return (
    <>
      <Modal
        overlayColor="rgba(0,0,0,0)"
        overlayBlur={10}
        opened={infoOpened}
        onClose={() => setInfoOpened(false)}
        centered
        title={
          <Title
            oreder={3}
            fw={900}
            sx={{
              textShadow: "0 3px 5px rgba(0, 0, 0, 0.15)",
            }}
            variant="gradient"
            gradient={{ from: "#00E8FC", to: "#FFF", deg: 45 }}
          >
            TourAssist?
          </Title>
        }
        styles={(theme) => ({
          modal: {
            backgroundColor: "rgba(0,0,0,0.9)",
          },
          close: {
            outline: "none",
            position: "absolute",
            top: "10px",
            right: "10px",
            ":focus": {
              outline: "none",
            },
          },
        })}
      >
        <Text fw={400}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </Modal>
    </>
  );
}
