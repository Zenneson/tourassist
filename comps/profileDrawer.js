import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useLocalStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import AccountInfo from "./accountInfo";
import Money from "./money";
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
  Divider,
  Select,
} from "@mantine/core";
import {
  IconUser,
  IconLogout,
  IconChevronRight,
  IconX,
  IconWallet,
  IconWorld,
  IconGavel,
  IconInfoCircle,
} from "@tabler/icons-react";

export default function ProfileDrawer({
  active,
  setActive,
  profileShow,
  setProfileShow,
  profileOpened,
  setProfileOpened,
  setTripSelected,
  auth,
}) {
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [user, setUser] = useLocalStorage({ key: "user" });
  const router = useRouter();

  const links = [
    {
      label: "Account Info",
      icon: <IconUser size={30} />,
      description: "Manage Your Account",
    },
    {
      label: "Trip Info",
      icon: <IconWallet size={30} />,
      description: "Trip and Funding Info",
    },
  ];

  const items = links.map((item, index) => (
    <NavLink
      px={25}
      key={item.label}
      active={index === active}
      label={
        <Text
          fw={700}
          fz={12}
          sx={{
            textTransform: "uppercase",
          }}
        >
          {item.label}
        </Text>
      }
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
        "&:hover": { transform: "scale(1.02)", transition: "all 200ms ease" },
        "&:active": {
          transform: "scale(1)",
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
        zIndex={500}
        pos={"relative"}
        trapFocus={false}
        padding={0}
        opened={profileOpened}
        size={305}
        lockScroll={false}
        withOverlay={false}
        withCloseButton={false}
        styles={{
          content: {
            overflow: "hidden",
          },
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
            setProfileOpened(false);
            setProfileShow(false);
          }}
        >
          <IconX size={15} />
        </Button>
        <Space h={95} />
        <Divider mt={0} mb={20} w={"253px"} ml={"15px"} opacity={0.4} />
        {user && (
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
            <Text
              variant="outline"
              ta="center"
              w={"50%"}
              ml={"25%"}
              fz={9}
              sx={{
                textTransform: "uppercase",
              }}
            >
              {user?.providerData[0].email}
            </Text>
          </Flex>
        )}
        <Group spacing={8} mt={15}>
          {router.pathname !== "/" && (
            <NavLink
              label={
                <Text
                  fw={700}
                  fz={12}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  Map
                </Text>
              }
              description="View the Map"
              px={25}
              py={8}
              icon={<IconWorld size={30} opacity={0.1} />}
              variant="subtle"
              onClick={() => {
                localStorage.setItem("noLogin", "true");
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/");
              }}
              sx={{
                ".mantine-NavLink-description": {
                  opacity: 0.4,
                },
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "all 200ms ease",
                },
                "&:active": {
                  transform: "scale(1)",
                },
              }}
            />
          )}

          {user && items}
          {router.pathname !== "/help" && (
            <NavLink
              label={
                <Text
                  fw={700}
                  fz={12}
                  fs={"italic"}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  How?
                </Text>
              }
              description="About TourAssit | FAQs"
              px={25}
              py={8}
              icon={<IconInfoCircle size={30} opacity={0.1} />}
              variant="subtle"
              onClick={(e) => {
                setProfileOpened(false);
                setProfileShow(false);
                router.push("/help");
              }}
              sx={{
                ".mantine-NavLink-description": {
                  opacity: 0.4,
                },
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "all 200ms ease",
                },
                "&:active": {
                  transform: "scale(1)",
                },
              }}
            />
          )}
        </Group>
        <Button
          variant="subtle"
          pos={"absolute"}
          bottom={user ? 130 : 30}
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
        {user && (
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
                    localStorage.removeItem("placeDataState");
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
        )}
      </Drawer>
      <Drawer
        opened={profileShow}
        padding="24px 25px 24px 330px"
        size={900}
        withCloseButton={false}
        trapFocus={false}
        shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        overlayProps={{
          opacity: 0.7,
          blur: 9,
        }}
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
            <Select
              w={"95%"}
              mt={7}
              variant="filled"
              placeholder="Help me raise money to go on a Music Tour"
              data={["Help me raise money to go on a Music Tour"]}
            />
            <Money
              setProfileShow={setProfileShow}
              setProfileOpened={setProfileOpened}
              setTripSelected={setTripSelected}
            />
          </motion.div>
        )}
      </Drawer>
    </>
  );
}
