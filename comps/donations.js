import { useState, useRef } from "react";
import {
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
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconReload } from "@tabler/icons";

export default function Donations() {
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
        <Text size="xs" fw={400} color="dimmed" ta="right">
          ${item.amount}
        </Text>
      </td>
    </tr>
  ));

  return (
    <Box
      w="100%"
      sx={{
        boxShadow:
          "0 2px 5px  rgba(0,0,0, 0.15), inset 0 -3px 10px 1px rgba(255,255,255, 0.005)",
      }}
    >
      <Flex gap={0}>
        <Divider w="100%" label="Donations" />
        <SegmentedControl
          color="dark"
          value={sorted}
          onChange={setSorted}
          data={[
            { label: "Time", value: "time" },
            { label: "Amount", value: "amount" },
          ]}
          size="xs"
          top={-4}
          right={-14}
          w="40%"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            transform: "scale(0.8)",
          }}
        />
      </Flex>
      <Box
        p={10}
        m={0}
        h={585}
        ref={donationsRef}
        type="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
          overflow: "auto",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.005)",
          boxShadow: `${
            entry?.isIntersecting
              ? "none"
              : "rgba(0, 0, 0, 0.37) 0px -10px 10px -5px inset"
          }`,
          borderBottom: `${
            entry?.isIntersecting ? "none" : "1px solid rgba(0, 0, 0, .4)"
          }`,
        }}
      >
        <Table verticalSpacing="md" highlightOnHover>
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
        <Box ref={ref}></Box>
        <Center>
          <Button
            variant="default"
            compact
            pr={10}
            mb={10}
            leftIcon={<IconReload size={14} />}
          >
            Load More
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
