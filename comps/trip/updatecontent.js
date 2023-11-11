import {} from "react";
import { useToggle, useElementSize } from "@mantine/hooks";
import { Box, Button, Divider, Text } from "@mantine/core";

export default function UpdateContent(props) {
  const { content } = props;
  const [readmore, toggle] = useToggle(["closed", "open"]);
  const { ref, width, height } = useElementSize();

  return (
    <>
      <Text lineClamp={readmore === "closed" && 5}>
        <Box fz={12} ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
      </Text>
      {(height > 100 || readmore === "open") && (
        <Divider
          labelPosition="right"
          w={"100%"}
          mt={20}
          label={
            // Read More Toggle
            <Button
              size="compact-xs"
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
      )}
    </>
  );
}
