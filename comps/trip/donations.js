"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  useComputedColorScheme,
  Avatar,
  Box,
  Center,
  Divider,
  Group,
  Stack,
  SegmentedControl,
  Text,
  Table,
  Title,
  ScrollArea,
  Grid,
} from "@mantine/core";
import { useIntersection, useSessionStorage } from "@mantine/hooks";
import { useUser } from "../../libs/context";
import { IconReload } from "@tabler/icons-react";

export default function Donations(props) {
  const { dHeight, donationSectionLimit, donations } = props;
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const dark = computedColorScheme === "dark";
  const [sorted, setSorted] = useState("time");
  const donationsRef = useRef();
  const { ref, entry } = useIntersection({
    root: donationsRef.current,
    threshold: 1,
  });

  const { user } = useUser();

  const [tripData, setTripData] = useSessionStorage({
    key: "tripData",
    defaultValue: [],
  });

  const [donationsData, setDonationsData] = useState(donations || []);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (tripData?.donations?.length !== donationsData?.length)
      setDataLoaded(false);
    if (
      donationsData?.length !== tripData.donations?.length ||
      donationsData?.length !== donations?.length
    ) {
      setDonationsData(donations);
    }
    if (
      (donationsData?.length === 0 && tripData.donations?.length !== 0) ||
      (donationsData?.length !== donations?.length && !dataLoaded)
    ) {
      setDonationsData(donations);
      setDataLoaded(true);
    }
  }, [
    donations,
    tripData,
    donationsData,
    setDonationsData,
    dataLoaded,
    setDataLoaded,
  ]);

  const donateOrder =
    (donationsData ?? []).length !== 0
      ? sorted === "amount"
        ? [...donationsData].sort((a, b) => b.amount - a.amount)
        : [...donationsData].sort((a, b) => new Date(b.time) - new Date(a.time))
      : [];

  const rows = donateOrder?.map((item, index) => {
    if (!item.name || !item.amount) return null;
    return (
      <Table.Tr key={index}>
        <Table.Td>
          <Group>
            <Avatar
              variant={"filled"}
              radius="xl"
              color={dark ? "dark.5" : "gray.1"}
              style={{
                boxShadow: dark
                  ? "0 2px 4px rgba(0,0,0,0.3)"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Text c={dark ? "dark.1" : "gray.5"}>{item.name.charAt(0)}</Text>
            </Avatar>
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="xs" fw={700} c="dimmed" ta="center">
            ${Math.floor(item.amount)}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box w="100%" pos={"relative"}>
      <Grid pt={20} px={15} align="flex-start">
        <Grid.Col span="auto">
          <Stack gap={0}>
            <Divider
              size={2}
              mb={5}
              opacity={dark ? 0.3 : 0.1}
              color={dark ? "gray.8" : "dark.3"}
            />
            <Title order={6} c={"gray.5"}>
              {donationsData?.length}{" "}
              <Text span opacity={0.4} tt={"uppercase"} fz={12} fw={700}>
                Donation
                {donationsData?.length !== 1 && "s"}
              </Text>
            </Title>
          </Stack>
        </Grid.Col>
        {donationsData?.length !== 0 && (
          <Grid.Col span="content">
            <SegmentedControl
              bg={dark ? "dark.6" : "gray.0"}
              color={dark ? "dark.4" : "gray.3"}
              value={sorted}
              onChange={setSorted}
              data={[
                { label: "Recent", value: "time" },
                { label: "Amount", value: "amount" },
              ]}
              size="xs"
              top={-4}
              w={150}
              styles={{
                root: {
                  border: "none",
                  outline: "none",
                  boxShadow: dark
                    ? "0 2px 4px rgba(0,0,0,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.05)",
                },
                indicator: {
                  backgroundColor: dark ? "dark.8" : "gray.0",
                  boxShadow: dark
                    ? "0 2px 4px rgba(0,0,0,0.2)"
                    : "0 2px 4px rgba(0,0,0,0.15)",
                },
                label: {
                  color: dark ? "dark.4" : "#999",
                },
              }}
            />
          </Grid.Col>
        )}
      </Grid>
      <Box
        pos={"absolute"}
        top={0}
        left={0}
        w={"100%"}
        h={"100%"}
        style={{
          pointerEvents: "none",
          zIndex: 100,
          borderRadius: 3,
          boxShadow: `${
            entry?.isIntersecting
              ? "none"
              : dark
              ? "rgba(0, 0, 0, 0.7) 0px -15px 7px -5px inset"
              : "rgba(0, 0, 0, 0.25) 0px -10px 7px -5px inset"
          }`,
        }}
      />
      <Box
        p={10}
        pb={20}
        m={0}
        h={donationsData?.length > donationSectionLimit ? dHeight : "auto"}
        mih={donationsData?.length === 0 ? "0px" : "200px"}
        ref={donationsRef}
        component={ScrollArea}
        type="hover"
        style={{
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        <Table
          striped
          stripedColor={
            dark ? "rgba(255, 255, 255, 0.01)" : "rgba(200, 200, 200, 0.15)"
          }
          highlightOnHover
          withRowBorders={false}
          styles={{
            table: {
              overflow: "hidden",
              borderRadius: 3,
            },
            tr: {
              borderRadius: 25,
            },
          }}
        >
          <Table.Tbody>{rows?.length !== 0 && rows}</Table.Tbody>
        </Table>
        {rows?.length === 0 && (
          <Text c="dimmed" ta="center" fz={12}>
            {user && user.email === tripData?.user
              ? "Donations will be listed here"
              : "Be the first to donate!"}
          </Text>
        )}
        <Box ref={ref} />
        <Center>
          {/* <Button
            variant="default"
            size="compact-xs"
            pr={10}
            my={10}
            leftSection={<IconReload size={14} />}
          >
            Load More
          </Button> */}
        </Center>
      </Box>
    </Box>
  );
}
