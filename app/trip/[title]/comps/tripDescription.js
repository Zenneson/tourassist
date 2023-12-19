"use client";
import { tripDescAtom } from "@libs/atoms";
import { Button, Divider, Text } from "@mantine/core";
import { useElementSize, useToggle } from "@mantine/hooks";
import { useAtomValue } from "jotai";

export default function TripDescription(props) {
  const tripDesc = useAtomValue(tripDescAtom);

  const [readmore, toggle] = useToggle(["closed", "open"]);
  const { ref, width, height } = useElementSize();
  const dark = props.dark;

  return (
    <>
      <Text
        fz={14}
        ref={ref}
        lineClamp={readmore === "closed" ? 5 : undefined}
        dangerouslySetInnerHTML={{ __html: tripDesc }}
      />
      {(height > 100 || readmore === "open") && (
        <Divider
          labelPosition="right"
          w={"100%"}
          mt={20}
          opacity={dark && 0.4}
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
