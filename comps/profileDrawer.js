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
      label={<Text fw={700}>{item.label}</Text>}
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
          opacity: index === active ? 0.7 : 0.1,
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
        size={305}
        lockScroll={false}
        withOverlay={false}
        withCloseButton={false}
      >
        <Button
          pos={"absolute"}
          top={77}
          right={0}
          bg={"dark.5"}
          radius={"5px 0 0 5px"}
          p={"5px 10px"}
          sx={{
            transition: "all 250ms ease-in-out",
            "&:hover": {
              background: "rgba(8, 7, 11, 1)",
            },
          }}
          onClick={() => {
            setProfileOpened(false);
            setProfileShow(false);
          }}
        >
          <IconX size={15} />
        </Button>
        <Space h={95} />
        <Divider mt={0} mb={20} w={"253px"} ml={"15px"} opacity={0.4} />
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
          <Text ta="center" fz={10}>
            {user?.providerData[0].email}
          </Text>
        </Flex>
        <Group spacing={8} mt={15}>
          {router.pathname !== "/" && (
            <NavLink
              label={<Text fw={700}>Map</Text>}
              description="View the Map"
              px={25}
              py={8}
              icon={<IconWorld size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/");
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
              label={<Text fw={700}>About Us</Text>}
              description="About TourAssit | FAQs"
              px={25}
              py={8}
              icon={<IconInfoCircle size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/about");
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
              label={<Text fw={700}>Contact Us</Text>}
              description="Message Us Directly"
              px={25}
              py={8}
              icon={<IconAt size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/contact");
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
            router.push("/legal");
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
                  if (router.pathname !== "/") router.push("/");
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
        padding="24px 25px 24px 330px"
        size={900}
        withCloseButton={false}
        trapFocus={false}
        shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        sx={{
          ".mantine-Drawer-content": { background: "rgba(11, 12, 13, 0.95)" },
        }}
        onClose={() => {
          setProfileShow(false);
          setActive(-1);
        }}
      >
        <Button
          pos={"absolute"}
          top={77}
          right={0}
          bg={"dark.5"}
          radius={"5px 0 0 5px"}
          p={"5px 10px"}
          sx={{
            transition: "all 250ms ease-in-out",
            "&:hover": {
              background: "rgba(8, 7, 11, 1)",
            },
          }}
          onClick={() => {
            setProfileShow(false);
            setActive(-1);
          }}
        >
          <IconX size={15} />
        </Button>
        {active === 0 && (
          <motion.div {...animation}>
            <Title
              mt={-5}
              opacity={0.15}
              fw={600}
              fz={40}
              sx={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={10}>
                Account Info <IconUser size={40} />
              </Flex>
            </Title>
            <AccountInfo />
          </motion.div>
        )}
        {active === 1 && (
          <motion.div {...animation}>
            <Title
              mt={-5}
              opacity={0.15}
              fw={600}
              fz={40}
              sx={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={10}>
                Money <IconWallet size={40} />
              </Flex>
            </Title>
            <Money />
          </motion.div>
        )}
        {active === 2 && (
          <motion.div {...animation}>
            <Title
              mt={-5}
              opacity={0.15}
              fw={600}
              fz={40}
              sx={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={10}>
                Trip Campaigns <IconPlane size={40} />
              </Flex>
            </Title>
            <Trips />
          </motion.div>
        )}
      </Drawer>
    </>
  );
}
