import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import { Modal, Title, Text } from "@mantine/core";

export const loginOpenedState = atom({
  key: "loginOpenedState",
  default: false,
});

export default function LoginModal() {
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);

  return (
    <>
      <Modal
        overlayColor="rgba(0,0,0,0.9)"
        overlayBlur={10}
        opened={loginOpened}
        onClose={() => setLoginOpened(false)}
        centered
        title={
          <Title oreder={3} fw={900}>
            Login
          </Title>
        }
        styles={(theme) => ({
          modal: {
            backgroundColor: "rgba(0,0,0,0.95)",
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
        <Text fw={400}>Login</Text>
      </Modal>
    </>
  );
}
