import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionStorage } from "@mantine/hooks";
import { motion } from "framer-motion";
import AccountInfo from "./accountInfo";
import Money from "./money";
import {
  createStyles,
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
  Center,
  Badge,
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
import { addEllipsis } from "../../libs/custom";

const useStyles = createStyles((theme) => ({
  icon: {
    opacity: 0.1,
  },
  activeIcon: {
    opacity: 0.7,
  },
  description: {
    opacity: 0.4,
  },
  root: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    "&:hover": { transform: "scale(1.02)", transition: "all 200ms ease" },
    "&:active": {
      transform: "scale(1)",
    },
  },
  closeButton: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[0]
        : theme.colors.dark[9],
    borderRadius: "5px 0 0 5px",
    position: "absolute",
    padding: "5px 10px",
    top: 77,
    right: 0,
    transition: "all 250ms ease-in-out",
    "&:hover": {
      background:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[4],
    },
  },
}));

export default function ProfileDrawer(props) {
  const { classes, cx } = useStyles();
  const {
    active,
    setActive,
    panelShow,
    setPanelShow,
    mainMenuOpened,
    openMenu,
    signOutFunc,
  } = props;
  const [user, setUser] = useSessionStorage({ key: "user" });
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/help");
    router.prefetch("/legal");
  }, [router]);

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

  const menuLinkFunc = (index) => {
    {
      index === active
        ? (setPanelShow(false), setActive(-1))
        : (setPanelShow(true), setActive(index));
    }
  };

  const items = links.map((item, index) => (
    // Main menu items
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
      onClick={() => menuLinkFunc(index)}
      classNames={{
        icon: cx(classes.icon, { [classes.activeIcon]: active === index }),
        description: classes.description,
        label: classes.label,
        root: classes.root,
      }}
    />
  ));

  const animation = {
    initial: { x: -50, duration: 500 },
    animate: { x: 0, duration: 500 },
    exit: { x: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const closePanel = () => {
    setPanelShow(false);
    setActive(-1);
  };

  return (
    <>
      <Drawer
        zIndex={500}
        pos={"relative"}
        padding={0}
        opened={mainMenuOpened}
        onClose={openMenu}
        size={305}
        lockScroll={false}
        withOverlay={false}
        withCloseButton={false}
        styles={(theme) => ({
          content: {
            overflow: "hidden",
            background:
              theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors.dark[7], 0.95)
                : theme.fn.rgba(theme.colors.gray[0], 0.95),
          },
        })}
      >
        {/* Close Main Menu Button */}
        {/* TODO   */}
        <Button onClick={openMenu} className={classes.closeButton}>
          <IconX size={15} />
        </Button>
        <Space h={95} />
        <Divider mt={0} mb={20} w={"253px"} ml={"15px"} opacity={0.4} />
        {user && (
          <>
            <Center>
              <Badge
                variant="dot"
                sx={{
                  cursor: "pointer",
                }}
              >
                {addEllipsis(user.email, 40)}
              </Badge>
            </Center>
            <Divider w={"90%"} mt={20} ml={"5%"} opacity={0.2} />
          </>
        )}
        <Group spacing={8} mt={10}>
          {router.pathname !== "/" && (
            // Map Main Menu Button
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
              icon={<IconWorld size={30} />}
              variant="subtle"
              onClick={() => {
                !user && sessionStorage.setItem("noLogin", "true");
                router.push("/");
              }}
              classNames={{
                description: classes.description,
                icon: classes.icon,
                root: classes.root,
              }}
            />
          )}

          {user && items}
          {router.pathname !== "/help" && (
            // Help Main Menu Button
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
              icon={<IconInfoCircle size={30} />}
              variant="subtle"
              onClick={() => {
                router.push("/help");
              }}
              classNames={{
                description: classes.description,
                icon: classes.icon,
                root: classes.root,
              }}
            />
          )}
        </Group>
        {/* Legal Documents Main Menu Button */}
        <Button
          variant="subtle"
          pos={"absolute"}
          bottom={user ? 100 : 30}
          w={"100%"}
          fz={10}
          color="gray.7"
          leftIcon={<IconGavel size={18} />}
          hidden={router.pathname === "/legal"}
          onClick={() => {
            router.push("/legal");
          }}
          sx={(theme) => ({
            "&:hover": {
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[0]
                  : theme.colors.dark[9],
              backgroundColor: "rgba(0, 0, 0, 0)",
            },
          })}
        >
          Legal Documents
        </Button>
        {user && (
          <Box
            pt={10}
            mb={30}
            sx={(theme) => ({
              borderTop: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.fn.rgba(theme.colors.gray[0], 0.1)
                  : theme.fn.rgba(theme.colors.dark[9], 0.1)
              }`,
              position: "absolute",
              left: "15%",
              bottom: 0,
              width: "70%",
            })}
          >
            {/* SignOut Button */}
            <Button
              variant="subtle"
              w="60%"
              ml="20%"
              mt={10}
              leftIcon={<IconLogout size={18} />}
              sx={(theme) => ({
                color:
                  theme.colorScheme === "dark"
                    ? theme.fn.rgba(theme.colors.gray[0], 0.1)
                    : theme.fn.rgba(theme.colors.dark[9], 0.1),
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.fn.rgba(theme.colors.gray[0], 0.012)
                    : theme.fn.rgba(theme.colors.dark[9], 0.05),
                transition: "all 200ms ease",
                "&:hover": {
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[0]
                      : theme.colors.dark[9],
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.fn.rgba(theme.colors.dark[9], 0.2)
                      : theme.fn.rgba(theme.colors.gray[0], 0.2),
                },
              })}
              onClick={signOutFunc}
            >
              Logout
            </Button>
          </Box>
        )}
      </Drawer>
      <Drawer
        zIndex={499}
        opened={panelShow}
        padding="24px 25px 0 330px"
        size={900}
        onClose={closePanel}
        withCloseButton={false}
        shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        overlayProps={{
          blur: 9,
        }}
        sx={(theme) => ({
          ".mantine-Drawer-content": {
            background:
              theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors.dark[7], 0.95)
                : theme.fn.rgba(theme.colors.gray[0], 0.95),
          },
          ".mantine-Drawer-overlay": {
            background:
              theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors.dark[9], 0.7)
                : theme.fn.rgba(theme.colors.gray[0], 0.7),
          },
        })}
      >
        {/* Close Panel Button */}
        <Button className={classes.closeButton} onClick={closePanel}>
          <IconX size={15} />
        </Button>
        {active === 0 && (
          <motion.div {...animation}>
            <Title
              mt={-5}
              opacity={0.08}
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
            <AccountInfo user={user} />
          </motion.div>
        )}
        {active === 1 && (
          <motion.div {...animation}>
            <Title
              mt={-5}
              opacity={0.08}
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
      </Drawer>
    </>
  );
}
