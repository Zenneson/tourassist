"use client";
import { IconMapPin } from "@tabler/icons-react";
import { Text, Timeline } from "@mantine/core";
import classes from "./styles/placeTimeline.module.css";

export default function PlaceTimeline(props) {
  const { dark, placeData, roundTrip, startLocale, splitLocale } = props;

  const startCity = splitLocale(startLocale)[0];
  const startRegion = splitLocale(startLocale)[1];

  if (!roundTrip && !startLocale) {
    return (
      <Timeline
        lineWidth={3}
        bulletSize={20}
        classNames={{
          item: classes.timelineItem,
          itemTitle: classes.timelineTitle,
        }}
      >
        {placeData.map((place, index) => (
          <Timeline.Item
            title={place.place}
            lineVariant="dashed"
            key={place.place + index}
            bullet={<IconMapPin />}
          >
            <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
              {place.region}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }

  if (!roundTrip && startCity) {
    return (
      <Timeline
        lineWidth={3}
        bulletSize={20}
        classNames={{
          item: classes.timelineItem,
          itemTitle: classes.timelineTitle,
        }}
      >
        <Timeline.Item
          title={startCity}
          lineVariant="dashed"
          bullet={<IconMapPin />}
        >
          <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
            {startRegion}
          </Text>
        </Timeline.Item>
        {placeData.map((place, index) => (
          <Timeline.Item
            title={place.place}
            key={place.place + index}
            lineVariant="dashed"
            bullet={<IconMapPin />}
          >
            <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
              {place.region}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }

  if (roundTrip && startCity) {
    return (
      <Timeline
        lineWidth={3}
        bulletSize={20}
        classNames={{
          item: classes.timelineItem,
          itemTitle: classes.timelineTitle,
        }}
      >
        <Timeline.Item
          title={startCity}
          lineVariant="dashed"
          bullet={<IconMapPin />}
        >
          <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
            {startRegion}
          </Text>
        </Timeline.Item>
        {placeData.map((place, index) => (
          <Timeline.Item
            title={place.place}
            key={place.place + index}
            lineVariant="dashed"
            bullet={<IconMapPin />}
          >
            <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
              {place.region}
            </Text>
          </Timeline.Item>
        ))}
        <Timeline.Item
          title={startCity}
          lineVariant="dashed"
          bullet={<IconMapPin />}
        >
          <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
            {startRegion}
          </Text>
        </Timeline.Item>
      </Timeline>
    );
  }
}
