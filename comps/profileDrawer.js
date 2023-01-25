import {
  Avatar,
  UnstyledButton,
  Drawer,
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
        fontWeight: 400,
        color: "#fff",
        border: "1px solid rgba(0, 0, 0, 0)",
        transition: "all 200ms ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.32)",
          borderTop: "1px solid rgba(0, 0, 0, 0.32)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.32)",
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.32)",
          color: "#fff",
          fontWeight: 600,
        },
      }}
    >
      <Group spacing={0} pl={5}>
        <Space w={15} />
        {item.icon}
        <Space w={10} />
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
      </Flex>
      <Group
        spacing={8}
        py={10}
        mx={30}
        sx={{
          borderRadius: "5px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {items}
      </Group>
      <Button
        variant="subtle"
        w="60%"
        ml="20%"
        mt={10}
        sx={{
          color: "#000",
          backgroundColor: "rgba(255, 255, 255, 0.012)",
          transition: "all 200ms ease",
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
