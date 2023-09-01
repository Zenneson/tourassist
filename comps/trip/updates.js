import { useState } from "react";
import {
  useMantineColorScheme,
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
} from "@tabler/icons-react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../libs/firebase";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import UpdateContent from "./updatecontent";

export default function Updates(props) {
  const {
    setModalMode,
    tripData,
    user,
    updates,
    setUpdates,
    setCurrentUpdateId,
  } = props;
  const [currentUpdateTitle, setCurrentUpdateTtile] = useState("");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [deleteModal, setDeleteModal] = useState(false);
  const dark = colorScheme === "dark";
  const [showall, toggle] = useToggle(["hide", "show"]);
  const router = useRouter();

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
    const newUpdates = updates.filter(
      (update) => update.updateTitle !== currentUpdateTitle
    );
    notifications.show(updateDeletedStart);
    setDeleteModal(false);
    setUpdates(newUpdates);
    await updateDoc(
      doc(firestore, "users", user.email, "trips", tripData.tripId),
      { updates: newUpdates }
    );
    await router.replace(router.asPath);
    notifications.update(updateDeletedEnd);
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
        px={30}
        fz={14}
        gap={10}
      >
        {/* Show Update Modal Button  */}
        {user?.email === tripData.user && (
          <Menu closeOnItemClick={true}>
            <Menu.Target>
              <ActionIcon
                variant="Transparent"
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
                icon={<IconPencil size={14} />}
                onClick={() => {
                  setCurrentUpdateId(update.updateId);
                  updateTrip();
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                fz={12}
                icon={<IconTrash size={14} />}
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
            spacing={0}
            sx={{
              borderRadius: "3px",
              overflow: "hidden",
              boxShadow: `0 2px 5px 0 rgba(0,0,0,0.1)`,
            }}
          >
            <Text
              w={"100%"}
              bg={dark ? "blue.9" : "blue.4"}
              ta={"center"}
              py={5}
              fw={700}
              fz={12}
              sx={{
                zIndex: 1,
                textTransform: "uppercase",
                boxShadow: "0 5px 5px 0 rgba(0,0,0,0.15)",
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
              <Center mt={15}>
                <Tooltip
                  label={"Share Update"}
                  position="bottom"
                  openDelay={800}
                >
                  <ActionIcon variant="transparent" size={"md"}>
                    <IconShare size={30} />
                  </ActionIcon>
                </Tooltip>
              </Center>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                <IconBrandFacebook />
              </Menu.Item>
              <Menu.Item>
                <IconBrandInstagram />
              </Menu.Item>
              <Menu.Item>
                <IconBrandTiktok />
              </Menu.Item>
              <Menu.Item>
                <IconBrandTwitter />
              </Menu.Item>
              <Menu.Item>
                <IconBrandWhatsapp />
              </Menu.Item>
              <Menu.Item>
                <IconSourceCode />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Flex direction={"column"} w={"85%"}>
          <Box
            mx={"5%"}
            py={5}
            pl={20}
            sx={{
              borderLeft: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <Title order={3}>{update.updateTitle}</Title>
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
              compact
              size="xs"
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
        padding={"xl"}
        size={"auto"}
        zIndex={130}
        centered
        withCloseButton={false}
        opened={deleteModal}
        onClose={setDeleteModal}
        styles={(theme) => ({
          header: {
            backgroundColor: "transparent",
          },
          content: {
            backgroundColor: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          },
          overlay: {
            backgroundColor: dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(9px)",
          },
        })}
      >
        <Text fz={14} ta={"center"} mb={10}>
          Are you sure you want to delete <br />
          <Text
            fw={700}
            sx={{
              textTransform: "uppercase",
            }}
            span
          >
            {currentUpdateTitle}
          </Text>{" "}
          ?
        </Text>
        <Group grow spacing={10}>
          <Button
            variant="filled"
            size="xs"
            color="green.9"
            opacity={0.2}
            sx={{
              "&:hover": {
                opacity: 1,
              },
            }}
            onClick={() => {
              deleteUpdateByTitle();
            }}
          >
            <IconCheck stroke={4} />
          </Button>
          <Button
            variant="filled"
            size="xs"
            color="red.9"
            opacity={0.2}
            sx={{
              "&:hover": {
                opacity: 1,
              },
            }}
            onClick={() => setDeleteModal(false)}
          >
            <IconX stroke={4} />
          </Button>
        </Group>
      </Modal>
    </>
  );
}
