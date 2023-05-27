import { useState } from "react";
import {
  Box,
  Badge,
  Card,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  Image,
  Title,
  Text,
  Space,
  Stack,
  Rating,
  Button,
} from "@mantine/core";
import {
  IconPlane,
  IconMapPin,
  IconPlaneDeparture,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconHourglass,
} from "@tabler/icons";

export default function Purchase() {
  const [viewAlts, setViewAlts] = useState(false);

  return (
    <>
      <Space h={150} />
      <Center>
        <Box w={"70%"} maw={1600}>
          <Group w={"100%"} position="apart" mb={20}>
            <Box w={"60%"}>
              <Title order={4} opacity={0.3} fs={"italic"}>
                Help me raise money to go on a Music Tour
              </Title>
              <Box
                mt={10}
                pl={12}
                pt={1}
                pb={10}
                sx={{
                  borderLeft: "2px solid rgba(255,255,255,0.035)",
                  cursor: "default",
                }}
              >
                <Group fz={11} mt={5} ml={2}>
                  <Text color="blue.2">Silver Spring</Text>→
                  <Text color="blue.2">Mexico</Text>→
                  <Text color="blue.2">Grenada</Text>→
                  <Text color="blue.2">Silver Spring</Text>
                </Group>
                <Flex align={"center"} gap={15} fz={13} mt={5}>
                  <Group spacing={5}>
                    <IconCalendarEvent size={15} opacity={0.2} /> May 5, 2024{" "}
                  </Group>
                  <Group spacing={5}>
                    <IconHourglass size={15} opacity={0.2} /> 45 Days Left
                  </Group>
                </Flex>
              </Box>
            </Box>
            <Box
              ta={"right"}
              pl={25}
              pr={5}
              pb={25}
              pt={5}
              sx={{
                borderRadius: "0 0 0 5px",
                borderBottom: "2px solid rgba(255,255,255,0.025)",
                borderLeft: "2px solid rgba(255,255,255,0.025)",
              }}
            >
              <Title opacity={0.2} fz={50}>
                $1,234.56
              </Title>
              <Text size="xs" color="dimmed" mt={-5}>
                AVIABLE FUNDS
              </Text>
            </Box>
          </Group>
          <Box
            p={20}
            mb={20}
            radius={3}
            bg={"rgba(0,0,0,0.3)"}
            // bg={"rgba(255,255,255,0.3)"}
            w={"100%"}
            sx={{
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
                  borderLeft: "5px solid rgba(150,150,150,0.1)",
                }}
              >
                <Title
                  order={2}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  MEXICO
                </Title>
                <Text size="xs" color="dimmed">
                  Mexico, Region
                </Text>
              </Stack>
              <Flex gap={5} mr={5} mt={viewAlts ? 0 : -28}>
                <Stack pt={2} spacing={5}>
                  <Group spacing={7}>
                    {viewAlts && <Checkbox mr={5} checked color="gray" />}
                    <Badge variant="outline" color="gray" size="xs">
                      Silver Spring
                    </Badge>
                    <Text opacity={0.2}>→</Text>
                    <Badge variant="outline" color="gray" size="xs">
                      Mexico
                    </Badge>
                  </Group>
                  {viewAlts && (
                    <Group spacing={7}>
                      <Checkbox mr={5} color="gray" />
                      <Badge variant="outline" color="gray" size="xs">
                        Silver Spring
                      </Badge>
                      <Text opacity={0.2}>→</Text>
                      <Badge variant="outline" color="gray" size="xs">
                        Grenada
                      </Badge>
                    </Group>
                  )}
                </Stack>
                <Box
                  ml={5}
                  pl={2}
                  sx={{
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Button
                    variant="light"
                    radius={"xl"}
                    ml={5}
                    fz={8}
                    px={15}
                    compact
                    onClick={() => setViewAlts(!viewAlts)}
                  >
                    {viewAlts ? "HIDE" : "VIEW"} ALTS
                  </Button>
                </Box>
              </Flex>
            </Group>
            <Divider
              mt={15}
              color="dark"
              mb={10}
              size={"sm"}
              label={
                <Text fw={700} fz={14} fs={"italic"}>
                  <IconPlaneDeparture size={15} /> FLIGHTS
                </Text>
              }
            />
            <Card w={350} p={"lg"} py={15}>
              <Group position="apart">
                <Badge size={"sm"}>American</Badge>
                <Title order={2} mr={5} ta={"right"} color="lime">
                  $617
                </Title>
              </Group>
              <Divider
                mt={5}
                labelPosition="center"
                label={<Text fw={700}>16h 40m ( 1 stop )</Text>}
                w={"100%"}
              />
              <Group position="apart" px={10} mt={10} spacing={0}>
                <Box ta={"center"}>
                  <Title>DCA</Title>
                  <Text size="xs" color="dimmed">
                    6:30 AM
                  </Text>
                </Box>
                <Group pb={15} opacity={0.4}>
                  - <IconPlane size={20} /> -
                </Group>
                <Box ta={"center"}>
                  <Title>MEX</Title>
                  <Text size="xs" color="dimmed">
                    11:10 PM
                  </Text>
                </Box>
              </Group>
            </Card>
            <Divider
              mt={15}
              color="dark"
              mb={10}
              size={"sm"}
              label={
                <Text fw={700} fz={14} fs={"italic"}>
                  <IconBuildingSkyscraper size={15} /> HOTELS
                </Text>
              }
            />
            <Card w={350} p={"lg"} pb={20}>
              <Card.Section mb={10}>
                <Image src={"/img/intro/beach.jpg"} alt="Hotel Image" />
              </Card.Section>
              <Title order={6} lineClamp={1}>
                Hermoso alojamiento en Villa Cardiel Real Ibiza Playa del Carmen
              </Title>
              <Text size="xs" color="dimmed" lineClamp={1}>
                <IconMapPin size={12} /> Av Revolucion 333, Tacubaya, Mexico
                City
              </Text>
              <Divider
                mt={10}
                mb={5}
                labelPosition="center"
                label={<Rating defaultValue={4} color="blue" />}
                w={"100%"}
              />
              <Group position="apart">
                <Badge size={"md"}>1 King Bed</Badge>
                <Title order={2} ta={"right"} color="lime">
                  $111
                </Title>
              </Group>
            </Card>
          </Box>
        </Box>
      </Center>
    </>
  );
}
