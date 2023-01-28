import {
  ActionIcon,
  Center,
  Flex,
  Divider,
  Input,
  Group,
  Switch,
} from "@mantine/core";
import {
  IconUserCircle,
  IconKey,
  IconPencil,
  IconX,
  IconCheck,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconCirclePlus,
} from "@tabler/icons";
import { useLocalStorage } from "@mantine/hooks";
import { getAuth } from "firebase/auth";

export default function AccountInfo() {
  const [user, setUser] = useLocalStorage({ key: "user" });
  const auth = getAuth();

  return (
    <Center py={50}>
      <Flex direction="column" gap="xs">
        <Divider mb={25} label="Change E-mail or Password" />
        <Input
          variant="filled"
          placeholder={user?.providerData[0].email}
          icon={<IconUserCircle />}
          iconWidth={50}
          disabled
          w="100%"
          rightSection={
            <ActionIcon opacity={0.5} variant="subtle">
              <IconPencil size={18} />
            </ActionIcon>
          }
        />
        <Input
          variant="filled"
          placeholder="********"
          icon={<IconKey />}
          iconWidth={50}
          disabled
          w="100%"
          rightSection={
            <ActionIcon opacity={0.5} variant="subtle">
              <IconPencil size={18} />
            </ActionIcon>
          }
        />
        <Divider my={25} label="Email Notifications" mb={-15} />
        <Group grow align="stretch" fw={700} px={20}>
          <Flex direction="column" gap={0} align="flex-end">
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="left"
              label="General Newsletter"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="left"
              label="Campaign Creation"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="left"
              label="New Campaign Comment"
            />
          </Flex>
          <Flex direction="column" gap={0} align="flex-end">
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="left"
              label="Campaign Milestones"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="left"
              label="Campaign Ending Soon"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="left"
              label="Campaign Ended"
            />
          </Flex>
        </Group>
        <Divider my={25} label="Social Links" />
        <Flex direction="column" gap={10}>
          <Group grow spacing={10}>
            <Input
              icon={<IconBrandFacebook />}
              placeholder="/Facebook"
              variant="filled"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconBrandInstagram />}
              placeholder="@Instagram"
              variant="filled"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
          </Group>
          <Group grow spacing={10}>
            <Input
              icon={<IconBrandTiktok />}
              placeholder="@TikTok"
              variant="filled"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconBrandTwitter />}
              placeholder="@Twitter"
              variant="filled"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
          </Group>
        </Flex>
        <Divider mt={25} />
      </Flex>
    </Center>
  );
}
