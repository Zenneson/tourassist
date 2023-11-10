import {
  useComputedColorScheme,
  Avatar,
  Grid,
  Text,
  ActionIcon,
} from "@mantine/core";
import classes from "./placeListItem.module.css";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { Draggable } from "react-beautiful-dnd";

export default function PlaceListItem(props) {
  const {
    index,
    place,
    region,
    draggableId,
    setListOpened,
    places,
    setPlaces,
  } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const handleRemove = () => {
    setPlaces(places.filter((location) => location.place !== place));
    if (places.length === 1) {
      setListOpened(false);
    }
  };

  const firstLastLetters = (str) => {
    let words = str.split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    let firstLetter = words[0][0].toUpperCase();
    let lastLetter = words[words.length - 1][0].toUpperCase();
    return firstLetter + lastLetter;
  };

  return (
    <Draggable key={place} draggableId={draggableId} index={index}>
      {(provided) => (
        <Grid
          className={classes.listGrid}
          {...provided.draggableProps}
          ref={provided.innerRef}
          align="center"
        >
          {places.length > 1 ? (
            <Grid.Col
              className={classes.listGridItem}
              {...provided.dragHandleProps}
              span="content"
            >
              <IconGripVertical size={15} />
            </Grid.Col>
          ) : (
            <Grid.Col
              {...provided.dragHandleProps}
              span="content"
              style={{
                padding: 0,
                opacity: 0.2,
              }}
            ></Grid.Col>
          )}
          <Grid.Col span="content" pl={10} pr={0}>
            <Avatar
              variant="gradient"
              gradient={
                dark
                  ? { from: "#004585", to: "#00376b", deg: 180 }
                  : { from: "#57b2cb", to: "#11a3cc", deg: 180 }
              }
              radius="xl"
              color="#00E8FC"
            >
              {firstLastLetters(place)}
            </Avatar>
          </Grid.Col>
          <Grid.Col span="auto">
            <Text size="md" fw={700}>
              {place}
            </Text>
            <Text size="xs" opacity={0.5}>
              {region}
            </Text>
          </Grid.Col>
          <Grid.Col span="content" pr={10}>
            {/* Delete Place Button */}
            <ActionIcon
              className={classes.deleteItem}
              size={"xl"}
              radius="xl"
              variant="outline"
              onClick={() => {
                handleRemove();
              }}
            >
              <IconTrash size={18} color="rgba(255, 0, 0, 0.8)" />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      )}
    </Draggable>
  );
}
