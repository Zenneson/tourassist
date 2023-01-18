import { Avatar, Grid, Col, Text, Button } from "@mantine/core";
import { IconMapPin, IconMenuOrder, IconTrash } from "@tabler/icons";

export default function Page() {
  return (
    <Button
      p={0}
      size="xl"
      radius="xl"
      variant="gradient"
      gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
      sx={({ theme }) => ({
        boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.02)",
        borderRadius: "100px",
        transition: "all 200ms ease-in-out",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          transform: "scale(1.02)",
          boxShadow: "0 0 10px 0 rgba(255, 255, 255, 0.05)",
        },
      })}
    >
      <Grid
        align="center"
        sx={{
          borderRadius: "100px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Col span="content">
          <Avatar variant="filled" radius="xl" color="#00E8FC">
            SS
          </Avatar>
        </Col>
        <Col span="auto">
          <Text size="md" fw={700}>
            Silver Spring
          </Text>
          <Text size="xs" sx={{ color: "rgba(255,255,255,0.3)" }}>
            Maryland, United States
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
            <IconMapPin size={21} />
            {/* <IconTrash size={21} /> */}
            {/* <IconMenuOrder size={21} /> */}
          </Avatar>
        </Col>
      </Grid>
    </Button>
  );
}
