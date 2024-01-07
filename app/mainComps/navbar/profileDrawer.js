"use client";
import { addEllipsis } from "@libs/custom";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Space,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconActivityHeartbeat,
  IconChevronRight,
  IconClipboardData,
  IconGavel,
  IconLogout,
  IconUserCircle,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountInfo from "./accountInfo";
import classes from "./styles/profileDrawer.module.css";
import TripInfo from "./tripInfo";

export default function ProfileDrawer(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const {
    user,
    active,
    setActive,
    panelOpened,
    setPanelOpened,
    mainMenuOpened,
    setMainMenuOpened,
    signOutFunc,
  } = props;

  const pathname = usePathname();

  const links = [
    {
      label: "Account Info",
      icon: <IconUserCircle size={30} />,
      description: "Manage Your Account",
    },
    {
      label: "Trip Info",
      icon: <IconClipboardData size={30} />,
      description: "Trip and Funding Info",
    },
  ];

  const menuLinkFunc = (index) => {
    {
      index === active
        ? (setPanelOpened(false), setActive(-1))
        : (setPanelOpened(true), setActive(index));
    }
  };

  const items = links.map((item, index) => {
    if (item.label === "Trip Info" && !user?.tripCreated) return;
    return (
      <NavLink
        px={25}
        key={item.label}
        active={index === active}
        description={item.description}
        rightSection={<IconChevronRight size={14} />}
        leftSection={item.icon}
        variant="subtle"
        onClick={() => menuLinkFunc(index)}
        classNames={{
          section: classes.navLinkIcon,
          label: classes.label,
          description: classes.description,
          root: classes.navLink,
        }}
        label={
          <Text
            fw={700}
            fz={10}
            style={{
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </Text>
        }
      />
    );
  });

  const animation = {
    initial: { x: -50, duration: 500 },
    animate: { x: 0, duration: 500 },
    exit: { x: 50, duration: 500 },
    transition: { type: "ease-in-out" },
  };

  const closeAll = () => {
    setMainMenuOpened(false);
    setPanelOpened(false);
  };

  const closePanel = () => {
    setPanelOpened(false);
    setActive(-1);
  };

  return (
    <>
      <ScrollArea>
        <Drawer
          classNames={{ content: classes.mainDrawer }}
          zIndex={500}
          pos={"relative"}
          withinPortal={false}
          padding={0}
          opened={mainMenuOpened}
          onClose={closeAll}
          size={330}
          trapFocus={false}
          lockScroll={false}
          withOverlay={false}
          withCloseButton={false}
          shadow="rgba(0, 0, 0, 0.2) 0px 5px 15px"
          transitionProps={{
            duration: 100,
          }}
        >
          {/* Close Main Menu Button */}
          <Button onClick={closeAll} className={classes.closeButton}>
            <IconX size={15} />
          </Button>
          <Space h={105} />
          <Divider
            className={classes.firstDivider}
            mt={0}
            w={"90%"}
            ml={"5%"}
            mb={20}
            opacity={dark ? 0.7 : 0.4}
            color={dark && "dark.7"}
          />
          {user && (
            <>
              <Center>
                <Badge
                  variant="dot"
                  color={dark ? "blue.9" : "blue.4"}
                  style={{
                    cursor: "default",
                    border: "none",
                    userSelect: "none",
                    border: dark
                      ? "1px solid rgba(255, 255, 255, 0.03)"
                      : "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {addEllipsis(user.email, 40)}
                </Badge>
              </Center>
              <Divider
                w={"90%"}
                mt={20}
                ml={"5%"}
                opacity={dark ? 0.7 : 0.4}
                color={dark && "dark.7"}
              />
            </>
          )}
          <Group gap={8} mt={10}>
            {pathname !== "/map" && (
              // Map Main Menu Button
              <NavLink
                label={
                  <Text
                    fw={700}
                    fz={10}
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    Map
                  </Text>
                }
                description="View the Map"
                px={25}
                py={8}
                leftSection={<IconWorld size={30} />}
                variant="subtle"
                component={Link}
                href="/map"
                onClick={() => {
                  closeAll();
                }}
                classNames={{
                  root: classes.navLink,
                  section: classes.navLinkIcon,
                  label: classes.label,
                  description: classes.description,
                }}
              />
            )}

            {user && items}
            {pathname !== "/news" && (
              // News Main Menu Button
              <NavLink
                label={
                  <Text
                    fw={700}
                    fz={10}
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    Latest Info.
                  </Text>
                }
                description="Info, Updates and Latest News"
                px={25}
                py={8}
                leftSection={<IconActivityHeartbeat size={30} />}
                variant="subtle"
                component={Link}
                href="/news"
                onClick={() => {
                  closeAll();
                }}
                classNames={{
                  root: classes.navLink,
                  section: classes.navLinkIcon,
                  label: classes.label,
                  description: classes.description,
                }}
              />
            )}
          </Group>
          {/* Legal Documents Main Menu Button */}
          <Button
            className={classes.legalButton}
            variant="subtle"
            pos={"absolute"}
            bottom={user ? 100 : 30}
            w={"100%"}
            fz={10}
            color="gray.7"
            component={Link}
            href="/legal"
            leftSection={<IconGavel size={18} />}
            hidden={pathname === "/legal"}
            onClick={() => {
              closeAll();
            }}
          >
            Legal Documents
          </Button>
          {user && (
            <Box className={classes.bottomBox} pt={10} mb={30}>
              {/* SignOut Button */}
              <Button
                className={classes.signOutButton}
                variant="subtle"
                w="60%"
                ml="20%"
                mt={10}
                leftSection={<IconLogout size={18} />}
                onClick={() => {
                  closeAll();
                  signOutFunc();
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Drawer>
      </ScrollArea>
      <Drawer
        classNames={{
          content: classes.panelDrawer,
          overlay: classes.panelDrawerOverlay,
        }}
        zIndex={499}
        withinPortal={false}
        opened={panelOpened}
        padding="25px 25px 0 370px"
        size={950}
        onClose={closePanel}
        withCloseButton={false}
        scrollAreaComponent={ScrollArea.Autosize}
        shadow="rgba(0, 0, 0, 0.2) 0px 5px 15px"
        transitionProps={{
          duration: 100,
        }}
        overlayProps={{
          blur: 9,
        }}
      >
        <Space h={45} />
        {/* Close Panel Button */}
        <Button className={classes.closePanelButton} onClick={closePanel}>
          <IconX size={15} />
        </Button>
        {active === 0 && (
          <motion.div {...animation}>
            <Title
              mt={-5}
              opacity={0.08}
              fw={600}
              fz={30}
              style={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={2}>
                Account Info <IconUserCircle size={30} />
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
              fz={30}
              style={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={0}>
                TRIP INFO <IconClipboardData size={30} />
              </Flex>
            </Title>
            <TripInfo
              setMainMenuOpened={setMainMenuOpened}
              setPanelOpened={setPanelOpened}
            />
          </motion.div>
        )}
      </Drawer>
    </>
  );
}
