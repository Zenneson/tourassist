import { useState, useRef } from "react";
import {
  useMantineTheme,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Divider,
  Group,
  SegmentedControl,
  Text,
  Table,
  Title,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconReload } from "@tabler/icons-react";

export default function Donations({ dHeight }) {
  const theme = useMantineTheme();
  const [sorted, setSorted] = useState("time");
  const donationsRef = useRef();
  const { ref, entry } = useIntersection({
    root: donationsRef.current,
    threshold: 1,
  });

  let donateData = [
    {
      name: "Anonymus",
      amount: 100,
    },
    {
      name: "Jill Jailbreaker",
      amount: 50,
    },
    {
      name: "Henry Silkeater",
      amount: 20,
    },
    {
      name: "Bill Horsefighter",
      amount: 150,
    },
    {
      name: "Anonymus",
      amount: 200,
    },
    {
      name: "Anonymus",
      amount: 100,
    },
    {
      name: "Jill Jailbreaker",
      amount: 50,
    },
    {
      name: "Henry Silkeater",
      amount: 20,
    },
    {
      name: "Bill Horsefighter",
      amount: 150,
    },
    {
      name: "Anonymus",
      amount: 200,
    },
    {
      name: "Henry Silkeater",
      amount: 20,
    },
    {
      name: "Bill Horsefighter",
      amount: 150,
    },
    {
      name: "Anonymus",
      amount: 200,
    },
    {
      name: "Anonymus",
      amount: 100,
    },
    {
      name: "Jill Jailbreaker",
      amount: 50,
    },
    {
      name: "Henry Silkeater",
      amount: 20,
    },
    {
      name: "Bill Horsefighter",
      amount: 150,
    },
  ];

  const donateOrder =
    sorted === "time"
      ? donateData
      : donateData.sort((a, b) => (a.amount < b.amount ? 1 : -1));

  const rows = donateOrder.map((item, index) => (
    <tr key={index}>
      <td>
        <Group>
          <Avatar radius="xl">{item.name.charAt(0)}</Avatar>
          <Text size="sm" weight={500}>
            {item.name}
          </Text>
        </Group>
      </td>
      <td>
        <Text size="xs" fw={700} color="dimmed" ta="center">
          ${item.amount}
        </Text>
      </td>
    </tr>
  ));

  return (
    <Box w="100%" pos={"relative"}>
      <Flex gap={0} pt={10} px={10}>
        <Divider
          w="100%"
          label={
            <Title order={6} opacity={0.4} mr={20}>
              10 Donations
            </Title>
          }
        />
        <SegmentedControl
          value={sorted}
          onChange={setSorted}
          data={[
            { label: "Time", value: "time" },
            { label: "Amount", value: "amount" },
          ]}
          size="xs"
          top={-4}
          right={-16}
          w="45%"
          sx={{
            transform: "scale(0.8)",
          }}
        />
      </Flex>
      <Box
        pos={"absolute"}
        top={0}
        left={0}
        w={"100%"}
        h={"100%"}
        sx={{
          pointerEvents: "none",
          zIndex: 100,
          borderRadius: 3,
          boxShadow: `${
            entry?.isIntersecting
              ? "none"
              : theme.colorScheme === "dark"
              ? "rgba(0, 0, 0, 1) 0px -15px 7px -5px inset"
              : "rgba(0, 0, 0, 0.25) 0px -10px 7px -5px inset"
          }`,
        }}
      />
      <Box
        p={10}
        m={0}
        mah={dHeight}
        mih={350}
        ref={donationsRef}
        type="auto"
        sx={{
          overflow: "auto",
          borderRadius: 3,
        }}
      >
        <Table verticalSpacing="xs" highlightOnHover striped withColumnBorders>
          <tbody>
            {rows.length !== 0 ? (
              rows
            ) : (
              <Text color="dimmed" ta="center" fz={12}>
                Your trips will be listed here...
              </Text>
            )}
          </tbody>
        </Table>
        <Box ref={ref} />
        <Center>
          <Button
            variant="default"
            compact
            pr={10}
            my={10}
            leftIcon={<IconReload size={14} />}
          >
            Load More
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
