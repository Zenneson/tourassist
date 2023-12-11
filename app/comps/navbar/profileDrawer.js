"use client";
import { useUser } from "@libs/context";
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
  IconChevronRight,
  IconClipboardData,
  IconGavel,
  IconInfoCircle,
  IconLogout,
  IconUserCircle,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AccountInfo from "./accountInfo";
import classes from "./styles/profileDrawer.module.css";
import TripInfo from "./tripInfo";

export default function ProfileDrawer(props) {
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const {
    active,
    setActive,
    panelShow,
    setPanelShow,
    mainMenuOpened,
    setMainMenuOpened,
    openMenu,
    signOutFunc,
    allTrips,
    setDropDownOpened,
  } = props;

  const router = useRouter();
  const { user } = useUser();

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
        ? (setPanelShow(false), setActive(-1))
        : (setPanelShow(true), setActive(index));
    }
  };

  const items = links.map((item, index) => {
    // Main menu items
    if (index === 1 && allTrips?.length === 0) return;
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
            fz={12}
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
    setPanelShow(false);
  };

  const closePanel = () => {
    setPanelShow(false);
    setActive(-1);
  };

  useEffect(() => {
    router.prefetch("/map");
    router.prefetch("/help");
    router.prefetch("/legal");
  }, [router]);

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
          onClose={() => setMainMenuOpened(false)}
          size={310}
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
          <Button onClick={openMenu} className={classes.closeButton}>
            <IconX size={15} />
          </Button>
          <Space h={95} />
          <Divider
            mt={0}
            mb={20}
            w={"253px"}
            ml={"15px"}
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
            {router.pathname !== "/map" && (
              // Map Main Menu Button
              <NavLink
                label={
                  <Text
                    fw={700}
                    fz={12}
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
                onClick={() => {
                  closeAll();
                  router.push("/map");
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
            {router.pathname !== "/help" && (
              // Help Main Menu Button
              <NavLink
                label={
                  <Text
                    fw={700}
                    fz={12}
                    fs={"italic"}
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    How?
                  </Text>
                }
                description="About TourAssit | FAQs"
                px={25}
                py={8}
                leftSection={<IconInfoCircle size={30} />}
                variant="subtle"
                onClick={() => {
                  closeAll();
                  router.push("/help");
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
            leftSection={<IconGavel size={18} />}
            hidden={router.pathname === "/legal"}
            onClick={() => {
              closeAll();
              router.push("/legal");
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
        opened={panelShow}
        padding="25px 25px 0 350px"
        size={920}
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
        <Space h={24} />
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
              style={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={10}>
                Account Info <IconUserCircle size={40} />
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
              style={{
                textTransform: "uppercase",
              }}
            >
              <Flex align={"center"} gap={10}>
                TRIP INFO <IconClipboardData size={40} />
              </Flex>
            </Title>
            <TripInfo
              allTrips={allTrips}
              setMainMenuOpened={setMainMenuOpened}
              setPanelShow={setPanelShow}
              setDropDownOpened={setDropDownOpened}
            />
          </motion.div>
        )}
      </Drawer>
    </>
  );
}
