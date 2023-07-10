import {} from "react";
import { Modal, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function SearchModal({ searchOpened, setSearchOpened }) {
  return (
    <Modal
      opened={searchOpened}
      onClose={() => setSearchOpened(false)}
      withCloseButton={false}
      padding={0}
      radius="xl"
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
