import { Button, CloseButton } from "@mantine/core";
import { IconMenuOrder } from "@tabler/icons";

export default function Page() {
  return (
    <>
      <Button.Group
        sx={{
          borderRadius: "5px",
          marginBottom: "15px",
        }}
      >
        <Button
          variant="gradient"
          gradient={{ from: "#001930", to: "#001427", deg: 180 }}
          sx={{
            padding: "0 10px",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <IconMenuOrder size={16} />
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: "#001930", to: "#001427", deg: 180 }}
          overflow="hidden"
          fullWidth
          fw={400}
          sx={{
            maxWidth: "198px",
            fontSize: "12px",
            color: "#fff",
          }}
        >
          Country Name
        </Button>
        <Button
          color="red"
          sx={{
            background: "#001427",
            padding: "0 5px",
          }}
        >
          <CloseButton />
        </Button>
      </Button.Group>
    </>
  );
}
