import { useState, useRef } from "react";
import { useRouter } from "next/router";
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
  TextInput,
  Popover,
  Divider,
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
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useWindowEvent } from "@mantine/hooks";
import { formatPhoneNumber, addAtSymbol, updateField } from "../../libs/custom";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AccountInfo(props) {
  const { user } = props;
  const router = useRouter();

  const [changePass, setChangePass] = useState(false);

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

  const faceBookRef = useRef();
  const [faceBook, setFaceBook] = useState(false);
  const [faceBookValue, setFaceBookValue] = useState(
    user && user.faceBook ? user.faceBook : ""
  );

  const instagramRef = useRef();
  const [instagram, setInstagram] = useState(false);
  const [instagramValue, setInstagramValue] = useState(
    user && user.instagram ? user.instagram : ""
  );

  const tikTokRef = useRef();
  const [tikTok, setTikTok] = useState(false);
  const [tikTokValue, setTikTokValue] = useState(
    user && user.tikTok ? user.tikTok : ""
  );

  const twitterRef = useRef();
  const [twitter, setTwitter] = useState(false);
  const [twitterValue, setTwitterValue] = useState(
    user && user.twitter ? user.twitter : ""
  );

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

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
            router.replace(router.asPath);
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
              borderLeft: dark
                ? "3px solid rgba(255, 255, 255, 0.1)"
                : "3px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Group grow spacing={10}>
              <TextInput
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
                    label={
                      firstNameValue ? "Edit First Name" : "Add First Name"
                    }
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!firstName) {
                          setFirstName(true);
                          firstNameRef.current.focus();
                        } else {
                          updateField({ firstName: firstNameValue }, user);
                          router.replace(router.asPath);
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
                    label={lastNameValue ? "Edit Last Name" : "Add Last Name"}
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!lastName) {
                          setLastName(true);
                          lastNameRef.current.focus();
                        } else {
                          updateField({ lastName: lastNameValue }, user);
                          router.replace(router.asPath);
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
                value={formatPhoneNumber(phoneValue)}
                placeholder={"Phone #"}
                onChange={(e) => setPhoneValue(e.target.value)}
                sx={{
                  pointerEvents: !phone ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    label={phoneValue ? "Edit Phone #" : "Add Phone #"}
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!phone) {
                          setPhone(true);
                          phoneRef.current.focus();
                        } else {
                          updateField({ phone: phoneValue }, user);
                          router.replace(router.asPath);
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
                width="target"
                position="bottom"
                opened={changePass}
                styles={(theme) => ({
                  dropdown: {
                    border: dark ? "1px solid #1c1c1c" : "1px solid #ececec",
                  },
                })}
              >
                <Popover.Target>
                  <Button
                    variant="default"
                    fz={13}
                    sx={{
                      "&:hover": {
                        background: dark && "#909296",
                      },
                    }}
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
                </Popover.Target>
                <Popover.Dropdown>
                  <Button size="xs" onClick={sendPassReset}>
                    SEND PASSWORD RESET CODE
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </Group>
            <Group grow spacing={10}>
              <Divider opacity={0.5} />
              <Button
                variant="filled"
                color="green"
                bg={"rgb(0, 151, 0)"}
                fz={12}
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
              borderLeft: dark
                ? "3px solid rgba(255, 255, 255, 0.1)"
                : "3px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Group grow spacing={10}>
              <Input
                ref={faceBookRef}
                value={addAtSymbol(faceBookValue, "/")}
                icon={<IconBrandFacebook size={20} />}
                placeholder="/Facebook"
                onChange={(e) => setFaceBookValue(e.target.value)}
                sx={{
                  pointerEvents: !faceBook ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    label={
                      faceBookValue
                        ? "Edit Facebook handle"
                        : "Add Facebook handle"
                    }
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!faceBook) {
                          setFaceBook(true);
                          faceBookRef.current.focus();
                        } else {
                          updateField({ faceBook: faceBookValue }, user);
                          router.replace(router.asPath);
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
                ref={instagramRef}
                value={addAtSymbol(instagramValue, "@")}
                icon={<IconBrandInstagram size={20} />}
                placeholder="@Instagram"
                onChange={(e) => setInstagramValue(e.target.value)}
                sx={{
                  pointerEvents: !instagram ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    label={
                      instagramValue
                        ? "Edit Instagram handle"
                        : "Add Instagram handle"
                    }
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!instagram) {
                          setInstagram(true);
                          instagramRef.current.focus();
                        } else {
                          updateField({ instagram: instagramValue }, user);
                          router.replace(router.asPath);
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
            <Group grow spacing={10}>
              <Input
                ref={tikTokRef}
                value={addAtSymbol(tikTokValue, "@")}
                icon={<IconBrandTiktok size={20} />}
                placeholder="@TikTok"
                onChange={(e) => setTikTokValue(e.target.value)}
                sx={{
                  pointerEvents: !tikTok ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    label={
                      tikTokValue ? "Edit Tiktok handle" : "Add Tiktok handle"
                    }
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!tikTok) {
                          setTikTok(true);
                          tikTokRef.current.focus();
                        } else {
                          updateField({ tikTok: tikTokValue }, user);
                          router.replace(router.asPath);
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
                ref={twitterRef}
                value={addAtSymbol(twitterValue, "@")}
                icon={<IconBrandTwitter size={20} />}
                placeholder="@Twitter"
                onChange={(e) => setTwitterValue(e.target.value)}
                sx={{
                  pointerEvents: !twitter ? "none" : "all",
                }}
                rightSection={
                  <Tooltip
                    label={
                      twitterValue
                        ? "Edit Twitter handle"
                        : "Add Twitter handle"
                    }
                    position="bottom"
                  >
                    <ActionIcon
                      opacity={0.5}
                      variant="subtle"
                      color={dark ? "gray.3" : "gray.6"}
                      sx={{
                        pointerEvents: "all",
                      }}
                      onClick={() => {
                        if (!twitter) {
                          setTwitter(true);
                          twitterRef.current.focus();
                        } else {
                          updateField({ twitter: twitterValue }, user);
                          router.replace(router.asPath);
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
              borderLeft: dark
                ? "3px solid rgba(255, 255, 255, 0.1)"
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
