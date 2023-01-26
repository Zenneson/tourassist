import {} from "react";
import {
  Avatar,
  ScrollArea,
  UnstyledButton,
  Text,
  Group,
  RingProgress,
  Divider,
  Stack,
} from "@mantine/core";

export default function Trips() {
  return (
    <ScrollArea mt={20}>
      <Stack>
        <UnstyledButton
          p={10}
          w="100%"
          sx={{
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Group position="apart">
            <Group spacing={10} w={242} position="apart">
              <Group spacing={5}>
                <Avatar
                  variant="subtle"
                  radius={100}
                  size={65}
                  sx={{
                    boxShadow: "0 0 5px -1px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  G
                </Avatar>
                <div style={{ padding: "0 10px" }}>
                  <Text size="lg" fw={700}>
                    Grenada
                  </Text>
                </div>
              </Group>
              <Divider orientation="vertical" opacity={0.3} />
            </Group>
            <div style={{ textAlign: "center" }}>
              <Text size="sm" fw={700}>
                Jan 1, 2023
              </Text>
              <Text size="xs" color="dimmed">
                Start Date
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                30
              </Text>
              <Text size="xs" color="dimmed">
                Days Left
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                22
              </Text>
              <Text size="xs" color="dimmed">
                Donations
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700} color="lime">
                $2,345
              </Text>
              <Text size="xs" color="dimmed">
                Money Raised
              </Text>
            </div>
            <RingProgress
              sections={[{ value: 90, color: "lime" }]}
              size={75}
              thickness={7}
              label={
                <Text
                  color="lime"
                  weight={700}
                  align="center"
                  size="lg"
                  fw={900}
                >
                  90
                </Text>
              }
            />
          </Group>
        </UnstyledButton>
        <UnstyledButton
          p={10}
          w="100%"
          sx={{
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Group position="apart">
            <Group justify="flex-start" spacing={10} w={242} position="apart">
              <Group spacing={5}>
                <Avatar
                  variant="subtle"
                  radius={100}
                  size={65}
                  sx={{
                    boxShadow: "0 0 5px -1px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  S
                </Avatar>
                <div style={{ padding: "0 10px" }}>
                  <Text size="lg" fw={700}>
                    Silver Spring
                  </Text>
                  <Text size="xs" color="dimmed">
                    Maryland, United States
                  </Text>
                </div>
              </Group>
              <Divider orientation="vertical" opacity={0.3} />
            </Group>
            <div style={{ textAlign: "center" }}>
              <Text size="sm" fw={700}>
                Feb 12, 2023
              </Text>
              <Text size="xs" color="dimmed">
                Start Date
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                15
              </Text>
              <Text size="xs" color="dimmed">
                Days Left
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                2
              </Text>
              <Text size="xs" color="dimmed">
                Donations
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700} color="lime">
                $300
              </Text>
              <Text size="xs" color="dimmed">
                Money Raised
              </Text>
            </div>
            <RingProgress
              sections={[{ value: 25, color: "red" }]}
              size={75}
              thickness={7}
              label={
                <Text
                  color="red"
                  weight={700}
                  align="center"
                  size="lg"
                  fw={900}
                >
                  25
                </Text>
              }
            />
          </Group>
        </UnstyledButton>
        <UnstyledButton
          p={10}
          w="100%"
          sx={{
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Group position="apart">
            <Group justify="flex-start" spacing={10} w={242} position="apart">
              <Group spacing={5}>
                <Avatar
                  variant="subtle"
                  radius={100}
                  size={65}
                  sx={{
                    boxShadow: "0 0 5px -1px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  T
                </Avatar>
                <div style={{ padding: "0 10px" }}>
                  <Text size="lg" fw={700}>
                    Toyko
                  </Text>
                  <Text size="xs" color="dimmed">
                    Japan
                  </Text>
                </div>
              </Group>
              <Divider orientation="vertical" opacity={0.3} />
            </Group>
            <div style={{ textAlign: "center" }}>
              <Text size="sm" fw={700}>
                Mar 16, 2023
              </Text>
              <Text size="xs" color="dimmed">
                Start Date
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                45
              </Text>
              <Text size="xs" color="dimmed">
                Days Left
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                15
              </Text>
              <Text size="xs" color="dimmed">
                Donations
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700} color="lime">
                $1,234
              </Text>
              <Text size="xs" color="dimmed">
                Money Raised
              </Text>
            </div>
            <RingProgress
              sections={[{ value: 45, color: "yellow" }]}
              size={75}
              thickness={7}
              label={
                <Text
                  color="yellow"
                  weight={700}
                  align="center"
                  size="lg"
                  fw={900}
                >
                  45
                </Text>
              }
            />
          </Group>
        </UnstyledButton>
        <UnstyledButton
          p={10}
          w="100%"
          sx={{
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Group position="apart">
            <Group justify="flex-start" spacing={10} w={242} position="apart">
              <Group spacing={5}>
                <Avatar
                  variant="subtle"
                  radius={100}
                  size={65}
                  sx={{
                    boxShadow: "0 0 5px -1px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  T
                </Avatar>
                <div style={{ padding: "0 10px" }}>
                  <Text size="lg" fw={700}>
                    Texas
                  </Text>
                  <Text size="xs" color="dimmed">
                    United States
                  </Text>
                </div>
              </Group>
              <Divider orientation="vertical" opacity={0.3} />
            </Group>
            <div style={{ textAlign: "center" }}>
              <Text size="sm" fw={700}>
                Jun 5, 2023
              </Text>
              <Text size="xs" color="dimmed">
                Start Date
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                8
              </Text>
              <Text size="xs" color="dimmed">
                Days Left
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700}>
                7
              </Text>
              <Text size="xs" color="dimmed">
                Donations
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text size="md" fw={700} color="lime">
                $234
              </Text>
              <Text size="xs" color="dimmed">
                Money Raised
              </Text>
            </div>
            <RingProgress
              sections={[{ value: 20, color: "red" }]}
              size={75}
              thickness={7}
              label={
                <Text
                  color="red"
                  weight={700}
                  align="center"
                  size="lg"
                  fw={900}
                >
                  20
                </Text>
              }
            />
          </Group>
        </UnstyledButton>
      </Stack>
    </ScrollArea>
  );
}
