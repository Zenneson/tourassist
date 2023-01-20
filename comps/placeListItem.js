import { Avatar, Grid, Col, Text } from "@mantine/core";
import { IconMenuOrder, IconTrash } from "@tabler/icons";
import { atom, useRecoilState } from "recoil";
import { buttonModeState } from "./sidebar";
import { placeListState } from "../comps/Mymap";

export default function Page({ name, region }) {
  const [places, setPlaces] = useRecoilState(placeListState);
  const handleRemove = () => {
    setPlaces(places.filter((place) => place.name !== name));
  };

  return (
    <Grid
      align="center"
      sx={{
        marginTop: "2px",
        borderRadius: "100px",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 200ms ease",
        "&:hover": {
          background: "rgba(0, 0, 0, 0.1)",
        },
        "&:active": {
          transform: "scale(1.02)",
        },
      }}
    >
      {places.length > 1 && (
        <Col
          span="content"
          sx={{
            padding: "0 0 0 10px",
            opacity: 0.2,
          }}
        >
          <IconMenuOrder size={15} />
        </Col>
      )}
      <Col
        span="content"
        sx={{
          padding: "0 0 0 5px",
        }}
      >
        <Avatar
          variant="gradient"
          gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
          radius="xl"
          color="#00E8FC"
        >
          {name[0]}
        </Avatar>
      </Col>
      <Col span="auto">
        <Text size="md" fw={700}>
          {name}
        </Text>
        <Text size="xs" sx={{ color: "rgba(255,255,255,0.3)" }}>
          {region}
        </Text>
      </Col>
      <Col span="content">
        <Avatar
          radius="xl"
          variant="outline"
          onClick={() => {
            handleRemove();
          }}
          styles={({ theme }) => ({
            root: {
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
      </Col>
    </Grid>
  );
}
