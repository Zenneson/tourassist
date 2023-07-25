import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import {
  useMantineTheme,
  Anchor,
  Box,
  Button,
  Divider,
  TextInput,
  PasswordInput,
  Progress,
  Text,
  Popover,
  Stack,
  Group,
  Checkbox,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle, useSessionStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { estTimeStamp } from "../libs/custom";

const useStyles = createStyles((theme, { floating }) => ({
  root: {
    position: "relative",
  },

  label: {
    position: "absolute",
    zIndex: 2,
    top: 7,
    left: theme.spacing.sm,
    pointerEvents: "none",
    color: theme.colorScheme === "dark" ? "#fff" : "rgba(0,0,0,0.4)",
    transition: "transform 150ms ease, color 150ms ease, font-size 150ms ease",
    transform: floating ? `translate(0, -28px)` : "none",
    fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
    fontWeight: floating ? 500 : 400,
  },

  required: {
    transition: "opacity 150ms ease",
    opacity: floating ? 1 : 0,
  },

  input: {
    "&::placeholder": {
      transition: "color 150ms ease",
      color: !floating ? "transparent" : undefined,
    },
  },
}));

export default function LoginComp({ auth, mapLoaded }) {
  const theme = useMantineTheme();
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [passPopOpened, setPassPopOpened] = useState(false);
  const [type, toggle] = useToggle(["login", "sign-up"]);
  const router = useRouter();
  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });
  const [visible, setVisible] = useSessionStorage({
    key: "visible",
    defaultValue: false,
  });

  if (!user && type === "login" && router.pathname === "/tripplanner") {
    toggle();
  }

  const requirements = [
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
  ];

  function PasswordRequirement({ meets, label }) {
    return (
      <Text
        color={meets ? "#00E8FC" : "red"}
        sx={{ display: "flex", alignItems: "center" }}
        mt={7}
        size="sm"
      >
        {meets ? <IconCheck size={14} /> : <IconX size={14} />}{" "}
        <Box ml={10}>{label}</Box>
      </Text>
    );
  }

  function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(passValue)}
    />
  ));

  const strength = getStrength(passValue);
  const color = strength === 100 ? "#00E8FC" : strength > 50 ? "yellow" : "red";

  const { classes: emailClass } = useStyles({
    floating: emailValue.trim().length !== 0 || emailFocus,
  });
  const { classes: passClass } = useStyles({
    floating: passValue.trim().length !== 0 || passwordFocus,
  });

  const { classes: firstNameClass } = useStyles({
    floating: firstNameValue.trim().length !== 0 || firstNameFocus,
  });
  const { classes: lastNameClass } = useStyles({
    floating: lastNameValue.trim().length !== 0 || lastNameFocus,
  });

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        getStrength(val) !== 100
          ? "Password does not meet the requirements"
          : null,
    },
  });

  const newAccount = {
    color: "green",
    icon: <IconCheck size={20} />,
    style: {
      backgroundColor: theme.colorScheme === "dark" ? "#2e2e2e" : "#fff",
    },
    title: "Account Created",
    message: `${form.values.firstName} ${form.values.lastName}'s account has been created.`,
  };

  const alreadyExists = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: theme.colorScheme === "dark" ? "#2e2e2e" : "#fff",
    },
    title: "Email already in use",
    message: `${form.values.email} is linked to another account.`,
  };

  const userNotFound = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: theme.colorScheme === "dark" ? "#2e2e2e" : "#fff",
    },
    title: "User not found",
    message: `An account for ${form.values.email} does not exist.`,
  };

  const wrongPassword = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: theme.colorScheme === "dark" ? "#2e2e2e" : "#fff",
    },
    title: "Wrong password",
    message: `The password you entered is incorrect.`,
  };

  const addUser = async (user) => {
    setVisible(true);
    setUser(user);
    await setDoc(doc(firestore, "users", user.email), {
      firstName: form.values.firstName,
      lastName: form.values.lastName,
      email: form.values.email,
      uid: user.uid,
      creationTime: estTimeStamp(user.metadata.creationTime),
    });
    notifications.show(newAccount);
  };

  const setLogin = async (user) => {
    setVisible(true);
    setUser(user);
  };

  const handleLogin = () => {
    if (type === "sign-up") {
      createUserWithEmailAndPassword(
        auth,
        form.values.email,
        form.values.password
      )
        .then((userCredential) => {
          addUser(userCredential.user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error Code: ", errorCode);
          console.log("Error Message: ", errorMessage);
          if (errorCode === "auth/email-already-in-use") {
            notifications.show(alreadyExists);
          }
        });
    } else if (type === "login") {
      signInWithEmailAndPassword(auth, form.values.email, form.values.password)
        .then((userCredential) => {
          setLogin(userCredential.user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error Code: ", errorCode);
          console.log("Error Message: ", errorMessage);
          if (errorCode === "auth/user-not-found") {
            notifications.show(userNotFound);
          }
          if (errorCode === "auth/wrong-password") {
            notifications.show(wrongPassword);
          }
        });
    }
  };

  return (
    <>
      <Box w="100%">
        {type === "sign-up" && (
          <Divider
            label={
              <>
                <IconUserCircle size={17} />
                <Text
                  ml={5}
                  fz={10}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  Join TourAssist
                </Text>
              </>
            }
            labelPosition="left"
            c={theme.colorScheme === "dark" ? "#fff" : "#000"}
            mt={16}
            opacity={0.7}
          />
        )}
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            {type === "sign-up" && (
              <Group mt={20} grow>
                <TextInput
                  required
                  label="First Name"
                  placeholder="John"
                  classNames={firstNameClass}
                  value={form.values.firstName}
                  onChange={(event) => {
                    setFirstNameValue(event.currentTarget.value);
                    form.setFieldValue("firstName", event.currentTarget.value);
                  }}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                />
                <TextInput
                  required
                  label="Last Name"
                  placeholder="Doe"
                  classNames={lastNameClass}
                  value={form.values.lastName}
                  onChange={(event) => {
                    setLastNameValue(event.currentTarget.value);
                    form.setFieldValue("lastName", event.currentTarget.value);
                  }}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                />
              </Group>
            )}
            <TextInput
              mt={10}
              required
              label="Email"
              placeholder="johndoe@gmail.com"
              classNames={emailClass}
              value={form.values.email}
              onChange={(event) => {
                setEmailValue(event.currentTarget.value);
                form.setFieldValue("email", event.currentTarget.value);
              }}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              error={form.errors.email && "Invalid email"}
            />
            <Popover
              opened={passPopOpened}
              position="bottom"
              width="target"
              transition="pop"
            >
              <Popover.Target>
                <div
                  onFocusCapture={() => {
                    if (type === "sign-up") setPassPopOpened(true);
                  }}
                  onBlurCapture={() => setPassPopOpened(false)}
                >
                  <PasswordInput
                    required
                    label="Password"
                    classNames={passClass}
                    value={form.values.password}
                    onChange={(event) => {
                      setPassValue(event.currentTarget.value);
                      form.setFieldValue("password", event.currentTarget.value);
                    }}
                    onFocus={() => {
                      setPasswordFocus(true);
                    }}
                    onBlur={() => setPasswordFocus(false)}
                    mt="xs"
                    error={
                      form.errors.password &&
                      "Password does not meet requirements"
                    }
                  />
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <Progress
                  color={color}
                  value={strength}
                  size={5}
                  style={{ marginBottom: 10 }}
                />
                <PasswordRequirement
                  label="Includes at least 6 characters"
                  meets={form.values.password.length > 5}
                />
                {checks}
              </Popover.Dropdown>
            </Popover>
            {type === "sign-up" && (
              <Group position={"left"}>
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  mt={10}
                  required
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                  sx={{
                    ".mantine-Checkbox-label, .mantine-Checkbox-input": {
                      cursor: "pointer",
                    },
                  }}
                />
              </Group>
            )}
          </Stack>
          <Group
            position={router.pathname !== "/tripplanner" ? "apart" : "right"}
            mt={router.pathname !== "/tripplanner" ? "25px" : "-20px"}
          >
            {router.pathname !== "/tripplanner" && (
              <Anchor
                component="button"
                type="button"
                color="#fff"
                size="xs"
                onClick={toggle}
              >
                {type === "sign-up"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Anchor>
            )}
            <Button
              loading={!mapLoaded}
              size={"sm"}
              mt={0}
              fw={700}
              uppercase={true}
              variant="light"
              bg={theme.colorScheme === "dark" ? "dark.5" : "gray.2"}
              c="gray.5"
              sx={{ color: "rgba(255,255,255,0.3)" }}
              type="submit"
            >
              {type === "sign-up" ? "Sign up" : "Login"}
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
