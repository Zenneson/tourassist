import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../libs/firebase";
import {
  useComputedColorScheme,
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { loggedIn } from "../libs/custom";
import { useUser } from "../libs/context";
import classes from "./loginComp.module.css";

export default function LoginComp(props) {
  const { auth, setInfoAdded, setShowLegal } = props;
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");

  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";

  const emailFloating = emailFocus || emailValue.length > 0 || undefined;
  const passFloating = passwordFocus || passValue.length > 0 || undefined;
  const firstNameFloating =
    firstNameFocus || firstNameValue.length > 0 || undefined;
  const lastNameFloating =
    lastNameFocus || lastNameValue.length > 0 || undefined;

  const [shouldShowPopover, setShouldShowPopover] = useState(false);
  const [type, toggle] = useToggle(["login", "sign-up"]);

  const router = useRouter();

  const { user } = useUser();

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
        style={{ display: "flex", alignItems: "center" }}
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

  useEffect(() => {
    if (strength === 100) {
      const timer = setTimeout(() => {
        setShouldShowPopover(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      if (passValue.length > 0 && type === "sign-up") {
        setShouldShowPopover(true);
      }
    }
  }, [strength, passValue, type]);

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
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    title: "Welcome",
    message: `${form.values.firstName} ${form.values.lastName}'s account has been created.`,
  };

  const emailInvalid = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    title: "Invalid Email",
    message: `${form.values.email} is not a valid email address.`,
  };

  const alreadyExists = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    title: "Email already in use",
    message: `${form.values.email} is linked to another account.`,
  };

  const userNotFound = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    title: "User not found",
    message: `An account for ${form.values.email} does not exist.`,
  };

  const wrongPassword = {
    color: "red",
    icon: <IconX size={20} />,
    style: {
      backgroundColor: dark ? "#2e2e2e" : "#fff",
    },
    title: "Wrong password",
    message: `The password you entered is incorrect.`,
  };

  const addUser = async (user) => {
    await setDoc(doc(firestore, "users", user.email), {
      firstName: form.values.firstName,
      lastName: form.values.lastName,
      email: form.values.email,
      uid: user.uid,
    });
    notifications.show(newAccount);
    if (router.pathname !== "/tripplanner") {
      router.push("/map");
    }
  };

  const showError = (error, messageOne, messageTwo, codeOne, codeTwo) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error Code: ", errorCode);
    console.error("Error Message: ", errorMessage);
    if (errorCode === codeOne) {
      notifications.show(messageOne);
    }
    if (errorCode === codeTwo) {
      notifications.show(messageTwo);
    }
  };

  const handleLogin = () => {
    if (type === "sign-up") {
      createUserWithEmailAndPassword(
        auth,
        form.values.email,
        form.values.password
      )
        .then((userCredential) => {
          addUser(userCredential.user)
            .then(() => {
              setInfoAdded(true);
            })
            .catch((error) => {
              console.error("Error adding user to database: ", error);
            });
        })
        .catch((error) => {
          showError(
            error,
            emailInvalid,
            alreadyExists,
            "auth/invalid-email",
            "auth/email-already-in-use"
          );
        });
    } else if (type === "login") {
      signInWithEmailAndPassword(auth, form.values.email, form.values.password)
        .then((userCredential) => {
          const message = loggedIn(dark, form.values);
          notifications.show(message);
          router.push("/map");
        })
        .catch((error) => {
          showError(
            error,
            userNotFound,
            wrongPassword,
            "auth/user-not-found",
            "auth/wrong-password"
          );
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
                  style={{
                    textTransform: "uppercase",
                  }}
                >
                  Join TourAssist
                </Text>
              </>
            }
            labelPosition="left"
            color={dark ? "#fff" : "#000"}
            c={dark ? "#fff" : "#000"}
            mt={16}
            opacity={0.2}
          />
        )}
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            {type === "sign-up" && (
              <Group mt={20} grow>
                <TextInput
                  required={!firstNameFloating}
                  label="First Name"
                  labelProps={{ "data-floating": firstNameFloating }}
                  autoComplete="given-name"
                  value={form.values.firstName}
                  placeholder={
                    firstNameFocus && firstNameValue === "" ? "John" : ""
                  }
                  classNames={{
                    root: classes.root,
                    input: classes.input,
                    label: firstNameFloating
                      ? classes.labelFloating
                      : classes.label,
                  }}
                  onChange={(event) => {
                    setFirstNameValue(event.currentTarget.value);
                    form.setFieldValue("firstName", event.currentTarget.value);
                  }}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                  style={{
                    fontSize: firstNameFloating
                      ? "var(--mantine-font-size-xs)"
                      : "var(--mantine-font-size-sm)",
                    fontWeight: firstNameFloating ? 500 : 400,
                    "--dynamic-placeholder-color": firstNameFloating
                      ? undefined
                      : "transparent",
                  }}
                />
                <TextInput
                  required={!lastNameFloating}
                  label="Last Name"
                  labelProps={{ "data-floating": lastNameFloating }}
                  autoComplete="family-name"
                  value={form.values.lastName}
                  placeholder={
                    lastNameFocus && lastNameValue === "" ? "Smith" : ""
                  }
                  classNames={{
                    root: classes.root,
                    input: classes.input,
                    label: lastNameFloating
                      ? classes.labelFloating
                      : classes.label,
                  }}
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
              required={!emailFloating}
              label="Email"
              labelProps={{ "data-floating": emailFloating }}
              placeholder={
                emailFocus && emailValue === "" ? "johndoe@gmail.com" : ""
              }
              autoComplete="username"
              value={form.values.email}
              classNames={{
                root: classes.root,
                input: classes.input,
                label: emailFloating ? classes.labelFloating : classes.label,
              }}
              onChange={(event) => {
                setEmailValue(event.currentTarget.value);
                form.setFieldValue("email", event.currentTarget.value);
              }}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              error={form.errors.email && "Invalid email"}
            />
            <Popover
              opened={
                shouldShowPopover && passValue.length > 0 && type === "sign-up"
              }
              position="bottom"
              width="target"
              shadow="md"
              withinPortal={false}
              transitionProps={{
                transition: "pop",
              }}
            >
              <Popover.Target>
                <PasswordInput
                  required={!passFloating}
                  label="Password"
                  labelProps={{ "data-floating": passFloating }}
                  name="password"
                  mt="xs"
                  autoComplete={"current-password" || "new-password"}
                  value={form.values.password}
                  classNames={{
                    root: classes.root,
                    input: classes.input,
                    label: passFloating ? classes.labelFloating : classes.label,
                  }}
                  onChange={(event) => {
                    setPassValue(event.currentTarget.value);
                    form.setFieldValue("password", event.currentTarget.value);
                  }}
                  onFocus={() => {
                    if (type === "sign-up") setShouldShowPopover(true);
                    setPasswordFocus(true);
                  }}
                  onBlur={() => setPasswordFocus(false)}
                  placeholder={
                    passwordFocus && passValue === "" ? "**********" : ""
                  }
                  error={
                    form.errors.password &&
                    "Password does not meet requirements"
                  }
                />
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
              <Group justify="flex-start">
                <Checkbox
                  classNames={{
                    label: classes.termsCheckbox,
                    input: classes.termsCheckbox,
                  }}
                  size="xs"
                  label={
                    <Box>
                      I accept{" "}
                      <Anchor
                        c={dark ? "blue.3" : "blue.5"}
                        size="xs"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowLegal(true);
                        }}
                      >
                        terms and conditions
                      </Anchor>
                    </Box>
                  }
                  checked={form.values.terms}
                  mt={10}
                  required
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              </Group>
            )}
          </Stack>
          <Group
            justify={
              router.pathname !== "/tripplanner" ? "space-between" : "flex-end"
            }
            mt={router.pathname !== "/tripplanner" ? "25px" : "-20px"}
          >
            {router.pathname !== "/tripplanner" && (
              <Anchor
                component="button"
                type="button"
                color={dark ? "#fff" : "#4e4e4e"}
                size="xs"
                onClick={toggle}
              >
                {type === "sign-up"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Anchor>
            )}
            <Button
              size={"sm"}
              mt={0}
              fw={700}
              variant="light"
              bg={dark ? "dark.5" : "gray.2"}
              c="gray.5"
              style={{
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
              }}
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
