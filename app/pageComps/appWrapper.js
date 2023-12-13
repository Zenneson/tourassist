"use client";
import { UserProvider } from "@libs/context";
import { tourTheme } from "@libs/tourTheme";
import {
  AppShell,
  ColorSchemeScript,
  MantineProvider,
  ScrollArea,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";
import ChatBot from "../comps/chatbot/chatBot";
import MainMenu from "../comps/navbar/mainMenu";
import SearchModal from "../comps/navbar/searchModal";
import "../styles/global.css";

export default function AppWrapper({ children }) {
  const pathname = usePathname();

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={tourTheme} defaultColorScheme="dark">
        <UserProvider>
          <Notifications position="top-center" zIndex={9999} limit={1} />
          <SearchModal />
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
            {children}
          </AppShell>
        </UserProvider>
      </MantineProvider>
    </>
  );
}
