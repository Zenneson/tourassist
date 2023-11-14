"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  useComputedColorScheme,
  Avatar,
  Box,
  Button,
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
import { useIntersection } from "@mantine/hooks";
import { useUser } from "../../libs/context";
import { timeSince } from "../../libs/custom";
import { IconReload } from "@tabler/icons-react";

export default function Donations(props) {
  const { dHeight, donationSectionLimit, donations = [] } = props;
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

  const [isClient, setIsClient] = useState(false);
  const [tripData, setTripData] = useState([]);

  const [displayCount, setDisplayCount] = useState(20);
  const [donationsData, setDonationsData] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (
      (donations && donationsData?.length === 0) ||
      donationsData?.length !== donations?.length
    ) {
      setDonationsData(donations);
    }
  }, [donations, tripData, donationsData, setDonationsData]);

  const donateOrder = useMemo(() => {
    if (!donationsData) return;
    let sortedDonations = [];
    let newData = JSON.parse(JSON.stringify(donationsData));
    if (sorted === "time") {
      sortedDonations = newData.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
    } else {
      sortedDonations = newData.sort((a, b) => b.amount - a.amount);
    }
    const slicedDonations = sortedDonations.slice(0, displayCount);
    return slicedDonations;
  }, [donationsData, sorted, displayCount]);

  const loadMoreDonations = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const rows = donateOrder?.map((item, index) => {
    if (!item.time || !item.amount) return null;
    if (item.name === "") item.name = "Anonymous";

    return (
      <Table.Tr key={index}>
        <Table.Td pos={"relative"}>
          <Avatar
            pos={"absolute"}
            top={2}
            left={2}
            opacity={0.5}
            variant={"transparent"}
            radius="xl"
            size={"xs"}
            color={dark ? "dark.5" : "gray.1"}
          >
            <Text c={dark ? "dark.1" : "gray.5"} fz={8}>
              {index + 1}
            </Text>
          </Avatar>
          <Group py={5} gap={0}>
            <Avatar
              variant={"outlined"}
              radius="xl"
              mx={10}
              color={dark ? "dark.5" : "gray.1"}
              style={{
                boxShadow: dark
                  ? "0 2px 4px rgba(0,0,0,0.3)"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Text c={dark ? "dark.1" : "gray.5"}>{item.name.charAt(0)}</Text>
            </Avatar>
            <Stack gap={0}>
              <Text size="sm" fw={400}>
                {item.name}
              </Text>
              <Text fz={10} opacity={0.5}>
                {timeSince(item.time)}
              </Text>
            </Stack>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="md" fw={700} c="dimmed" ta="right" px={10}>
            ${Math.floor(item.amount)}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    isClient && (
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
          left={10}
          w={"calc(100% - 20px)"}
          h={"100%"}
          style={{
            pointerEvents: "none",
            zIndex: 100,
            borderRadius: 3,
            boxShadow: `${
              entry?.isIntersecting
                ? "none"
                : dark
                ? "rgba(0, 0, 0, 0.4) 0px -15px 7px -5px inset"
                : "rgba(0, 0, 0, 0.25) 0px -10px 7px -5px inset"
            }`,
          }}
        />
        <Box
          pb={10}
          m={0}
          mt={10}
          mb={10}
          mx={10}
          h={donationsData?.length > donationSectionLimit ? dHeight : "auto"}
          mih={donationsData?.length === 0 ? "0px" : "200px"}
          ref={donationsRef}
          component={ScrollArea}
          type="hover"
          style={{
            border: dark
              ? "1px solid rgba(25,25,25,0.3)"
              : "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          <Table
            striped
            stripedColor={
              dark ? "rgba(255, 255, 255, 0.01)" : "rgba(200, 200, 200, 0.15)"
            }
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
            <Text pt={10} c="dimmed" ta="center" fz={12}>
              {user && user.email === tripData?.user
                ? "Donations will be listed here"
                : "Be the first to donate!"}
            </Text>
          )}
          <Box ref={ref} />
          <Center>
            {displayCount < donationsData?.length && (
              <Button
                onClick={loadMoreDonations}
                variant="default"
                size="compact-xs"
                pr={10}
                mt={10}
                mb={20}
                leftSection={<IconReload size={14} />}
              >
                Load More
              </Button>
            )}
          </Center>
        </Box>
      </Box>
    )
  );
}
