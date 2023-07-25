import {} from "react";
import { Modal, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function SearchModal(props) {
  const { searchOpened, setSearchOpened } = props;
  return (
    <Modal
      zIndex={9999}
      opened={searchOpened}
      onClose={() => setSearchOpened(false)}
      withCloseButton={false}
      padding={0}
      radius="xl"
      styles={(theme) => ({
        overlay: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? "rgba(0,0,0,0.5)"
              : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(9px)",
        },
      })}
    >
      <TextInput
        radius="xl"
        size="xl"
        variant={"filled"}
        icon={<IconSearch />}
        placeholder="Search Trips..."
        styles={({ theme }) => ({
          input: {
            "::placeholder": {
              fontStyle: "italic",
            },
          },
        })}
      />
    </Modal>
  );
}
