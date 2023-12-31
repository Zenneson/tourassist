"use client";
import { Text, Timeline } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import classes from "../styles/placeTimeline.module.css";

export default function PlaceTimeline(props) {
  const { dark, placeData, roundTrip, startLocale, splitLocale } = props;

  if (!startLocale) return null;

  const renderTimelineItem = (place, region, index) => (
    <Timeline.Item
      title={place}
      key={place + index}
      lineVariant="dashed"
      bullet={<IconMapPin />}
    >
      <Text c={dark ? "gray.0" : "dark.9"} fz={10}>
        {region}
      </Text>
    </Timeline.Item>
  );

  const startCity = startLocale ? splitLocale(startLocale)[0] : "";
  const startRegion = startLocale ? splitLocale(startLocale)[1] : "";

  const timelineItems = placeData.map((place, index) =>
    renderTimelineItem(place.place, place.region, index)
  );

  // Check if the last place in placeData is the same as the start city
  const isLastPlaceStartCity =
    placeData.length > 0 &&
    placeData[placeData.length - 1].place === startCity &&
    placeData[placeData.length - 1].region === startRegion;

  return (
    <Timeline
      lineWidth={3}
      bulletSize={20}
      classNames={{
        item: classes.timelineItem,
        itemTitle: classes.timelineTitle,
      }}
    >
      {startCity && renderTimelineItem(startCity, startRegion, "start")}
      {timelineItems}
      {roundTrip &&
        !isLastPlaceStartCity &&
        renderTimelineItem(startCity, startRegion, "end")}
    </Timeline>
  );
}
