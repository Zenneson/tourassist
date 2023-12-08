"use client";
import { useState, useRef } from "react";
import {
  useComputedColorScheme,
  ActionIcon,
  Box,
  Button,
  Flex,
  Input,
  Group,
  Title,
  Switch,
  Tooltip,
  TextInput,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Divider,
  HoverCard,
  Text,
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
  IconDeviceSim1,
  IconDeviceSim2,
  IconPhone,
  IconPencil,
  IconBuildingBank,
  IconInfoCircle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useWindowEvent } from "@mantine/hooks";
import { formatPhoneNumber, addAtSymbol, updateField } from "../../libs/custom";
import classes from "./styles/accountInfo.module.css";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AccountInfo(props) {
  const { user } = props;

  const [changePass, setChangePass] = useState(false);

  const firstNameRef = useRef();
  const [firstName, setFirstName] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState(user?.firstName || "");

  const lastNameRef = useRef();
  const [lastName, setLastName] = useState(false);
  const [lastNameValue, setLastNameValue] = useState(user?.lastName || "");

  const phoneRef = useRef();
  const [phone, setPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(user?.phone || "");

  const faceBookRef = useRef();
  const [faceBook, setFaceBook] = useState(false);
  const [faceBookValue, setFaceBookValue] = useState(user?.faceBook || "");

  const instagramRef = useRef();
  const [instagram, setInstagram] = useState(false);
  const [instagramValue, setInstagramValue] = useState(user?.instagram || "");

  const tikTokRef = useRef();
  const [tikTok, setTikTok] = useState(false);
  const [tikTokValue, setTikTokValue] = useState(user?.tikTok || "");

  const twitterRef = useRef();
  const [twitter, setTwitter] = useState(false);
  const [twitterValue, setTwitterValue] = useState(user?.twitter || "");

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const refs = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    phone: phoneRef,
    faceBook: faceBookRef,
    instagram: instagramRef,
    tiktok: tikTokRef,
    twitter: twitterRef,
  };

  const values = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    phone: phoneValue,
    faceBook: faceBookValue,
    instagram: instagramValue,
    tiktok: tikTokValue,
    twitter: twitterValue,
  };

  const setters = {
    firstName: setFirstName,
    lastName: setLastName,
    phone: setPhone,
    faceBook: setFaceBook,
    instagram: setInstagram,
    tiktok: setTikTok,
    twitter: setTwitter,
  };

  const useUpdateOnEnter = (refs, values, setters) => {
    useWindowEvent("keydown", (event) => {
      if (event.key === "Enter") {
        for (let field in refs) {
          if (
            refs[field].current &&
            refs[field].current === document.activeElement
          ) {
            updateField({ [field]: values[field] }, user);
            setters[field](false);
            refs[field].current.blur();
            break;
          }
        }
      }
    });
  };

  useUpdateOnEnter(refs, values, setters);

  const sendPassReset = () => {
    setChangePass(false);
    notifications.show({
      title: "Password Reset Email send to " + user.email,
      message: "Check your email for the password reset link",
      color: "green",
      icon: <IconCheck />,
    });
  };

  return (
    <>
      <Box pr={30} mt={15} pos={"relative"} h={"calc(100vh - 120px)"}>
        <Flex direction="column" gap="xs" w={"100%"}>
          <Title
            order={6}
            pb={5}
            style={{
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
            style={{
              borderLeft: dark
                ? "3px solid rgba(255, 255, 255, 0.03)"
                : "3px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Group grow gap={10}>
              <TextInput
                classNames={{ input: classes.accountPanelInput }}
                ref={firstNameRef}
                icon={<IconDeviceSim1 size={20} />}
                value={firstNameValue || ""}
                placeholder={"First Name"}
                onChange={(e) => setFirstNameValue(e.target.value)}
                style={{
                  pointerEvents: !firstName ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={
                      firstNameValue ? "Edit First Name" : "Add First Name"
                    }
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!firstName) {
                          setFirstName(true);
                          firstNameRef.current.focus();
                        } else {
                          updateField({ firstName: firstNameValue }, user);
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
              <TextInput
                classNames={{ input: classes.accountPanelInput }}
                ref={lastNameRef}
                icon={<IconDeviceSim2 size={20} />}
                value={lastNameValue || ""}
                placeholder={"Last Name"}
                onChange={(e) => setLastNameValue(e.target.value)}
                style={{
                  pointerEvents: !lastName ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={lastNameValue ? "Edit Last Name" : "Add Last Name"}
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!lastName) {
                          setLastName(true);
                          lastNameRef.current.focus();
                        } else {
                          updateField({ lastName: lastNameValue }, user);
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
            <Group grow gap={10}>
              <Input
                classNames={{ input: classes.accountPanelInput }}
                ref={phoneRef}
                icon={<IconPhone size={20} />}
                value={formatPhoneNumber(phoneValue) || ""}
                placeholder={"Phone #"}
                onChange={(e) => setPhoneValue(e.target.value)}
                style={{
                  pointerEvents: !phone ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={phoneValue ? "Edit Phone #" : "Add Phone #"}
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!phone) {
                          setPhone(true);
                          phoneRef.current.focus();
                        } else {
                          updateField({ phone: phoneValue }, user);
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
              <Popover
                className={classes.changePassPopover}
                shadow="md"
                width="target"
                position="bottom"
                opened={changePass}
              >
                <PopoverTarget>
                  <Button
                    className={classes.changePassButton}
                    variant="default"
                    fz={13}
                    onClick={() => setChangePass((o) => !o)}
                  >
                    CHANGE PASSWORD
                    <IconKey
                      size={18}
                      stroke={2}
                      color={dark ? "#ccc" : "#222"}
                      style={{
                        marginLeft: "2px",
                      }}
                    />
                  </Button>
                </PopoverTarget>
                <PopoverDropdown>
                  <Button size="xs" onClick={sendPassReset}>
                    SEND PASSWORD RESET CODE
                  </Button>
                </PopoverDropdown>
              </Popover>
            </Group>
            <Group grow gap={10}>
              <Divider
                opacity={0.5}
                labelPosition="right"
                color={dark && "gray.7"}
                label={
                  <HoverCard
                    width={350}
                    withArrow={true}
                    arrowSize={12}
                    withinPortal={true}
                    zIndex={9999}
                  >
                    <HoverCard.Target>
                      <IconInfoCircle stroke={1} size={27} />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text fw={700} fz={12} ta={"center"}>
                        Banking Info is needed to disburse raised funds. Stripe
                        securely handles this process.
                      </Text>
                      <Text fz={11} ta={"center"}>
                        Note that you can still use raised funds for flight and
                        hotel bookings on our platform before adding your
                        banking info.
                      </Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                }
              />
              <Button
                variant="filled"
                fz={12}
                color={dark ? "blue.9" : "blue.4"}
              >
                <IconBuildingBank
                  size={15}
                  stroke={3}
                  opacity={0.5}
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
            style={{
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
            style={{
              borderLeft: dark
                ? "3px solid rgba(255, 255, 255, 0.03)"
                : "3px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Group grow gap={10}>
              <Input
                classNames={{ input: classes.accountPanelInput }}
                ref={faceBookRef}
                value={addAtSymbol(faceBookValue, "/") || ""}
                icon={<IconBrandFacebook size={20} />}
                placeholder="/Facebook"
                onChange={(e) => setFaceBookValue(e.target.value)}
                style={{
                  pointerEvents: !faceBook ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={
                      faceBookValue
                        ? "Edit Facebook handle"
                        : "Add Facebook handle"
                    }
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!faceBook) {
                          setFaceBook(true);
                          faceBookRef.current.focus();
                        } else {
                          updateField({ faceBook: faceBookValue }, user);
                          setFaceBook(false);
                        }
                      }}
                    >
                      {user && user.faceBook ? (
                        <IconPencil size={20} />
                      ) : (
                        <IconCirclePlus size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                }
              />
              <Input
                classNames={{ input: classes.accountPanelInput }}
                ref={instagramRef}
                value={addAtSymbol(instagramValue, "@") || ""}
                icon={<IconBrandInstagram size={20} />}
                placeholder="@Instagram"
                onChange={(e) => setInstagramValue(e.target.value)}
                style={{
                  pointerEvents: !instagram ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={
                      instagramValue
                        ? "Edit Instagram handle"
                        : "Add Instagram handle"
                    }
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!instagram) {
                          setInstagram(true);
                          instagramRef.current.focus();
                        } else {
                          updateField({ instagram: instagramValue }, user);
                          setInstagram(false);
                        }
                      }}
                    >
                      {user && user.instagram ? (
                        <IconPencil size={20} />
                      ) : (
                        <IconCirclePlus size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                }
              />
            </Group>
            <Group grow gap={10}>
              <Input
                classNames={{ input: classes.accountPanelInput }}
                ref={tikTokRef}
                value={addAtSymbol(tikTokValue, "@") || ""}
                icon={<IconBrandTiktok size={20} />}
                placeholder="@TikTok"
                onChange={(e) => setTikTokValue(e.target.value)}
                style={{
                  pointerEvents: !tikTok ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={
                      tikTokValue ? "Edit Tiktok handle" : "Add Tiktok handle"
                    }
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!tikTok) {
                          setTikTok(true);
                          tikTokRef.current.focus();
                        } else {
                          updateField({ tikTok: tikTokValue }, user);
                          setTikTok(false);
                        }
                      }}
                    >
                      {user && user.tikTok ? (
                        <IconPencil size={20} />
                      ) : (
                        <IconCirclePlus size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                }
              />
              <Input
                classNames={{ input: classes.accountPanelInput }}
                ref={twitterRef}
                value={addAtSymbol(twitterValue, "@") || ""}
                icon={<IconBrandTwitter size={20} />}
                placeholder="@Twitter"
                onChange={(e) => setTwitterValue(e.target.value)}
                style={{
                  pointerEvents: !twitter ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    classNames={{ tooltip: "toolTip" }}
                    position="bottom"
                    label={
                      twitterValue
                        ? "Edit Twitter handle"
                        : "Add Twitter handle"
                    }
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      style={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!twitter) {
                          setTwitter(true);
                          twitterRef.current.focus();
                        } else {
                          updateField({ twitter: twitterValue }, user);
                          setTwitter(false);
                        }
                      }}
                    >
                      {user && user.twitter ? (
                        <IconPencil size={20} />
                      ) : (
                        <IconCirclePlus size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                }
              />
            </Group>
          </Flex>
          <Title
            order={6}
            pb={5}
            style={{
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
            style={{
              borderLeft: dark
                ? "3px solid rgba(255, 255, 255, 0.03)"
                : "3px solid rgba(0, 0, 0, 0.1)",
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
      </Box>
    </>
  );
}
