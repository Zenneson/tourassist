import { Avatar, Grid, Col, Text, Button } from "@mantine/core";
import { IconMenuOrder, IconTrash } from "@tabler/icons";

export default function Page({ name, region }) {
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
      <Col span="content">
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
          styles={({ theme }) => ({
            placeholder: {
              border: "1px solid rgba(255, 255, 255, 0.027)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          })}
        >
          <IconMenuOrder size={20} />
          {/* <IconTrash size={20} /> */}
        </Avatar>
      </Col>
    </Grid>
  );
}
