import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  Center,
  Box,
  Flex,
  Title,
  Text,
  Button,
  Group,
  Overlay,
  Transition,
  Image,
  Card,
  Grid,
  MediaQuery,
} from "@mantine/core";
import { IconWorld, IconInfoSquareRounded } from "@tabler/icons";
import LoginComp from "./loginComp";
import { useLocalStorage } from "@mantine/hooks";

export default function Intro() {
  const [opened, setOpened] = useState(false);
  const [user, setUser] = useLocalStorage({ key: "user" });
  const [visible, setVisible] = useLocalStorage({
    key: "visible",
    defaultValue: false,
  });
  const [mapSpin, setMapSpin] = useLocalStorage({
    key: "mapSpin",
    defaultValue: true,
  });

  const auth = getAuth();
  useEffect(() => {
    if (user) {
      setVisible(true);
      setMapSpin(false);
    } else {
      setMapSpin(true);
      if (!visible) setOpened(true);
    }
  }, [user, setVisible, setMapSpin, visible]);

  return (
    <>
      <Transition
        mounted={opened && !user}
        transition="fade"
        duration={250}
        timingFunction="linear"
      >
        {(styles) => (
          <Flex
            style={styles}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: "105",
            }}
          >
            <Center
              opacity={0.9}
              sx={{
                backgroundColor: "#020202",
                height: "100vh",
                width: "50%",
                minWidth: "450px",
                maxWidth: "1000px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
                flexDirection: "column",
              }}
            >
              <Image
                mt={-60}
                mb={20}
                mr={3}
                sx={{ width: "100%", maxWidth: "350px" }}
                src={"img/blogo.png"}
                alt="TouraSSist_logo"
                withPlaceholder
              />
              <Box
                sx={{
                  width: "80%",
                  maxWidth: "380px",
                }}
              >
                <LoginComp />
              </Box>
            </Center>
            <Center
              sx={{
                width: "100%",
                height: "100vh",
                flexWrap: "wrap",
                zIndex: "105",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  width: "75%",
                  minWidth: "300px",
                }}
              >
                <MediaQuery
                  query="(max-width: 1539px)"
                  styles={{
                    display: "none",
                  }}
                >
                  <Title
                    order={1}
                    fw={900}
                    sx={{
                      fontSize: "4vw",
                      marginBottom: "30px",
                      lineHeight: "1",
                    }}
                  >
                    Where in the{" "}
                    <Text
                      inherit
                      span
                      variant="gradient"
                      gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
                    >
                      world
                    </Text>{" "}
                    would you like to go?
                  </Title>
                </MediaQuery>
                <Grid columns={2} justify="center" gutter={30}>
                  <Grid.Col span="auto" miw={400} maw={400}>
                    <Card
                      shadow="xl"
                      p="lg"
                      radius="xs"
                      bg="rgba(2, 2, 2, 0.85)"
                    >
                      <Card.Section>
                        <Image
                          src="/img/mother.jpg"
                          height={160}
                          alt="mother"
                        />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500} ta="center" w="100%">
                          Realize Your Travel Goals with the Power of
                          Crowdfunding!
                        </Text>
                      </Group>

                      <Text size="sm" color="dimmed">
                        Whether you&apos;re seeking adventure, exploring new
                        cultures, reuniting with loved ones, pursuing your
                        passions, or making lifelong memories on your honeymoon,
                        our platform makes it possible.
                      </Text>
                      <Button
                        fullWidth
                        fw={900}
                        mt="md"
                        size="md"
                        uppercase={true}
                        loaderProps={{ variant: "oval", size: 20 }}
                        variant="gradient"
                        gradient={{ from: "#393939", to: "#282828", deg: 180 }}
                        onClick={() => {
                          setMapSpin(false);
                          setOpened(false);
                          setVisible(true);
                        }}
                        leftIcon={
                          <IconInfoSquareRounded
                            size={23}
                            color="rgba(255,255,255,0.25)"
                          />
                        }
                      >
                        Learn More
                      </Button>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span="auto" miw={400} maw={400}>
                    <Card
                      shadow="xl"
                      p="lg"
                      radius="xs"
                      bg="rgba(2, 2, 2, 0.85)"
                    >
                      <Card.Section>
                        <Image src="/img/women.jpg" height={160} alt="women" />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500} ta="center" w="100%">
                          Make your plans a reality with the help of your
                          community!{" "}
                        </Text>
                      </Group>

                      <Text size="sm" color="dimmed">
                        Share your plans and let the donations roll in. With the
                        power of crowdfunding, you can bring your travel dreams
                        to life. Take the first step of your journey and plan
                        your trip today!
                      </Text>
                      <Button
                        fullWidth
                        fw={900}
                        mt="md"
                        size="md"
                        uppercase={true}
                        loaderProps={{ variant: "oval", size: 20 }}
                        variant="gradient"
                        gradient={{ from: "#004585", to: "#00376b", deg: 180 }}
                        onClick={() => {
                          setMapSpin(false);
                          setOpened(false);
                          setVisible(true);
                        }}
                        leftIcon={
                          <IconWorld size={20} style={{ color: "#00E8FC" }} />
                        }
                      >
                        Plan a trip
                      </Button>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Box>
            </Center>
          </Flex>
        )}
      </Transition>
      <Transition
        mounted={mapSpin}
        transition="fade"
        duration={100}
        exitDuration={100}
        timingFunction="linear"
      >
        {(styles) => (
          <Overlay
            style={styles}
            color="#000"
            opacity={0.77}
            blur={5}
            zIndex={102}
          />
        )}
      </Transition>
    </>
  );
}
