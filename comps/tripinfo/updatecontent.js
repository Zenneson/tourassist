import {} from "react";
import { useToggle } from "@mantine/hooks";
import { Button, Divider, Text } from "@mantine/core";

export default function UpdateContent({ content }) {
  const [readmore, toggle] = useToggle(["closed", "open"]);

  return (
    <>
      <Text mt={10} lineClamp={readmore === "closed" && 5}>
        {content}
      </Text>
      <Divider
        labelPosition="right"
        w={"100%"}
        mt={20}
        label={
          // Read More Toggle
          <Button
            compact
            size="xs"
            radius={25}
            px={15}
            variant="subtle"
            color="gray.6"
            onClick={toggle}
          >
            {readmore === "closed" ? "Read More" : "Show Less"}
          </Button>
        }
      />
    </>
  );
}
