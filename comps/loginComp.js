import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../libs/firebase";
import {
  Anchor,
  Box,
  Button,
  Flex,
  TextInput,
  PasswordInput,
  Stack,
  Group,
  Checkbox,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useToggle, upperFirst } from "@mantine/hooks";
import { visibleState } from "../pages/index";
import { loginOpenedState } from "../comps/loginModal";
import {
  IconBrandGoogle,
  IconBrandTwitter,
  IconBrandFacebook,
  IconLogin,
} from "@tabler/icons";

export const loginTypeState = atom({
  key: "loginTypeState",
  default: "login",
});

export default function LoginComp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [visible, setVisible] = useRecoilState(visibleState);
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [type, toggle] = useToggle(["login", "sign-up"]);
  const [loginType, setLoginType] = useRecoilState(loginTypeState);

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
      transform: floating ? `translate(-${theme.spacing.sm}px, -28px)` : "none",
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

  const { classes } = useStyles({
    floating: firstName.trim().length !== 0 || firstNameFocus,
  });
  const { classes: classes2 } = useStyles({
    floating: lastName.trim().length !== 0 || lastNameFocus,
  });
  const { classes: classes3 } = useStyles({
    floating: email.trim().length !== 0 || emailFocus,
  });
  const { classes: classes4 } = useStyles({
    floating: password.trim().length !== 0 || passwordFocus,
  });

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const auth = getAuth(app);
  const signInWithGoogle = async () => {
    const userCred = await signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        setVisible(true);
        setLoginOpened(false);
        showNotification({
          title: "Signed in with Google",
          message: `Welcome ${result.user.displayName}`,
          color: "#00E8FC",
          icon: <IconBrandGoogle size={15} />,
          autoClose: 2500,
          style: { backgroundColor: "#2e2e2e" },
        });
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          const pendingCred = error.credential;
          signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
            result.user.linkWithCredential(pendingCred).then(() => {
              setVisible(true);
              setLoginOpened(false);
              showNotification({
                title: "Signed in with Google",
                message: `Welcome ${result.user.displayName}`,
                color: "#00E8FC",
                icon: <IconBrandGoogle size={15} />,
                autoClose: 2500,
                style: { backgroundColor: "#2e2e2e" },
              });
            });
            console.log("Credential Linked");
          });
        }
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("Google Login Error: ", error);
      });
  };

  const signInWithTwitter = async () => {
    const userCred = await signInWithPopup(auth, new TwitterAuthProvider())
      .then((result) => {
        const credential = TwitterAuthProvider.credentialFromResult(result);
        setVisible(true);
        setLoginOpened(false);
        showNotification({
          title: "Signed in with Twitter",
          message: `Welcome ${result.user.displayName}`,
          color: "#00E8FC",
          icon: <IconBrandTwitter size={15} />,
          autoClose: 2500,
          style: { backgroundColor: "#2e2e2e" },
        });
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          const pendingCred = error.credential;
          signInWithPopup(auth, new TwitterAuthProvider()).then((result) => {
            result.user.linkWithCredential(pendingCred).then(() => {
              setVisible(true);
              setLoginOpened(false);
              showNotification({
                title: "Signed in with Twitter",
                message: `Welcome ${result.user.displayName}`,
                color: "#00E8FC",
                icon: <IconBrandTwitter size={15} />,
                autoClose: 2500,
                style: { backgroundColor: "#2e2e2e" },
              });
              console.log("Credential Linked");
            });
          });
        }
        const credential = TwitterAuthProvider.credentialFromError(error);
        console.log("Twitter Login Error: ", error);
      });
  };

  const signInWithFacebook = async () => {
    const userCred = await signInWithPopup(auth, new FacebookAuthProvider())
      .then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        setVisible(true);
        setLoginOpened(false);
        showNotification({
          title: "Signed in with Facebook",
          message: `Welcome ${result.user.displayName}`,
          color: "#00E8FC",
          icon: <IconBrandFacebook size={15} />,
          autoClose: 2500,
          style: { backgroundColor: "#2e2e2e" },
        });
        console.log("+++LOGGED IN WITH FACEBOOK+++");
      })
      .catch((error) => {
        // TODO: Fix this error
        if (error.code === "auth/account-exists-with-different-credential") {
          const pendingCred = error.credential;
          signInWithPopup(auth, new FacebookAuthProvider()).then((result) => {
            result.user.linkWithCredential(pendingCred).then(() => {
              setVisible(true);
              setLoginOpened(false);
              showNotification({
                title: "Signed in with Facebook",
                message: `Welcome ${result.user.displayName}`,
                color: "#00E8FC",
                icon: <IconBrandFacebook size={15} />,
                autoClose: 2500,
                style: { backgroundColor: "#2e2e2e" },
              });
              console.log("Credential Linked");
            });
          });
        }
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log("Facebook Login Error: ", error);
      });
  };

  return (
    <>
      <Box w="100%" mt="xl">
        <Group grow spacing={20}>
          <Button
            onClick={signInWithGoogle}
            variant="default"
            size="xs"
            leftIcon={<IconBrandGoogle size={15} />}
            sx={{
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Google
          </Button>
          <Button
            onClick={signInWithTwitter}
            variant="default"
            size="xs"
            leftIcon={<IconBrandTwitter size={15} />}
            sx={{
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Twitter
          </Button>
          <Button
            onClick={signInWithFacebook}
            variant="default"
            size="xs"
            leftIcon={<IconBrandFacebook size={15} />}
            sx={{
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Facebook
          </Button>
        </Group>
        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === "sign-up" && (
              <Flex gap={20}>
                <TextInput
                  label="First Name"
                  placeholder="FIRST NAME"
                  required
                  classNames={classes}
                  value={firstName}
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                  mt="xl"
                  mb={-19}
                  autoComplete="nope"
                  w="100%"
                />
                <TextInput
                  label="Last Name"
                  placeholder="LAST NAME"
                  required
                  classNames={classes2}
                  value={lastName}
                  onChange={(event) => setLastName(event.currentTarget.value)}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                  mt="xl"
                  mb={-19}
                  autoComplete="nope"
                  w="100%"
                />
              </Flex>
            )}
            <TextInput
              required
              label="Email"
              placeholder="johndoe@gmail.com"
              classNames={classes3}
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              error={form.errors.email && "Invalid email"}
              mt={26}
            />

            <PasswordInput
              required
              label="Password"
              classNames={classes4}
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              mt="xs"
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
            />

            {type === "sign-up" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>
          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={function () {
                setLoginType(type);
                toggle();
              }}
              size="xs"
            >
              {type === "sign-up"
                ? "Already have an account?"
                : "Don't have an account?"}
            </Anchor>
            <Button
              size="xs"
              fw={700}
              uppercase={true}
              variant="default"
              sx={{ color: "rgba(255,255,255,0.3)" }}
              leftIcon={<IconLogin size={15} />}
              onClick={function () {
                setVisible(true);
              }}
            >
              {type === "sign-up" ? "Sign up" : "Login"}
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
