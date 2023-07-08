import { Modal, Title } from "@mantine/core";
import LoginComp from "./loginComp";

export default function LoginModal({ loginOpened, setLoginOpened }) {
  return (
    <>
      <Modal
        opened={loginOpened}
        onClose={() => setLoginOpened(false)}
        centered
        title={
          <Title oreder={3} fw={900}>
            Join Us
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
        <LoginComp setLoginOpened={setLoginOpened} />
      </Modal>
    </>
  );
}
