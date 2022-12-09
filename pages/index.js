import { useState } from "react";
import {
  AppShell,
  Header,
  Drawer,
  Button,
  Image,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";

export default function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);

  return (
    <AppShell
      padding="none"
      header={
        <Header height={{ base: 50, md: 70 }} p="md" zIndex={100}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Mobile Menu Burger */}
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Image
              width={"auto"}
              height={50}
              src={"img/rlogo.png"}
              alt="TouraSSist_logo"
              withPlaceholder
            />
            <Button onClick={() => setListOpened(true)}>Login</Button>
          </div>
        </Header>
      }
    >
      <Drawer
        opened={listOpened}
        onClose={() => setListOpened(false)}
        withOverlay={false}
        withCloseButton={false}
        zIndex={99}
        padding="xl"
      >
        <div
          style={{
            paddingTop: "35px",
          }}
        >
          <h2>List</h2>
        </div>
      </Drawer>
    </AppShell>
  );
}
