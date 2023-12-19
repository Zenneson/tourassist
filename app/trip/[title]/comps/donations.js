"use client";
import { tripDataAtom } from "@libs/atoms";
import { timeSince } from "@libs/custom";
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  ScrollArea,
  SegmentedControl,
  Stack,
  Table,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconReload, IconShare3 } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import classes from "../styles/donations.module.css";

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

  const tripData = useAtomValue(tripDataAtom);
  const [displayCount, setDisplayCount] = useState(20);
  const [donationsData, setDonationsData] = useState([]);

  useEffect(() => {
    if (!donationsData || donationsData.length !== donations.length) {
      setDonationsData(donations);
    }
  }, [donations]);

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
            className={classes.avi}
            pos={"absolute"}
            top={2}
            left={2}
            opacity={0.5}
            variant={"transparent"}
            radius="xl"
            size={"xs"}
          >
            <Text c={dark ? "dark.1" : "gray.5"} fz={8}>
              {index + 1}
            </Text>
          </Avatar>
          <Group py={5} gap={0}>
            <Avatar variant={"outlined"} radius="xl" mx={10}>
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
    <Box w="100%" pos={"relative"}>
      <Grid pt={20} px={15} align="flex-start">
        <Grid.Col span="auto">
          <Stack gap={0}>
            <Divider size={2} mb={5} />
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
        className={classes.donationsShadow}
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
            entry?.isIntersecting ? "none" : "inset 0px -15px 7px -5px"
          }`,
        }}
      />
      <Box
        classNames={{ root: classes.tableFrame }}
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
      >
        <Table
          className={classes.table}
          striped
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
          <Anchor href="#" fz={"10px"} className={classes.emptyListShare}>
            <Flex align="center" justify="center" mt={10} gap="3">
              <IconShare3 size={15} stroke={1} /> Spread the word!
            </Flex>
          </Anchor>
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
  );
}
