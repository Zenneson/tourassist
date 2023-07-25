import { useMantineTheme, Avatar, Grid, Text } from "@mantine/core";
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
  const theme = useMantineTheme();
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
          {...provided.draggableProps}
          ref={provided.innerRef}
          align="center"
          sx={{
            marginTop: "2px",
            borderRadius: "100px",
            userSelect: "none",
            transition: "all 200ms ease",
            cursor: "pointer",
            "&:hover": {
              background:
                theme.colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.05)",
            },
            "&:active": {
              transform: "scale(1.02)",
              backgroundColor:
                theme.colorScheme === "dark" ? "#121212" : "#fff",
              boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {places.length > 1 ? (
            <Grid.Col
              {...provided.dragHandleProps}
              span="content"
              sx={{
                padding: "0 0 2px 10px",
                opacity: 0.2,
                cursor: "grab",
                "&:hover": {
                  opacity: 1,
                },
                "&:active": {
                  cursor: "grabbing",
                },
              }}
            >
              <IconGripVertical size={15} />
            </Grid.Col>
          ) : (
            <Grid.Col
              {...provided.dragHandleProps}
              span="content"
              sx={{
                padding: 0,
                opacity: 0.2,
              }}
            ></Grid.Col>
          )}
          <Grid.Col
            span="content"
            sx={{
              padding: "0 0 0 5px",
            }}
          >
            <Avatar
              variant="gradient"
              gradient={
                theme.colorScheme === "dark"
                  ? { from: "#004585", to: "#00376b", deg: 180 }
                  : { from: "#a30326", to: "#85001d", deg: 180 }
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
          <Grid.Col span="content">
            {/* Delete Place Button */}
            <Avatar
              radius="xl"
              variant="outline"
              onClick={() => {
                handleRemove();
              }}
              styles={({ theme }) => ({
                root: {
                  cursor: "pointer",
                  opacity: 0.35,
                  transition: "all 200ms ease",
                  "&:hover": {
                    opacity: 1,
                  },
                },
                placeholder: {
                  background: "rgba(255, 0, 0, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0)",
                },
              })}
            >
              <IconTrash size={17} color="rgba(255, 0, 0, 0.8)" />
            </Avatar>
          </Grid.Col>
        </Grid>
      )}
    </Draggable>
  );
}
