import { Modal, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "./searchModal.module.css";

export default function SearchModal(props) {
  const { searchOpened, setSearchOpened } = props;

  return (
    <Modal
      className={classes.searchModal}
      zIndex={9999}
      opened={searchOpened}
      onClose={() => setSearchOpened(false)}
      withCloseButton={false}
      padding={0}
      radius="xl"
    >
      <TextInput
        className={classes.textInput}
        radius="xl"
        size="xl"
        variant={"filled"}
        icon={<IconSearch />}
        placeholder="Search Trips..."
      />
    </Modal>
  );
}
