"use client";
import { AppShell, MantineProvider, ScrollArea } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { usePathname, useRouter } from "next/navigation";
import ChatBot from "./comps/chatbot/chatBot";
import MainMenu from "./comps/navbar/mainMenu";
import SearchModal from "./comps/navbar/searchModal";
import { AreaProvider, StateProvider, UserProvider } from "./libs/context";
import { tourTheme } from "./libs/tourTheme";

export default function AppWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // useEffect(() => {
  //   const links = document.querySelectorAll("a");
  //   links.forEach((link) => {
  //     const href = link.getAttribute("href");
  //     if (href && href.startsWith("/")) {
  //       router.prefetch(href);
  //       console.log(`Prefetching: ${href}`);
  //     }
  //   });
  // }, []);

  return (
    <MantineProvider theme={tourTheme} defaultColorScheme="dark">
      <UserProvider>
        <StateProvider>
          <Notifications position="top-center" zIndex={9999} limit={1} />
          <SearchModal />
          <AppShell
            // key={historyKey}
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
            <AreaProvider>
              {pathname !== "/" && <ChatBot />}
              {children}
            </AreaProvider>
          </AppShell>
        </StateProvider>
      </UserProvider>
    </MantineProvider>
  );
}
