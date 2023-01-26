import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { useLocalStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import {
  Avatar,
  Drawer,
  Space,
  Group,
  Flex,
  Text,
  Title,
  Button,
  Box,
  NavLink,
  CloseButton,
  Divider,
  Center,
  Input,
  Switch,
  Stack,
  ActionIcon,
} from "@mantine/core";
import {
  profileOpenedState,
  profileLinkState,
  profileShowState,
} from "../libs/atoms";
import {
  IconUser,
  IconCashBanknote,
  IconPlane,
  IconLogout,
  IconChevronRight,
  IconX,
  IconUserCircle,
  IconKey,
  IconPencil,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconCheck,
  IconCirclePlus,
  IconHeartHandshake,
} from "@tabler/icons";

export default function ProfileDrawer() {
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [profileShow, setProfileShow] = useRecoilState(profileShowState);
  const [active, setActive] = useRecoilState(profileLinkState);
  const [user, setUser] = useLocalStorage({ key: "user" });
  const router = useRouter();
  const auth = getAuth();

  const links = [
    {
      label: "Account Info",
      icon: <IconUser size={30} />,
      description: "Manage Your Account Info",
    },
    {
      label: "Money",
      icon: <IconCashBanknote size={30} />,
      description: "Bank and Funding Info",
    },
    {
      label: "Trips",
      icon: <IconPlane size={30} />,
      description: "Your Trip Campaigns",
    },
    // {
    //   label: "Referral Program",
    //   icon: <IconHeartHandshake size={20} />,
    // },
  ];

  const items = links.map((item, index) => (
    <NavLink
      px={25}
      key={item.label}
      active={index === active}
      label={item.label}
      description={item.description}
      rightSection={<IconChevronRight size={14} />}
      icon={item.icon}
      onClick={() => {
        setActive(index);
        setProfileShow(true);
      }}
      variant="subtle"
      sx={{
        ".mantine-NavLink-description": {
          opacity: 0.4,
        },
        ".mantine-NavLink-icon": {
          opacity: 0.1,
        },
      }}
    />
  ));

  const animation = {
    initial: { x: -50, duration: 500 },
    animate: { x: 0, duration: 500 },
    exit: { x: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  return (
    <>
      <Drawer
        trapFocus={false}
        zIndex={100}
        opened={profileOpened}
        size="md"
        opacity={0.95}
        withOverlay={false}
        withCloseButton={false}
      >
        <Space h={150} />
        <Flex
          direction="column"
          gap="xs"
          mb={10}
          sx={{
            userSelect: "none",
          }}
        >
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
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.02)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
          }}
        >
          {items}
        </Group>
        <Box
          py={30}
          mb={20}
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.03)",
            position: "absolute",
            left: "15%",
            bottom: 0,
            width: "70%",
          }}
        >
          <Button
            variant="subtle"
            w="60%"
            ml="20%"
            mt={10}
            leftIcon={<IconLogout size={18} />}
            sx={{
              color: "rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.012)",
              transition: "all 200ms ease",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={() => {
              signOut(auth)
                .then(() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("visible");
                  localStorage.removeItem("mapSpin");
                  router.reload();
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            Logout
          </Button>
        </Box>
        <Button
          onClick={() => {
            setProfileOpened(false);
            setProfileShow(false);
            setActive(-1);
          }}
          sx={{
            background: "rgba(8, 7, 11, 0.95)",
            borderRadius: "0 5px 5px 0",
            position: "absolute",
            top: "134px",
            right: "-33px",
            padding: "0 8px",
            transition: "all 100ms ease-in-out",
            "&:hover": {
              background: "rgba(16, 17, 19, 1)",
            },
          }}
        >
          <IconX size={15} />
        </Button>
      </Drawer>
      <Drawer
        zIndex={99}
        opened={profileShow}
        padding="xl"
        size="75%"
        overlayOpacity={0}
        transition="slide-right"
        transitionDuration={200}
        withCloseButton={false}
        onClose={() => setProfileShow(false)}
        trapFocus={false}
        shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        sx={{
          ".mantine-Drawer-drawer": {
            background: "rgba(0, 0, 0, 0.35)",
            "backdrop-filter": "blur(10px)",
          },
        }}
      >
        <CloseButton
          pos="absolute"
          top={140}
          right={30}
          size={25}
          title="Close"
          sx={{
            cursor: "pointer",
            zIndex: 115,
          }}
          onClick={() => {
            setProfileShow(false);
            setActive(-1);
          }}
        />
        <Box
          ml={345}
          mt={110}
          px={20}
          py={10}
          h="70vh"
          bg="rgba(11, 12, 13, 0.92)"
          sx={{
            overflowY: "hidden",
            borderRadius: "3px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow:
              "inset 0 0 5px 0 rgba(12, 14, 20, 0.3), 0 0 5px 0 rgba(0, 0, 0, 0.2)",
          }}
        >
          {active === 0 && (
            <motion.div {...animation}>
              <Box h="76vh">
                <Title order={6} opacity={0.25} fw={600}>
                  Account Info
                </Title>
                <Divider mt={7} opacity={0.1} />
                <Center style={{ width: "100%", height: "80%" }}>
                  <Flex direction="column" gap="xs">
                    <Divider label="Change E-mail or Password" />
                    <Input
                      variant="filled"
                      placeholder={user?.providerData[0].email}
                      icon={<IconUserCircle />}
                      iconWidth={50}
                      disabled
                      rightSection={
                        <ActionIcon opacity={0.5} variant="subtle">
                          <IconPencil size={18} />
                        </ActionIcon>
                      }
                      w="100%"
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
                    <Divider label="Email Notifications" mb={-15} />
                    <Group grow align="stretch" fw={700}>
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
                    <Divider label="Social Links" />
                    <Flex direction="column" gap={10}>
                      <Group grow spacing={10}>
                        <Input
                          icon={<IconBrandFacebook />}
                          placeholder="/Facebook"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />
                        <Input
                          icon={<IconBrandInstagram />}
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
                          icon={<IconBrandTiktok />}
                          placeholder="@TikTok"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />
                        <Input
                          icon={<IconBrandTwitter />}
                          placeholder="@Twitter"
                          rightSection={
                            <ActionIcon opacity={0.5} variant="subtle">
                              <IconCirclePlus size={16} />
                            </ActionIcon>
                          }
                        />
                      </Group>
                    </Flex>
                    <Divider mt={10} />
                  </Flex>
                </Center>
              </Box>
            </motion.div>
          )}
          {active === 1 && (
            <motion.div {...animation}>
              <Box h="76vh">
                <Title order={6} opacity={0.25} fw={600}>
                  Money
                </Title>
                <Divider mt={7} opacity={0.1} />
              </Box>
            </motion.div>
          )}
          {active === 2 && (
            <motion.div {...animation}>
              <Box h="76vh">
                <Title order={6} opacity={0.25} fw={600}>
                  Trip Campaigns
                </Title>
                <Divider mt={7} opacity={0.1} />
              </Box>
            </motion.div>
          )}
        </Box>
      </Drawer>
    </>
  );
}
