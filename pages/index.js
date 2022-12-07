import { useState } from "react";
import {
  AppShell,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import Mymap from "../comps/mymap";

export default function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      padding="none"
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
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

            <Text>TouraSSist</Text>
          </div>
        </Header>
      }
    >
      <Mymap />
    </AppShell>
  );
}
