import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { useLocalStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import AccountInfo from "./accountInfo";
import Money from "./money";
import Trips from "./trips";
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
} from "@mantine/core";
import {
  profileOpenedState,
  profileLinkState,
  profileShowState,
} from "../libs/atoms";
import {
  IconUser,
  IconPlane,
  IconLogout,
  IconChevronRight,
  IconX,
  IconWallet,
  IconBuildingBank,
  IconCashBanknote,
  IconWorld,
  IconGavel,
  IconInfoCircle,
  IconAt,
} from "@tabler/icons";

export default function ProfileDrawer() {
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [profileShow, setProfileShow] = useRecoilState(profileShowState);
  const [active, setActive] = useRecoilState(profileLinkState);
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [user, setUser] = useLocalStorage({ key: "user" });
  const router = useRouter();
  const auth = getAuth();

  const links = [
    {
      label: "Account Info",
      icon: <IconUser size={30} />,
      description: "Manage Your Account",
    },
    {
      label: "Money",
      icon: <IconWallet size={30} />,
      description: "Bank and Funding Info",
    },
    {
      label: "Trips",
      icon: <IconPlane size={30} />,
      description: "Your Trip Campaigns",
    },
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
      variant="subtle"
      onClick={() => {
        setActive(index);
        setProfileShow(true);
        {
          index === active ? (setProfileShow(false), setActive(-1)) : null;
        }
      }}
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
      {/* NOTE - top Drawer */}
      <Drawer
        zIndex={500}
        pos={"relative"}
        trapFocus={false}
        padding={0}
        opened={profileOpened}
        size="xs"
        lockScroll={false}
        withOverlay={false}
        withCloseButton={false}
      >
        <Button
          pos={"absolute"}
          top={117}
          right={0}
          sx={{
            background: "rgba(8, 7, 11, 0.95)",
            borderRadius: "5px 0 0 5px",
            padding: "0 8px",
            transition: "all 100ms ease-in-out",
            "&:hover": {
              background: "rgba(16, 17, 19, 1)",
            },
          }}
          onClick={() => setProfileOpened(false)}
        >
          <IconX size={15} />
        </Button>
        <Space h={100} />
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
          mt={25}
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.02)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
          }}
        >
          {router.pathname !== "/" && (
            <NavLink
              label="Map"
              description="View the Map"
              rightSection={<IconChevronRight size={14} />}
              px={25}
              py={14}
              icon={<IconWorld size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/", undefined, { shallow: true });
              }}
              sx={{
                ".mantine-NavLink-description": {
                  opacity: 0.4,
                },
              }}
            />
          )}
          {items}
          {router.pathname !== "/about" && (
            <NavLink
              label="About Us"
              description="About TourAssit | FAQs"
              rightSection={<IconChevronRight size={14} />}
              px={25}
              py={14}
              icon={<IconInfoCircle size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/about", undefined, { shallow: true });
              }}
              sx={{
                ".mantine-NavLink-description": {
                  opacity: 0.4,
                },
              }}
            />
          )}
          {router.pathname !== "/contact" && (
            <NavLink
              label="Contact Us"
              description="Message Us Directly"
              rightSection={<IconChevronRight size={14} />}
              px={25}
              py={14}
              icon={<IconAt size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/contact", undefined, { shallow: true });
              }}
              sx={{
                ".mantine-NavLink-description": {
                  opacity: 0.4,
                },
              }}
            />
          )}
        </Group>
        <Button
          variant="subtle"
          pos={"absolute"}
          bottom={130}
          w={"100%"}
          fz={10}
          color="gray.7"
          leftIcon={<IconGavel size={18} />}
          hidden={router.pathname === "/legal"}
          onClick={() => {
            setProfileOpened(false);
            setProfileShow(false);
            router.push("/legal", undefined, { shallow: true });
          }}
          sx={{
            "&:hover": {
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
          }}
        >
          Legal Documents
        </Button>
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
                  setProfileOpened(false);
                  setProfileShow(false);
                  if (router.pathname !== "/")
                    router.push("/", undefined, { shallow: true });
                  else {
                    router.reload();
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      {/* NOTE - bottom Drawer */}
      <Drawer
        opened={profileShow}
        padding="24px 39px 24px 24px"
        size={1015}
        withCloseButton={false}
        trapFocus={false}
        shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        onClose={() => {
          setProfileShow(false);
          setActive(-1);
        }}
        sx={{
          ".mantine-Drawer-content": {
            background: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <CloseButton
          pos="absolute"
          top={140}
          right={45}
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
          bg="rgba(11, 12, 13, 0.95)"
          sx={{
            "&::-webkit-scrollbar": {
              width: "0",
            },
            overflow: "auto",
            maxHeight: "calc(100vh - 300px)",
            borderRadius: "3px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow:
              "inset 0 0 5px 0 rgba(12, 14, 20, 0.3), 0 0 5px 0 rgba(0, 0, 0, 0.2)",
          }}
        >
          {active === 0 && (
            <motion.div {...animation}>
              <Title order={6} opacity={0.25} fw={600}>
                Account Info
              </Title>
              <Divider mt={7} opacity={0.15} />
              <AccountInfo />
            </motion.div>
          )}
          {active === 1 && (
            <motion.div {...animation}>
              <Title order={6} opacity={0.25} fw={600}>
                Money
              </Title>
              <Divider mt={7} opacity={0.15} />
              <Money />
            </motion.div>
          )}
          {active === 2 && (
            <motion.div {...animation}>
              <Title order={6} opacity={0.25} fw={600}>
                Trip Campaigns
              </Title>
              <Divider mt={7} opacity={0.15} />
              <Trips />
            </motion.div>
          )}
        </Box>
      </Drawer>
    </>
  );
}
