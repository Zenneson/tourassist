import {} from "react";
import { useToggle, useElementSize, useSessionStorage } from "@mantine/hooks";
import { Box, Button, Divider, Text } from "@mantine/core";

export default function TripDescription(props) {
  const [tripDesc, setTripDesc] = useSessionStorage({
    key: "tripDesc",
    defaultValue: "",
  });
  const [readmore, toggle] = useToggle(["closed", "open"]);
  const { ref, width, height } = useElementSize();

  return (
    <>
      <Text lineClamp={readmore === "closed" && 5}>
        <Box ref={ref} dangerouslySetInnerHTML={{ __html: tripDesc }} />
      </Text>
      {(height > 100 || readmore === "open") && (
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
      )}
    </>
  );
}