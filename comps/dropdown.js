import { useState } from "react";
import { Center, Drawer, SegmentedControl } from "@mantine/core";

export default function DropDown({ dropDownOpened, setDropDownOpened }) {
  const [value, setValue] = useState("starting");

  return (
    <>
      <Drawer
        opened={dropDownOpened}
        position="top"
        size={"100%"}
        withCloseButton={false}
        onClose={() => setDropDownOpened(false)}
        styles={{
          content: {
            overflow: "hidden",
            background: "rgba(11, 12, 13, 0.95)",
          },
          header: {
            background: "transparent",
          },
        }}
      ></Drawer>
    </>
  );
}
