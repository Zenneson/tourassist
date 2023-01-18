import { Button, CloseButton, Box } from "@mantine/core";
import { IconMenuOrder, IconX } from "@tabler/icons";

export default function Page() {
  return (
    <div>
      <Button.Group
        sx={{
          borderRadius: "5px",
        }}
      >
        <Button
          variant="gradient"
          gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
          sx={{
            padding: "0 10px",
            color: "rgba(255, 255, 255, 0.5)",
            opacity: "0.7",
          }}
          styles={(theme) => ({
            root: {
              "&:hover": {
                opacity: "1",
                transition: "background 0.2s ease-in-out",
              },
            },
          })}
        >
          <IconMenuOrder size={16} />
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
          overflow="hidden"
          fullWidth
          fw={400}
          sx={{
            maxWidth: "198px",
            fontSize: "12px",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          Country Name
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
          sx={{
            padding: "0",
          }}
          styles={(theme) => ({
            label: {
              padding: "0 7px",
              "&:hover": {
                background: "#ed0000",
                borderRadius: "0 5px 5px 0",
                transition: "background 0.2s ease-in-out",
              },
            },
          })}
        >
          <IconX size={18} />
        </Button>
      </Button.Group>
    </div>
  );
}
