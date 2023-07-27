import { useState, useRef } from "react";
import {
  useMantineColorScheme,
  ActionIcon,
  Box,
  Button,
  Flex,
  Input,
  Group,
  Title,
  Switch,
  Tooltip,
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
  IconPencil,
} from "@tabler/icons-react";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../libs/firebase";

export default function AccountInfo(props) {
  const { user } = props;
  const firstNameRef = useRef();
  const [firstName, setFirstName] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState(
    user && user.firstName ? user.firstName : ""
  );
  const lastNameRef = useRef();
  const [lastName, setLastName] = useState(false);
  const [lastNameValue, setLastNameValue] = useState(
    user && user.lastName ? user.lastName : ""
  );
  const phoneRef = useRef();
  const [phone, setPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(
    user && user.phone ? user.phone : ""
  );
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const updateField = async (update) => {
    await updateDoc(doc(firestore, "users", user.email), update);
  };

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
            borderLeft: `3px solid ${dark}` ? "gray.8" : "gray.4",
          }}
        >
          <Group grow spacing={10}>
            <Input
              ref={firstNameRef}
              icon={<IconDeviceSim1 size={20} />}
              value={firstNameValue}
              placeholder={"First Name"}
              onChange={(e) => setFirstNameValue(e.target.value)}
              sx={{
                pointerEvents: !firstName ? "none" : "all",
              }}
              rightSection={
                <Tooltip
                  label="Edit First Name"
                  color={dark ? "dark" : "gray.0"}
                  c={dark ? "gray.0" : "dark.9"}
                  withArrow
                >
                  <ActionIcon
                    opacity={0.5}
                    variant="subtle"
                    sx={{
                      pointerEvents: "all",
                    }}
                    onClick={() => {
                      if (!firstName) {
                        setFirstName(true);
                        firstNameRef.current.focus();
                      } else {
                        updateField({ firstName: firstNameValue });
                        setFirstName(false);
                      }
                    }}
                  >
                    {user && user.firstName ? (
                      <IconPencil size={20} />
                    ) : (
                      <IconCirclePlus size={16} />
                    )}
                  </ActionIcon>
                </Tooltip>
              }
            />
            <Input
              ref={lastNameRef}
              icon={<IconDeviceSim2 size={20} />}
              value={lastNameValue}
              placeholder={"Last Name"}
              onChange={(e) => setLastNameValue(e.target.value)}
              sx={{
                pointerEvents: !lastName ? "none" : "all",
              }}
              rightSection={
                <Tooltip
                  label="Edit Last Name"
                  color={dark ? "dark" : "gray.0"}
                  c={dark ? "gray.0" : "dark.9"}
                  withArrow
                >
                  <ActionIcon
                    opacity={0.5}
                    variant="subtle"
                    sx={{
                      pointerEvents: "all",
                    }}
                    onClick={() => {
                      if (!lastName) {
                        setLastName(true);
                        lastNameRef.current.focus();
                      } else {
                        updateField({ lastName: lastNameValue });
                        setLastName(false);
                      }
                    }}
                  >
                    {user && user.lastName ? (
                      <IconPencil size={20} />
                    ) : (
                      <IconCirclePlus size={16} />
                    )}
                  </ActionIcon>
                </Tooltip>
              }
            />
          </Group>
          <Group grow spacing={10}>
            <Input
              ref={phoneRef}
              icon={<IconPhone size={20} />}
              value={phoneValue}
              placeholder={"Phone #"}
              onChange={(e) => setPhoneValue(e.target.value)}
              sx={{
                pointerEvents: !phone ? "none" : "all",
              }}
              rightSection={
                <Tooltip
                  label="Edit Phone #"
                  color={dark ? "dark" : "gray.0"}
                  c={dark ? "gray.0" : "dark.9"}
                  withArrow
                >
                  <ActionIcon
                    opacity={0.5}
                    variant="subtle"
                    sx={{
                      pointerEvents: "all",
                    }}
                    onClick={() => {
                      if (!phone) {
                        setPhone(true);
                        phoneRef.current.focus();
                      } else {
                        updateField({ phone: phoneValue });
                        setPhone(false);
                      }
                    }}
                  >
                    {user && user.phone ? (
                      <IconPencil size={20} />
                    ) : (
                      <IconCirclePlus size={16} />
                    )}
                  </ActionIcon>
                </Tooltip>
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
            borderLeft: `3px solid ${dark}` ? "gray.8" : "gray.4",
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
            borderLeft: `3px solid ${dark}` ? "gray.8" : "gray.4",
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
