import {
  ActionIcon,
  Avatar,
  Grid,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Draggable } from "react-beautiful-dnd";
import { getNewCenter } from "../../../public/data/getNewCenter";
import classes from "../styles/placeListItem.module.css";

export default function PlaceListItem(props) {
  const {
    index,
    place,
    region,
    places,
    setPlaces,
    mapRef,
    draggableId,
    setListOpened,
    setLocationDrawer,
    goToLocation,
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
      return words[0][0]?.toUpperCase();
    }
    let firstLetter = words[0][0].toUpperCase();
    let lastLetter = words[words.length - 1][0].toUpperCase();
    return firstLetter + lastLetter;
  };

  const animationProps = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { duration: 0.32 },
  };

  const saveLocation = () => {
    return new Promise((resolve) => {
      places.map((location) => {
        if (location.label === place) {
          const coords =
            location.type === "country"
              ? getNewCenter(location).newCenter
              : location.coordinates;

          const aviLocation = {
            type: location.type,
            center: coords,
            country: location.country,
            label: location.label,
          };
          resolve(aviLocation);
        }
      });
    });
  };

  const goToSelected = async () => {
    const aviLocation = await saveLocation();
    if (aviLocation) {
      goToLocation(aviLocation, mapRef);
      setLocationDrawer(true);
    }
  };

  return (
    <Draggable key={place} draggableId={draggableId} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <motion.div {...animationProps}>
            <Grid className={classes.listGrid} align="center" my={3}>
              {places.length > 1 ? (
                <Grid.Col
                  className={classes.listGridItem}
                  {...provided.dragHandleProps}
                  span="content"
                  pt={5}
                  pl={17}
                  pr={0}
                >
                  <IconGripVertical size={17} />
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
              <Grid.Col span="content" pl={places.length === 1 ? 10 : 2} pr={0}>
                <Avatar
                  radius="xl"
                  variant="gradient"
                  gradient={
                    dark
                      ? { from: "#004585", to: "#00376b", deg: 180 }
                      : { from: "#93f3fc", to: "#00e8fc", deg: 180 }
                  }
                  onClick={goToSelected}
                >
                  {firstLastLetters(place)}
                </Avatar>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text size="xs" fw={700}>
                  {place}
                </Text>
                <Text size="xs" opacity={0.5}>
                  {place !== region && region}
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
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
