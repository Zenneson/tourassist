import {} from "react";
import {
  ActionIcon,
  Box,
  Badge,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Title,
  Text,
  Space,
  Stack,
  CardSection,
  Rating,
} from "@mantine/core";
import {
  IconPlane,
  IconMapPin,
  IconPlaneDeparture,
  IconBuildingSkyscraper,
} from "@tabler/icons";

export default function Purchase() {
  return (
    <>
      <Space h={150} />
      <Center>
        <Box
          p={20}
          mb={20}
          radius={3}
          bg={"rgba(0,0,0,0.3)"}
          // bg={"rgba(255,255,255,0.3)"}
          w={"70%"}
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
            <Group spacing={5} mr={5}>
              <Badge variant="outline" color="gray">
                Silver Spring
              </Badge>
              →
              <Badge variant="outline" color="gray">
                Mexico
              </Badge>
              <Badge variant="filled" color={"blue.7"} ml={10} fz={8}>
                VIEW ALTS
              </Badge>
            </Group>
          </Group>
          <Divider
            opacity={0.4}
            mt={25}
            mb={10}
            size={"sm"}
            label={
              <Text fw={700} fz={15} fs={"italic"}>
                <IconPlaneDeparture size={17} /> FLIGHTS
              </Text>
            }
          />
          <Card w={350} p={"lg"} py={15}>
            <Group position="apart">
              <Badge size={"sm"}>American</Badge>
              <Title order={2} mr={5} ta={"right"} color="green.3">
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
            opacity={0.4}
            mt={25}
            mb={10}
            size={"sm"}
            label={
              <Text fw={700} fz={15} fs={"italic"}>
                <IconBuildingSkyscraper size={17} /> HOTELS
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
              <IconMapPin size={12} /> Av Revolucion 333, Tacubaya, Mexico City
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
              <Title order={2} ta={"right"} color="green.3">
                $111
              </Title>
            </Group>
          </Card>
        </Box>
      </Center>
    </>
  );
}
