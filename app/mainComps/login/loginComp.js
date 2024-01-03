"use client";
import { formatPhoneNumber } from "@libs/custom";
import { firestore } from "@libs/firebase";
import {
  alreadyExists,
  emailInvalid,
  loggedIn,
  newAccount,
  userNotFound,
  wrongPassword,
} from "@libs/notifications";
import { useAppState } from "@libs/store";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  PasswordInput,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Progress,
  Stack,
  Text,
  TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./styles/loginComp.module.css";

const auth = getAuth();

export default function LoginComp(props) {
  const { setInfoAdded, setPopoverOpened } = props;
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const { setShowLegal } = useAppState();

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
  const phoneNumberFloating =
    phoneNumberFocus || phoneNumberValue.length > 0 || undefined;

  const router = useRouter();
  const pathname = usePathname();

  const [shouldShowPopover, setShouldShowPopover] = useState(false);
  const startingType =
    pathname === "/tripPlanner" ? ["sign-up", "login"] : ["login", "sign-up"];
  const [type, toggle] = useToggle(startingType);

  const requirements = [
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
  ];

  function PasswordRequirement({ meets, label }) {
    return (
      <Text
        c={meets ? "#00E8FC" : "red"}
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

  const addUser = async (user) => {
    await setDoc(doc(firestore, "users", user.email), {
      firstName: form.values.firstName,
      lastName: form.values.lastName,
      email: form.values.email,
      uid: user.uid,
    });
    notifications.show(newAccount(form));
    if (pathname !== "/tripPlanner") {
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
              setPopoverOpened(false);
            })
            .catch((error) => {
              console.error("Error adding user to database: ", error);
            });
        })
        .catch((error) => {
          showError(
            error,
            emailInvalid(form),
            alreadyExists(form),
            "auth/invalid-email",
            "auth/email-already-in-use"
          );
        });
    } else if (type === "login") {
      signInWithEmailAndPassword(auth, form.values.email, form.values.password)
        .then((userCredential) => {
          if (pathname === "/") router.push("/map");
          const message = loggedIn(dark, form.values);
          notifications.show(message);
          setPopoverOpened(false);
        })
        .catch((error) => {
          showError(
            error,
            userNotFound(form),
            wrongPassword,
            "auth/user-not-found",
            "auth/wrong-password"
          );
        });
    }
  };

  const authProviders = [
    {
      name: "Google",
      iconLink: "/img/logos/google.svg",
      func: () => {},
    },
    {
      name: "Facebook",
      iconLink: "/img/logos/facebook.svg",
      func: () => {},
    },
    {
      name: "Twitter",
      iconLink: "/img/logos/x.svg",
      func: () => {},
    },
    {
      name: "Apple",
      iconLink: "/img/logos/apple.svg",
      func: () => {},
    },
  ];

  const authList = authProviders.map((provider, index) => {
    return (
      <Button
        className={classes.authProvider}
        key={index}
        size="lg"
        variant="light"
        w={"25%"}
        onClick={provider.func}
      >
        <Image
          src={provider.iconLink}
          alt={provider.name}
          height={22}
          width={22}
          style={{
            filter:
              dark && provider.name === "Twitter"
                ? "invert(100%) sepia(6%) saturate(7475%) hue-rotate(337deg) brightness(109%) contrast(96%)"
                : "none",
          }}
        />
      </Button>
    );
  });

  useEffect(() => {
    router.prefetch("/map");
  }, [router]);

  return (
    <>
      <Box w="100%">
        {pathname !== "/" && (
          <Divider
            label={
              type === "sign-up" ? (
                <Text fw={100} fz={12}>
                  SIGN UP
                </Text>
              ) : (
                <Text fw={100} fz={12}>
                  LOGIN
                </Text>
              )
            }
            opacity={0.1}
            labelPosition="left"
            color={dark ? "#fff" : "#000"}
            c={dark ? "#fff" : "#000"}
            mt={10}
          />
        )}
        <Button.Group
          classNames={{ group: classes.authBtnGroup }}
          mt={pathname === "/" ? 0 : 15}
        >
          {authList}
        </Button.Group>
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack gap={0}>
            {type === "sign-up" && (
              <>
                <Group mt={20} mb={5} grow>
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
                      form.setFieldValue(
                        "firstName",
                        event.currentTarget.value
                      );
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
                <TextInput
                  required={!phoneNumberFloating}
                  label="Phone Number"
                  labelProps={{ "data-floating": phoneNumberFloating }}
                  autoComplete="tel-national"
                  mt={15}
                  type="number"
                  clampbehavior="strict"
                  value={formatPhoneNumber(form.values.phoneNumber)}
                  placeholder={
                    phoneNumberFocus && phoneNumberValue === ""
                      ? "123 456 7890"
                      : ""
                  }
                  classNames={{
                    root: classes.root,
                    input: classes.input,
                    label: phoneNumberFloating
                      ? classes.labelFloating
                      : classes.label,
                  }}
                  onChange={(event) => {
                    setPhoneNumberValue(event.currentTarget.value);
                    form.setFieldValue(
                      "phoneNumber",
                      event.currentTarget.value
                    );
                  }}
                  onFocus={() => setPhoneNumberFocus(true)}
                  onBlur={() => setPhoneNumberFocus(false)}
                  style={{
                    fontSize: phoneNumberFloating
                      ? "var(--mantine-font-size-xs)"
                      : "var(--mantine-font-size-sm)",
                    fontWeight: phoneNumberFloating ? 500 : 400,
                    "--dynamic-placeholder-color": phoneNumberFloating
                      ? undefined
                      : "transparent",
                  }}
                />
              </>
            )}
            <TextInput
              mt={20}
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
              mt={20}
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
              <PopoverTarget>
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
              </PopoverTarget>
              <PopoverDropdown>
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
              </PopoverDropdown>
            </Popover>
          </Stack>
          <Group justify={"space-between"} mt={20}>
            {type === "sign-up" && (
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
                required
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
            {type === "login" && (
              <Group
                pos={"relative"}
                justify={"space-between"}
                w={"calc( 100% - 100px )"}
              >
                <Image
                  className={classes.loginGlobe}
                  alt="Traveling"
                  src={
                    dark
                      ? "/img/login/planetDark.svg"
                      : "/img/login/planetLight.svg"
                  }
                  h={36}
                  w={36}
                />
                <Divider
                  className={classes.loginDivider}
                  w={"calc( 100% - 60px )"}
                />
              </Group>
            )}
            <Button
              className={classes.loginButton}
              size={"sm"}
              mt={0}
              variant="light"
              type="submit"
            >
              {type === "sign-up" ? "Sign up" : "Login"}
            </Button>
          </Group>
          <Group justify="flex-end">
            <Anchor
              className={classes.termsLink}
              component="button"
              type="button"
              mt={2}
              fz={8}
              onClick={toggle}
            >
              {type === "sign-up"
                ? "Already have an account?"
                : "Don't have an account?"}
            </Anchor>
          </Group>
        </form>
      </Box>
    </>
  );
}
