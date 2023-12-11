import { useComputedColorScheme } from "@mantine/core";
import { Spotlight } from "@mantine/spotlight";
import "@mantine/spotlight/styles.css";
import { IconSearch, IconSlashes } from "@tabler/icons-react";
import { useStateContext } from "../../libs/context";
import classes from "./styles/searchModal.module.css";

export default function SearchModal() {
  const { setSearchOpened } = useStateContext();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  return (
    <Spotlight
      classNames={{ content: classes.searchRoot, search: classes.textInput }}
      actions={[]}
      radius={"xl"}
      onSpotlightClose={() => setSearchOpened(false)}
      transitionProps={{
        transition: "slide-down",
      }}
      overlayProps={{
        blur: 10,
        backgroundOpacity: 0.3,
        color: dark ? "rgb(0,0,0)" : "rgb(255,255,255)",
      }}
      searchProps={{
        leftSection: (
          <IconSlashes
            opacity={0.2}
            style={{
              marginLeft: 10,
            }}
          />
        ),
        rightSection: <IconSearch />,
        rightSectionWidth: 70,
        placeholder: "Search Trips...",
      }}
    />
  );
}
