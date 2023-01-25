import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
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
  ScrollArea,
  CloseButton,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import {
  profileOpenedState,
  profileLinkState,
  profileShowState,
} from "../libs/atoms";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconUser,
  IconCashBanknote,
  IconPlane,
  IconLogout,
  IconHeartHandshake,
  IconChevronRight,
  IconX,
} from "@tabler/icons";

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

export default function ProfileDrawer() {
  const [profileOpened, setProfileOpened] = useRecoilState(profileOpenedState);
  const [profileShow, setProfileShow] = useRecoilState(profileShowState);
  const [active, setActive] = useRecoilState(profileLinkState);
  const [user, setUser] = useLocalStorage({ key: "user" });
  const router = useRouter();
  const auth = getAuth();

  const items = links.map((item, index) => (
    <NavLink
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

  return (
    <>
      <Drawer
        zIndex={100}
        opened={profileOpened}
        padding="xl"
        size="md"
        opacity={0.95}
        withOverlay={false}
        withCloseButton={false}
      >
        <Space h={120} />
        <Flex direction="column" gap="xs" mb={10}>
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
          py={10}
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
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
        size="full"
        overlayOpacity={0.3}
        overlayBlur={10}
        withCloseButton={false}
        sx={{
          ".mantine-Drawer-drawer": {
            background: "rgba(0, 0, 0, 0)",
          },
        }}
      >
        <CloseButton
          pos="absolute"
          top={140}
          right={20}
          size={30}
          title="Close"
          sx={{
            cursor: "pointer",
            zIndex: 115,
          }}
          onClick={() => setProfileShow(false)}
        />
        <ScrollArea
          ml={350}
          mt={160}
          p={20}
          h="80vh"
          hover="true"
          scrollbarSize={7}
          bg="#0b0c0d"
          opacity={0.95}
          sx={{
            borderRadius: "5px",
            boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mb={25}>
            <Title>Account Information</Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo
            </Text>
          </Box>
          <Box mb={25}>
            <Title>Money</Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo
            </Text>
          </Box>
          <Box mb={25}>
            <Title>Trips</Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est
              laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo
            </Text>
          </Box>
        </ScrollArea>
      </Drawer>
    </>
  );
}
