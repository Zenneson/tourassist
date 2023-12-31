"use client";
import ChatBot from "@globalComps/chatbot/chatBot";
import MainMenu from "@globalComps/navbar/mainMenu";
import SearchModal from "@globalComps/navbar/searchModal";
import { UserProvider } from "@libs/context";
import { useAppState } from "@libs/store";
import { tourTheme } from "@libs/tourTheme";
import {
  AppShell,
  Button,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Modal,
  ScrollArea,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { usePathname } from "next/navigation";
import { SWRDevTools } from "swr-devtools";
import Legal from "../legal";
import "../styles/global.css";

export default function AppWrapper({ children }) {
  const pathname = usePathname();
  const { showLegal, setShowLegal } = useAppState();

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={tourTheme} defaultColorScheme="dark">
        <UserProvider>
          <Notifications position="top-center" zIndex={9999} limit={1} />
          <SearchModal />
          <Modal
            className="legalModal"
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
          <AppShell
            transitionDuration={300}
            transitionTimingFunction="ease"
            padding="none"
            header={{ height: 1 }}
            component={pathname !== "/map" && ScrollArea}
            style={{
              position: "absolute",
              height: "100vh",
              width: "100vw",
            }}
          >
            <AppShell.Header>
              {pathname !== "/" && <MainMenu />}
            </AppShell.Header>
            {pathname !== "/" && <ChatBot />}
            <SWRDevTools>{children}</SWRDevTools>
          </AppShell>
        </UserProvider>
      </MantineProvider>
    </>
  );
}
