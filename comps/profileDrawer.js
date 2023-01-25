import { useState } from "react";
import {
  Avatar,
  Box,
  UnstyledButton,
  Drawer,
  Divider,
  Space,
  Group,
  Flex,
  Text,
  Button,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import { profileOpenedState } from "../libs/atoms";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconUser,
  IconCashBanknote,
  IconPlane,
  IconHeartHandshake,
} from "@tabler/icons";

const links = [
  { label: "Account Info", icon: <IconUser size={20} /> },
  { label: "Bank Info", icon: <IconCashBanknote size={20} /> },
  { label: "Trips", icon: <IconPlane size={20} /> },
  { label: "Referral Program", icon: <IconHeartHandshake size={20} /> },
];

export default function ProfileDrawer() {
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [user, setUser] = useLocalStorage({ key: "user" });

  const items = links.map((item) => (
    <UnstyledButton
      key={item.label}
      w="100%"
      sx={{
        fontSize: "14px",
        borderRadius: "5px",
        padding: "7px 10px",
        fontWeight: 100,
        border: "1px solid rgba(0, 0, 0, 0)",
        "&:hover": {
          backgroundColor: "rgba(16, 46, 74, 0.32)",
          borderTop: "1px solid rgba(16, 46, 74, 0.32)",
          borderBottom: "1px solid rgba(16, 46, 74, 0.32)",
          boxShadow: "0 0 0 1px rgba(16, 46, 74, 0.32)",
          color: "#fff",
          fontWeight: 500,
        },
      }}
    >
      <Group spacing={0} pl={5}>
        {item.icon}
        <Box px={10} opacity={0.5}>
          |
        </Box>
        {item.label}
      </Group>
    </UnstyledButton>
  ));

  return (
    <Drawer
      zIndex={100}
      opened={profileOpened}
      overlayOpacity={0}
      padding="xl"
      size="md"
      withCloseButton={false}
      onClose={() => setProfileOpened(false)}
    >
      <Space h={120} />
      <Flex direction="column" gap="xs" mb={10}>
        <Avatar
          size={70}
          src={user?.providerData[0].photoURL}
          radius="xl"
          mr={7}
          mx="auto"
        />
        <Text ta="center" fz="xs">
          {user?.providerData[0].email}
        </Text>
        <Divider w="70%" mx="auto" opacity={0.3} />
      </Flex>
      <Group spacing={8} px={30}>
        {items}
      </Group>
      <Divider w="70%" mx="auto" opacity={0.3} mt={10} />
      <Button
        variant="subtle"
        w="60%"
        ml="20%"
        mt={10}
        sx={{
          color: "#000",
          backgroundColor: "rgba(255, 255, 255, 0.012)",
          "&:hover": {
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        Logout
      </Button>
    </Drawer>
  );
}
