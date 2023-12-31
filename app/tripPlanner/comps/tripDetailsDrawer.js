import {
  Badge,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconChevronRight,
  IconListNumbers,
  IconLocationPin,
  IconTags,
  IconTicket,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "../styles/tripPlanner.module.css";
import PlaceTimeline from "./placeTimeline";

export default function TripDetailsDrawer(props) {
  const {
    showTripInfo,
    setShowTripInfo,
    dark,
    placeData,
    roundTrip,
    startLocale,
    splitLocale,
    travelDates,
    travelers,
  } = props;

  const [tripTypes, setTripTypes] = useSessionStorage({
    key: "tripTypes",
    defaultValue: [],
  });

  return (
    <Drawer
      classNames={{ content: classes.tripDetailsDrawer }}
      zIndex={1}
      position="right"
      opened={showTripInfo}
      withCloseButton={false}
      withOverlay={false}
      lockScroll={false}
      size={350}
      padding={50}
      trapFocus={false}
      onClose={() => setShowTripInfo(false)}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Group
        gap={7}
        mt={50}
        mb={20}
        ml={-20}
        justify="space-between"
        style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}
      >
        <Flex opacity={0.08} gap={5}>
          <IconListNumbers size={18} />
          <Title order={6}>Trip Details</Title>
        </Flex>
        <Tooltip label="Close Panel">
          <Button
            rightSection={<IconChevronRight stroke={4} size={18} />}
            className={classes.tripDetailsCloseBtn}
            variant="transparent"
            ta={"center"}
            c={dark ? "#fff" : "#000"}
            onClick={() => setShowTripInfo(false)}
          >
            CLOSE
          </Button>
        </Tooltip>
      </Group>
      <Flex align={"center"} gap={10} mb={10}>
        <IconLocationPin size={18} opacity={0.3} />
        <Divider label="Trip Locations" labelPosition="left" w={"100%"} />
      </Flex>
      <Stack gap={3}>
        <PlaceTimeline
          dark={dark}
          placeData={placeData}
          roundTrip={roundTrip}
          startLocale={startLocale}
          splitLocale={splitLocale}
        />
        {travelDates && (
          <>
            {startLocale && travelDates && (
              <Flex align={"center"} gap={10}>
                <IconTicket size={18} opacity={0.3} />
                <Divider
                  label="Trip Info."
                  labelPosition="left"
                  my={10}
                  w={"100%"}
                />
              </Flex>
            )}
            <Badge
              classNames={{ root: classes.badge }}
              variant="dot"
              size="xs"
              color="green.9"
            >
              {dayjs(travelDates).format("LL")}
            </Badge>
            <Badge
              classNames={{ root: classes.badge }}
              variant="dot"
              size="xs"
              color="green.6"
            >
              {roundTrip ? "Round Trip" : "One Way"}
            </Badge>
            <Badge
              classNames={{ root: classes.badge }}
              variant="dot"
              size="xs"
              color="green.3"
            >
              {travelers === 1 ? "Solo Traveler" : travelers + " Travelers"}
            </Badge>
          </>
        )}
        {tripTypes.length > 0 && (
          <Flex align={"center"} gap={10}>
            <IconTags size={18} opacity={0.3} />
            <Divider
              label="Trip Tags"
              labelPosition="left"
              w={"100%"}
              my={10}
            />
          </Flex>
        )}
        {Array.isArray(tripTypes) &&
          tripTypes.map((type, index) => {
            const colorNum = 7 - index;
            return (
              <Badge
                classNames={{ root: classes.badge }}
                key={index}
                variant="dot"
                size="xs"
                color={`blue.${colorNum}`}
              >
                {type}
              </Badge>
            );
          })}
      </Stack>
    </Drawer>
  );
}
