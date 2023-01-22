import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import { Modal, Title, Text } from "@mantine/core";
import LoginComp from "./loginComp";
import { loginTypeState } from "./loginComp";

export const loginOpenedState = atom({
  key: "loginOpenedState",
  default: false,
});

export default function LoginModal() {
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [loginType, setLoginType] = useRecoilState(loginTypeState);

  return (
    <>
      <Modal
        overlayColor="#fff"
        overlayOpacity={0.1}
        overlayBlur={10}
        opened={loginOpened}
        onClose={() => setLoginOpened(false)}
        centered
        title={
          <Title oreder={3} fw={900} transform="capitalize">
            {loginType}
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
        <LoginComp />
      </Modal>
    </>
  );
}
