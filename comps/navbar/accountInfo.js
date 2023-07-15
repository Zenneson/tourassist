import {
  useMantineTheme,
  ActionIcon,
  Box,
  Button,
  Flex,
  Input,
  Group,
  Title,
  Switch,
} from "@mantine/core";
import {
  IconKey,
  IconX,
  IconCheck,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconCirclePlus,
  IconUserX,
  IconDeviceSim1,
  IconDeviceSim2,
  IconPhone,
  IconBuildingBank,
} from "@tabler/icons-react";
import { useSessionStorage } from "@mantine/hooks";

export default function AccountInfo() {
  const theme = useMantineTheme();
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  return (
    <Box pr={30} mt={15} pos={"relative"} h={"calc(100vh - 120px)"}>
      <Flex direction="column" gap="xs" w={"100%"}>
        <Title
          order={6}
          pb={5}
          sx={{
            textTransform: "uppercase",
          }}
        >
          Personal Info
        </Title>
        <Flex
          direction="column"
          gap={10}
          pl={20}
          pt={10}
          pb={12}
          sx={{
            borderLeft: `3px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.gray[8]
                : theme.colors.gray[4]
            }`,
          }}
        >
          <Group grow spacing={10}>
            <Input
              icon={<IconDeviceSim1 size={20} />}
              placeholder="First Name"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconDeviceSim2 size={20} />}
              placeholder="Last Name"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
          </Group>
          <Group grow spacing={10}>
            <Input
              icon={<IconPhone size={20} />}
              placeholder="Phone #"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Button variant="light" color="green" fz={12}>
              <IconBuildingBank
                size={15}
                stroke={3}
                opacity={0.4}
                style={{
                  marginRight: "5px",
                  marginBottom: "2px",
                }}
              />{" "}
              ADD BANKING INFO
            </Button>
          </Group>
        </Flex>
        <Title
          order={6}
          pb={5}
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
          pb={12}
          sx={{
            borderLeft: `3px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.gray[8]
                : theme.colors.gray[4]
            }`,
          }}
        >
          <Group grow spacing={10}>
            <Input
              icon={<IconBrandFacebook size={20} />}
              placeholder="/Facebook"
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconBrandInstagram size={20} />}
              placeholder="@Instagram"
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
              rightSection={
                <ActionIcon opacity={0.5} variant="subtle">
                  <IconCirclePlus size={16} />
                </ActionIcon>
              }
            />
            <Input
              icon={<IconBrandTwitter size={20} />}
              placeholder="@Twitter"
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
          pb={5}
          sx={{
            textTransform: "uppercase",
          }}
        >
          Notifications
        </Title>
        <Group
          grow
          align="stretch"
          fw={700}
          pt={10}
          pb={12}
          sx={{
            borderLeft: `3px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.gray[8]
                : theme.colors.gray[4]
            }`,
          }}
        >
          <Flex direction="column" gap={8} align="flex-start" pl={20}>
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
          <Flex direction="column" gap={8} align="flex-start">
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
        right={-20}
        sx={{
          transform: "scale(0.85)",
        }}
      >
        <Button.Group>
          <Button
            variant="subtle"
            size="xs"
            leftIcon={<IconKey size={18} stroke={2} />}
            sx={{
              opacity: 0.5,
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            CHANGE PASSWORD
          </Button>
          <Button
            variant="subtle"
            size="xs"
            leftIcon={<IconUserX size={18} stroke={2} />}
            sx={{
              opacity: 0.5,
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            DELETE ACCOUNT
          </Button>
        </Button.Group>
      </Group>
    </Box>
  );
}
