import {} from "react";
import { useRecoilState } from "recoil";
import { Modal, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { searchOpenedState } from "../libs/atoms";

export default function SearchModal() {
  const [searchOpened, setSearchOpened] = useRecoilState(searchOpenedState);

  return (
    <Modal
      opened={searchOpened}
      onClose={() => setSearchOpened(false)}
      withCloseButton={false}
      overlayColor="rgba(0,0,0,0)"
      overlayBlur={10}
      padding={0}
      radius="xl"
    >
      <TextInput
        radius="xl"
        size="xl"
        icon={<IconSearch />}
        placeholder="Search Trips..."
        styles={({ theme }) => ({
          input: {
            ":focus": {
              outline: "none",
              border: "none",
            },
            "::placeholder": {
              fontStyle: "italic",
            },
          },
        })}
      />
    </Modal>
  );
}
