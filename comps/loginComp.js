import { useState } from "react";
import { app } from "../libs/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
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
import { notifications } from "@mantine/notifications";
import { useToggle, useLocalStorage } from "@mantine/hooks";
import {
  IconBrandGoogle,
  IconBrandTwitter,
  IconDoorEnter,
  IconX,
  IconCheck,
  IconUserCheck,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function LoginComp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passPopOpened, setPassPopOpened] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [type, toggle] = useToggle(["login", "sign-up"]);
  const router = useRouter();
  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: null });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });

  if (!user && type === "login" && router.pathname === "/tripplanner") {
    toggle();
  }

  const auth = getAuth(app);

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
      color: "#fff",
      transition:
        "transform 150ms ease, color 150ms ease, font-size 150ms ease",
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

  const { classes: classes3 } = useStyles({
    floating: emailValue.trim().length !== 0 || emailFocus,
  });
  const { classes: classes4 } = useStyles({
    floating: passValue.trim().length !== 0 || passwordFocus,
  });

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lasrName: "",
      password: "",
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        getStrength(val) !== 100
          ? "Password doesn not meet requirements"
          : null,
    },
  });

  function notify(message, icon) {
    notifications.show({
      message: message,
      color: "#00E8FC",
      icon: icon,
      autoClose: 2500,
      style: { backgroundColor: "#2e2e2e", fontWeight: "bold" },
    });
  }

  async function signInWith(signin, provider, icon) {
    const userCred = await signInWithPopup(auth, new provider())
      .then((result) => {
        const credential = provider.credentialFromResult(result);
        setVisible(true);
        notify(`Signed in with ${signin}`, icon);
        setUser(auth.currentUser);
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          const pendingCred = error.credential;
          signInWithPopup(auth, new provider()).then((result) => {
            result.user.linkWithCredential(pendingCred).then(() => {
              setVisible(true);
              notify(`Signed in with ${signin}`, icon);
              setUser(auth.currentUser);
            });
            console.log("Credential Linked");
          });
        }
        const credential = provider.credentialFromError(error);
        console.log("Google Login Error: ", error);
      });
  }

  return (
    <>
      <Box w="100%" mt="xl">
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
                  Create Account
                </Text>
              </>
            }
            labelPosition="left"
            color="rgba(255,255,255,0.3)"
            mt={16}
            mb={20}
            opacity={0.7}
          />
        )}
        <Group grow spacing={20}>
          <Button
            onClick={() =>
              signInWith(
                "Google",
                GoogleAuthProvider,
                <IconBrandGoogle size={15} />
              )
            }
            variant="default"
            size="sm"
            py={5}
            leftIcon={<IconBrandGoogle size={15} />}
            sx={{
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Google
          </Button>
          <Button
            onClick={() =>
              signInWith(
                "Twitter",
                TwitterAuthProvider,
                <IconBrandTwitter size={15} />
              )
            }
            variant="default"
            size="sm"
            py={5}
            leftIcon={<IconBrandTwitter size={15} />}
            sx={{
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Twitter
          </Button>
        </Group>
        <form
          onSubmit={form.onSubmit((event) => {
            if (type === "sign-up") {
              createUserWithEmailAndPassword(
                auth,
                form.values.email,
                form.values.password
              )
                .then((userCredential) => {
                  const user = userCredential.user;
                  // NOTE: set map to Initial Map
                  setVisible(true);
                  // (false);
                  notify("Account Created", <IconDoorEnter size={15} />);
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log("Error Code: ", errorCode);
                  console.log("Error Message: ", errorMessage);
                });
            } else {
              signInWithEmailAndPassword(
                auth,
                form.values.email,
                form.values.password
              )
                .then((userCredential) => {
                  const user = userCredential.user;
                  // NOTE: set map to Initial Map
                  setVisible(true);
                  notify("Signed in", <IconUserCheck size={15} />);
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log("Error Code: ", errorCode);
                  console.log("Error Message: ", errorMessage);
                });
            }
          })}
        >
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="johndoe@gmail.com"
              classNames={classes3}
              value={form.values.email}
              onChange={(event) => {
                setEmailValue(event.currentTarget.value);
                form.setFieldValue("email", event.currentTarget.value);
              }}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              error={form.errors.email && "Invalid email"}
              mt={26}
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
                    classNames={classes4}
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
                      "Password doesn not meet requirements"
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
              <Group
                position={router.pathname !== "/tripplanner" ? "left" : "right"}
              >
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  required
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              </Group>
            )}
          </Stack>
          {router.pathname !== "/tripplanner" && (
            <Group position={"apart"} mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                size="xs"
                onClick={function () {
                  toggle();
                }}
              >
                {type === "sign-up"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Anchor>
              <Button
                size={"sm"}
                mt={0}
                fw={700}
                uppercase={true}
                variant="default"
                sx={{ color: "rgba(255,255,255,0.3)" }}
                type="submit"
              >
                {type === "sign-up" ? "Sign up" : "Login"}
              </Button>
            </Group>
          )}
        </form>
      </Box>
    </>
  );
}
