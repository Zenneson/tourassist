import { useState } from "react";
import { mutate } from "swr";
import {
  useComputedColorScheme,
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Text,
  Title,
  Group,
  Menu,
  Modal,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconSourceCode,
  IconBrandWhatsapp,
  IconShare,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconQrcode,
} from "@tabler/icons-react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import UpdateContent from "./updatecontent";
import classes from "./updates.module.css";

export default function Updates(props) {
  const {
    setModalMode,
    tripData,
    user,
    updates,
    setUpdates,
    setCurrentUpdateId,
    setIsMutating,
  } = props;
  const [currentUpdateTitle, setCurrentUpdateTtile] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [showall, toggle] = useToggle(["hide", "show"]);
  const router = useRouter();
  const { title } = router.query;

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const updateTrip = () => {
    setModalMode("editUpdate");
  };

  const deleteUpdate = () => {
    setDeleteModal(true);
  };

  const updateDeletedStart = {
    id: "updateDeleted",
    color: "green",
    title: "Deleting Update...",
    autoClose: false,
    loading: true,
    withCloseButton: false,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const updateDeletedEnd = {
    id: "updateDeleted",
    title: "Update Deleted",
    color: "green",
    icon: <IconCheck size={20} />,
    loading: false,
    autoClose: 3000,
    withCloseButton: true,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
  };

  const deleteUpdateByTitle = async () => {
    setIsMutating(true);
    try {
      const newUpdates = updates.filter(
        (update) => update.updateTitle !== currentUpdateTitle
      );

      notifications.show(updateDeletedStart);
      setDeleteModal(false);

      setUpdates(newUpdates);
      mutate(title, newUpdates, false);

      await updateDoc(
        doc(firestore, "users", user.email, "trips", tripData.tripId),
        { updates: newUpdates }
      );

      mutate(title).then(() => {
        setIsMutating(false); // Set mutation state back to false after mutation + revalidation
      });
      notifications.update(updateDeletedEnd);
    } catch (error) {
      console.error("Error deleting update:", error);
    }
  };

  const seperateDate = (dateString) => {
    if (!dateString) return { month: "", day: "", year: "" };
    const parts = dateString.split(" ");
    const month = parts[0];
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    return { month, day, year };
  };

  const updateBlocks = updates.map((update, index) => {
    const { month, day, year } = seperateDate(update.updateDate);
    return (
      <Flex
        className="pagePanel"
        key={index}
        pos={"relative"}
        radius={3}
        w={"85%"}
        mb={index === 0 ? 0 : 20}
        py={20}
        px={10}
        fz={14}
        gap={10}
      >
        {/* Show Update Modal Button  */}
        {user?.email === tripData.user && (
          <Menu closeOnItemClick={true} withArrow arrowSize={12} offset={3}>
            <Menu.Target>
              <ActionIcon
                variant="transparent"
                color={dark ? "#fff" : "#000"}
                pos={"absolute"}
                top={17}
                right={10}
              >
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                fz={12}
                leftSection={<IconPencil size={14} />}
                onClick={() => {
                  setCurrentUpdateId(update.updateId);
                  updateTrip();
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                fz={12}
                leftSection={<IconTrash size={14} />}
                onClick={() => {
                  setCurrentUpdateTtile(update.updateTitle);
                  deleteUpdate();
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
        <Flex direction={"column"} w={"10%"}>
          <Stack
            gap={0}
            style={{
              transform: "scale(0.9) translateY(-12px)",
              borderRadius: "3px",
              overflow: "hidden",
              boxShadow: `0 2px 5px 0 rgba(0,0,0,0.1)`,
            }}
          >
            <Text
              w={"100%"}
              bg={dark ? "blue.9" : "rgba(45, 200, 243, 0.7)"}
              ta={"center"}
              py={5}
              fw={700}
              fz={8}
              style={{
                zIndex: 1,
                textTransform: "uppercase",
                boxShadow: "0 5px 5px 0 rgba(0,0,0,0.1)",
              }}
            >
              {month}
            </Text>
            <Title
              order={3}
              ta={"center"}
              bg={dark ? "dark.5" : "gray.1"}
              pt={5}
            >
              {day}
            </Title>
            <Text
              w={"100%"}
              bg={dark ? "dark.5" : "gray.1"}
              ta={"center"}
              pb={7}
              fz={11}
            >
              {year}
            </Text>
          </Stack>
          <Menu>
            <Menu.Target>
              <Center>
                <Tooltip
                  classNames={{ tooltip: classes.toolTip }}
                  label={"Share Update"}
                  position="bottom"
                  openDelay={800}
                >
                  <ActionIcon
                    variant="transparent"
                    color={dark ? "gray.0" : "gray.5"}
                    size={"sm"}
                  >
                    <IconShare size={30} />
                  </ActionIcon>
                </Tooltip>
              </Center>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                <IconBrandFacebook size={20} />
              </Menu.Item>
              <Menu.Item>
                <IconBrandInstagram size={20} />
              </Menu.Item>
              <Menu.Item>
                <IconBrandTiktok size={20} />
              </Menu.Item>
              <Menu.Item>
                <IconBrandTwitter size={20} />
              </Menu.Item>
              <Menu.Item>
                <IconBrandWhatsapp size={20} />
              </Menu.Item>
              <Menu.Item>
                <IconSourceCode size={20} />
              </Menu.Item>
              <Menu.Item>
                <IconQrcode size={20} />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Flex direction={"column"} w={"85%"}>
          <Box
            pt={5}
            pl={10}
            style={{
              borderLeft: dark
                ? "2px solid rgba(255,255,255,0.05)"
                : "2px solid rgba(0,0,0,0.05)",
            }}
          >
            <Title order={5}>{update.updateTitle}</Title>
            <UpdateContent content={update.updateContent} />
          </Box>
        </Flex>
      </Flex>
    );
  });

  return (
    <>
      {showall === "hide"
        ? updateBlocks[updateBlocks.length - 1]
        : updateBlocks.reverse()}

      {updates.length > 1 && (
        <Divider
          labelPosition="right"
          w={"80%"}
          mt={10 && showall === "hide"}
          label={
            // Show all updates toggle
            <Button
              size="compact-xs"
              radius={25}
              px={15}
              variant="subtle"
              color="gray.6"
              onClick={toggle}
            >
              Show {showall === "hide" ? "All Updates" : "Last Update Only"}
            </Button>
          }
          mb={20}
        />
      )}
      <Modal
        className={classes.deleteModal}
        padding={"xl"}
        size={"auto"}
        zIndex={130}
        centered
        withCloseButton={false}
        opened={deleteModal}
        onClose={setDeleteModal}
      >
        <Text fz={14} ta={"center"} mb={10}>
          Are you sure you want to delete <br />
          <Text
            fw={700}
            style={{
              textTransform: "uppercase",
            }}
            span
          >
            {currentUpdateTitle}
          </Text>{" "}
          ?
        </Text>
        <Group grow gap={10}>
          <Button
            className={classes.deleteUpdate}
            variant="filled"
            size="xs"
            color="green.9"
            opacity={0.2}
            onClick={() => {
              deleteUpdateByTitle();
            }}
          >
            <IconCheck stroke={4} />
          </Button>
          <Button
            className={classes.deleteUpdate}
            variant="filled"
            size="xs"
            color="red.9"
            opacity={0.2}
            onClick={() => setDeleteModal(false)}
          >
            <IconX stroke={4} />
          </Button>
        </Group>
      </Modal>
    </>
  );
}
