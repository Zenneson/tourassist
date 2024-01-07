"use client";
import { UserProvider } from "@libs/context";
import { useAppState } from "@libs/store";
import { tourTheme } from "@libs/tourTheme";
import ChatBot from "@mainComps/chatbot/chatBot";
import MainMenu from "@mainComps/navbar/mainMenu";
import SearchModal from "@mainComps/navbar/searchModal";
import {
  ActionIcon,
  AppShell,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Modal,
  ScrollArea,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { SWRDevTools } from "swr-devtools";
import Legal from "../legal/page";
import "../styles/global.css";
import classes from "./styles/home.module.css";

export default function AppWrapper({ children }) {
  const pathname = usePathname();
  const { showLegal, setShowLegal } = useAppState();

  return (
    <>
      {/* SVG Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="morpho-customize">
            <feFlood x="4" y="4" height="1" width="1" />
            <feComposite width="4" height="5" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={3} />
          </filter>
        </defs>
      </svg>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={tourTheme} defaultColorScheme="dark">
        <UserProvider>
          <Notifications position="top-center" zIndex={9999} limit={1} />
          <SearchModal />
          <Modal
            classNames={{
              root: classes.legalModal,
              overlay: classes.legalModalOverlay,
            }}
            opened={showLegal}
            size={"95%"}
            onClose={() => setShowLegal(false)}
            withCloseButton={false}
            scrollAreaComponent={ScrollArea.Autosize}
          >
            <Group pos={"absolute"} right={20} w={"100%"} justify="flex-end">
              <ActionIcon
                className={classes.legalModalClose}
                variant="transparent"
                onClick={() => setShowLegal(false)}
              >
                <IconX stroke={3} />
              </ActionIcon>
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
