import { useState, useRef, useEffect } from "react";
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
  ScrollArea,
} from "@mantine/core";
import { useIntersection, useSessionStorage } from "@mantine/hooks";
import { IconReload } from "@tabler/icons-react";

export default function Donations(props) {
  const { dHeight } = props;
  const theme = useMantineTheme();
  const [sorted, setSorted] = useState("time");
  const donationsRef = useRef();
  const { ref, entry } = useIntersection({
    root: donationsRef.current,
    threshold: 1,
  });

  const [user, setUser] = useSessionStorage({
    key: "user",
    defaultValue: null,
  });

  const [donations, setDonations] = useSessionStorage({
    key: "donations",
    defaultValue: [],
  });

  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: [],
  });

  useEffect(() => {
    const donateData = [
      {
        name: "Anonymus",
        amount: 100,
        time: "8/5/2023, 2:30:22 PM",
      },
      {
        name: "Jill Jailbreaker",
        amount: 50,
        time: "7/12/2023, 6:23:45 PM",
      },
      {
        name: "Henry Silkeater",
        amount: 20,
        time: "5/25/2023, 10:51:13 AM",
      },
      {
        name: "Bill Horsefighter",
        amount: 150,
        time: "5/1/2023, 4:23:10 PM",
      },
      {
        name: "Anonymus",
        amount: 100,
        time: "3/11/2023, 8:15:32 AM",
      },
      {
        name: "Anonymus",
        amount: 200,
        time: "2/12/2023, 1:32:40 PM",
      },
      {
        name: "Henry Silkeater",
        amount: 20,
        time: "1/30/2023, 4:58:11 PM",
      },
      {
        name: "Anonymus",
        amount: 100,
        time: "12/2/2022, 6:24:19 PM",
      },
      {
        name: "Jill Jailbreaker",
        amount: 50,
        time: "11/30/2022, 5:42:17 PM",
      },
      {
        name: "Anonymus",
        amount: 200,
        time: "11/8/2022, 12:55:30 AM",
      },
      {
        name: "Bill Horsefighter",
        amount: 150,
        time: "10/15/2022, 9:45:00 PM",
      },
      {
        name: "Bill Horsefighter",
        amount: 150,
        time: "9/23/2022, 5:30:00 PM",
      },
      {
        name: "Henry Silkeater",
        amount: 20,
        time: "9/18/2022, 2:12:05 AM",
      },
      {
        name: "Jill Jailbreaker",
        amount: 50,
        time: "7/1/2022, 1:14:54 PM",
      },
      {
        name: "Anonymus",
        amount: 200,
        time: "6/29/2022, 7:21:07 PM",
      },
      {
        name: "Bill Horsefighter",
        amount: 150,
        time: "6/9/2022, 9:30:00 PM",
      },
      {
        name: "Jill Jailbreaker",
        amount: 50,
        time: "5/22/2022, 10:13:42 AM",
      },
      {
        name: "Anonymus",
        amount: 200,
        time: "4/2/2022, 1:24:54 PM",
      },
      {
        name: "Anonymus",
        amount: 100,
        time: "3/15/2022, 7:09:28 PM",
      },
      {
        name: "Henry Silkeater",
        amount: 20,
        time: "2/17/2022, 8:33:05 AM",
      },
    ];

    if (donations.length === 0) {
      setDonations(donateData);
    }
  }, [donations, setDonations]);

  const donateOrder =
    sorted === "amount"
      ? donations.sort((a, b) => b.amount - a.amount)
      : donations.sort((a, b) => new Date(b.time) - new Date(a.time));

  const rows = donateOrder?.map((item, index) => (
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
        {donations?.length !== 0 && (
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
        )}
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
              ? "rgba(0, 0, 0, 0.7) 0px -15px 7px -5px inset"
              : "rgba(0, 0, 0, 0.25) 0px -10px 7px -5px inset"
          }`,
        }}
      />
      <Box
        p={10}
        pb={20}
        m={0}
        h={dHeight}
        mih={donations.length === 0 ? "0px" : "200px"}
        ref={donationsRef}
        component={ScrollArea}
        type="hover"
        sx={{
          borderRadius: 3,
          ".mantine-ScrollArea-scrollbar": {
            width: 8,
          },
        }}
      >
        <Table
          verticalSpacing="xs"
          highlightOnHover
          striped
          withColumnBorders
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <tbody>{rows.length !== 0 && rows}</tbody>
        </Table>
        {rows.length === 0 && (
          <Text color="dimmed" ta="center" fz={12}>
            {user && user.email === tripData?.user
              ? "Donations will be listed here"
              : "Be the first to donate!"}
          </Text>
        )}
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
