import {} from "react";
import { useToggle } from "@mantine/hooks";
import { Button, Divider, Text } from "@mantine/core";

export default function TripDescription() {
  const [readmore, toggle] = useToggle(["closed", "open"]);

  return (
    <>
      <Text lineClamp={readmore === "closed" && 5}>
        <p>
          Are you ready to join me on an adventure of a lifetime? Together, we
          can make my long-held dream of visiting New York City a reality! I
          have always been captivated by the magic of the Big Apple, and I am
          excited to explore its vibrant neighborhoods, iconic landmarks, and
          diverse cultural experiences.
        </p>

        <p>
          With your generous support, I will be able to travel to New York City
          and fully immerse myself in its unique atmosphere. I cannot wait to
          see the towering skyscrapers of Manhattan, stroll through Central
          Park, marvel at the Statue of Liberty, and explore the trendy
          neighborhoods of Brooklyn. From Broadway shows to food tours, I plan
          on experiencing all that this incredible city has to offer.
        </p>

        <p>
          I will document every moment of my journey, from the sights and sounds
          to the people I meet along the way. Your contributions will allow me
          to capture precious memories and share them with my amazing
          supporters, so you can feel like you are right there with me,
          experiencing the adventure in real-time.
        </p>

        <p>
          But this trip is not just about fulfilling a dream or checking an item
          off my bucket list. It&apos;s about creating a life-changing
          experience that will stay with me forever. I believe that travel opens
          our minds, broadens our horizons, and connects us with people and
          cultures from around the world. By supporting me on this journey, you
          are not only helping me achieve my dream but also contributing to a
          greater cause.
        </p>

        <p>
          So, please consider joining me on this unforgettable adventure. Your
          kind contributions will not only enable me to travel to New York City
          but also create a unique, transformative experience that will inspire
          me and those around me. Thank you for believing in my journey and for
          making this dream come true!
        </p>
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
