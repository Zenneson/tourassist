import { useState } from "react";
import { motion } from "framer-motion";
import {
  Space,
  Stepper,
  Title,
  Center,
  Box,
  Text,
  NumberInput,
  Group,
  Divider,
  Stack,
} from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons";

export default function TripPlannerPage() {
  const [active, setActive] = useState(0);

  const animation = {
    initial: { y: -50, duration: 500 },
    animate: { y: 0, duration: 500 },
    exit: { y: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const placeData = [
    {
      place: "New York",
      region: "NewYork, United States",
    },
    {
      place: "Grenada",
      region: "",
    },
  ];

  const places = placeData.map((place, index) => (
    <Box
      key={index}
      p={20}
      mb={20}
      sx={{
        borderRadius: 3,
        background: "rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.15)",
        boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
        borderLeft: "2px solid rgba(255,255,255,0.035)",
      }}
    >
      <Group position="apart">
        <Stack
          spacing={0}
          pl={10}
          pt={5}
          pb={10}
          sx={{
            borderLeft: "5px solid rgba(150,150,150,0.035)",
          }}
        >
          <Title
            order={4}
            fw={600}
            sx={{
              textTransform: "uppercase",
            }}
          >
            {place.place}
          </Title>
          <Text size="xs" color="dimmed">
            {place.region}
          </Text>
        </Stack>
        <div
          style={{
            width: "40%",
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        ></div>
      </Group>
      <Group position="right">
        <Text size={12} fs="italic" color="dimmed" mt={-25}>
          FLIGHT
        </Text>
        <div
          style={{
            marginTop: -25,
            width: "50%",
            border: "1px dotted rgba(0,0,0,0.4)",
          }}
        ></div>
        <NumberInput
          icon={<IconCurrencyDollar />}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""
          }
          stepHoldDelay={500}
          stepHoldInterval={100}
          precision={2}
          min={0}
          size="md"
          w={150}
          mb={20}
          variant="filled"
        />
      </Group>
      <Group position="right">
        <Text size={12} fs="italic" color="dimmed" mt={-25}>
          HOTEL
        </Text>
        <div
          style={{
            marginTop: -25,
            width: "50%",
            border: "1px dotted rgba(0,0,0,0.4)",
          }}
        ></div>
        <NumberInput
          icon={<IconCurrencyDollar />}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""
          }
          stepHoldDelay={500}
          stepHoldInterval={100}
          precision={2}
          min={0}
          size="md"
          w={150}
          mb={20}
          variant="filled"
        />
      </Group>
      <Divider mb={10} opacity={0.2} color="#000" />
    </Box>
  ));

  return (
    <>
      <Space h={150} />
      <Stepper
        active={active}
        onStepClick={setActive}
        orientation="vertical"
        pos="absolute"
        size="xs"
        right={0}
        mr={35}
        sx={{}}
        iconPosition="right"
      >
        <Stepper.Step
          label="Cost Calculator"
          description="Calculate all your trip costs"
        />
        <Stepper.Step label="Trip Details" description="Tell us your story" />
        <Stepper.Step
          label="Banking Info"
          description="Link a Payment Account"
        />
      </Stepper>
      <Center>
        <Box w="60%">
          {active === 0 && (
            <motion.div {...animation}>
              {places}
              <Group position="right">
                <Title order={1} opacity={0.25} fw={600}>
                  Trip Cost Total
                </Title>
                <NumberInput
                  icon={<IconCurrencyDollar />}
                  size="xl"
                  w={200}
                  mb={20}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  variant="filled"
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  precision={2}
                  min={0}
                />
              </Group>
            </motion.div>
          )}
          {active === 1 && (
            <motion.div {...animation}>
              <Title order={6} opacity={0.25} fw={600}>
                Trip Details
              </Title>
            </motion.div>
          )}
          {active === 2 && (
            <motion.div {...animation}>
              <Title order={6} opacity={0.25} fw={600}>
                Banking Info
              </Title>
            </motion.div>
          )}
        </Box>
      </Center>
    </>
  );
}
