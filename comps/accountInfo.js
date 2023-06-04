import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Input,
  Group,
  Title,
  Switch,
  Divider,
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
  IconUserX,
} from "@tabler/icons";
import { useLocalStorage } from "@mantine/hooks";

export default function AccountInfo() {
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });

  return (
    <Box mt={15} pr={30} pos={"relative"} h={"calc(100vh - 110px)"}>
      <Flex direction="column" gap="xs" w={"100%"}>
        <Title
          order={6}
          opacity={0.4}
          pb={5}
          mb={10}
          sx={{
            textTransform: "uppercase",
          }}
        >
          Change E-mail or Password
        </Title>
        <Box
          pl={20}
          pt={10}
          pb={15}
          sx={{
            borderLeft: "3px solid rgba(204, 204, 204, 0.2)",
          }}
        >
          <Input
            variant="filled"
            placeholder={user?.providerData[0].email}
            icon={<IconUserCircle size={20} />}
            iconWidth={50}
            disabled
            mb={10}
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
            icon={<IconKey size={20} />}
            iconWidth={50}
            disabled
            w="100%"
            rightSection={
              <ActionIcon opacity={0.5} variant="subtle">
                <IconPencil size={18} />
              </ActionIcon>
            }
          />
        </Box>
        <Title
          order={6}
          mt={25}
          opacity={0.4}
          pb={5}
          mb={10}
          sx={{
            textTransform: "uppercase",
          }}
        >
          Social Links
        </Title>
        <Flex
          direction="column"
          gap={10}
          pl={20}
          pt={10}
          pb={15}
          sx={{
            borderLeft: "3px solid rgba(204, 204, 204, 0.2)",
          }}
        >
          <Group grow spacing={10}>
            <Input
              icon={<IconBrandFacebook size={20} />}
              placeholder="/Facebook"
              variant="filled"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconBrandInstagram size={20} />}
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
              icon={<IconBrandTiktok size={20} />}
              placeholder="@TikTok"
              variant="filled"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconBrandTwitter size={20} />}
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
        <Title
          order={6}
          mt={25}
          opacity={0.4}
          pb={5}
          mb={10}
          sx={{
            textTransform: "uppercase",
          }}
        >
          Email Notifications
        </Title>
        <Group
          grow
          align="stretch"
          fw={700}
          pt={10}
          pb={15}
          sx={{
            borderLeft: "3px solid rgba(204, 204, 204, 0.2)",
          }}
        >
          <Flex direction="column" gap={7} align="flex-start" pl={20}>
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="right"
              label="General Newsletter"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="right"
              label="Campaign Creation"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="right"
              label="New Campaign Comment"
            />
          </Flex>
          <Flex direction="column" gap={5} align="flex-start">
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="right"
              label="Campaign Milestones"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="right"
              label="Campaign Ending Soon"
            />
            <Switch
              p={0}
              size="xs"
              offLabel={<IconX size={12} />}
              onLabel={<IconCheck size={12} />}
              color="dark"
              radius="xs"
              labelPosition="right"
              label="Campaign Ended"
            />
          </Flex>
        </Group>
      </Flex>
      <Group
        position="right"
        w={"100%"}
        pos={"absolute"}
        bottom={10}
        right={30}
      >
        <Button
          variant="default"
          size="xs"
          leftIcon={<IconUserX size={18} stroke={2} />}
          sx={{
            opacity: 0.2,
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          DELETE ACCOUNT
        </Button>
      </Group>
    </Box>
  );
}
