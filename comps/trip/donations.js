import { useState, useRef, useEffect } from "react";
import {
  useMantineTheme,
  Avatar,
  Box,
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
  const { menu, dHeight, donationSectionLimit, donations } = props;
  const theme = useMantineTheme();
  const dark = theme.colorScheme === "dark";
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
      (donationsData.length !== tripData.donations?.length ||
        donationsData.length !== donations?.length) &&
      menu
    ) {
      setDonationsData(donations);
    }
    if (
      (donationsData.length === 0 && tripData.donations?.length !== 0) ||
      (donationsData.length !== donations?.length && !dataLoaded)
    ) {
      setDonationsData(donations);
      setDataLoaded(true);
    }
  }, [
    menu,
    donations,
    tripData,
    donationsData,
    setDonationsData,
    dataLoaded,
    setDataLoaded,
  ]);

  const donateOrder =
    donationsData?.length !== 0
      ? sorted === "amount"
        ? donationsData.sort((a, b) => b.amount - a.amount)
        : donationsData?.sort((a, b) => new Date(b.time) - new Date(a.time))
      : [];

  const rows = donateOrder?.map((item, index) => (
    <tr key={index}>
      <td>
        <Group>
          <Avatar
            variant={"filled"}
            radius="xl"
            color={dark ? "dark.5" : "gray.1"}
            sx={{
              boxShadow: dark
                ? "0 2px 4px rgba(0,0,0,0.3)"
                : "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Text color={dark ? "dark.1" : "gray.5"}>
              {item.name.charAt(0)}
            </Text>
          </Avatar>
          <Text size="sm" weight={500}>
            {item.name}
          </Text>
        </Group>
      </td>
      <td>
        <Text size="xs" fw={700} color="dimmed" ta="center">
          ${Math.floor(item.amount)}
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
              {donationsData?.length} Donation
              {donationsData?.length !== 1 && "s"}
            </Title>
          }
        />
        {donationsData?.length !== 0 && (
          <SegmentedControl
            value={sorted}
            bg={!dark && "gray.3"}
            onChange={setSorted}
            data={[
              { label: "Most Recent", value: "time" },
              { label: "Amount", value: "amount" },
            ]}
            size="xs"
            top={-4}
            right={-16}
            w={menu ? "50%" : "77%"}
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
        h={donationsData?.length > donationSectionLimit ? dHeight : "auto"}
        mih={donationsData?.length === 0 ? "0px" : "200px"}
        ref={donationsRef}
        component={ScrollArea}
        type="hover"
        sx={{
          borderRadius: 3,
          ".mantine-ScrollArea-scrollbar": {
            opacity: 0.3,
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
          <tbody>{rows?.length !== 0 && rows}</tbody>
        </Table>
        {rows?.length === 0 && (
          <Text color="dimmed" ta="center" fz={12}>
            {user && user.email === tripData?.user
              ? "Donations will be listed here"
              : "Be the first to donate!"}
          </Text>
        )}
        <Box ref={ref} />
        <Center>
          {/* <Button
            variant="default"
            compact
            pr={10}
            my={10}
            leftIcon={<IconReload size={14} />}
          >
            Load More
          </Button> */}
        </Center>
      </Box>
    </Box>
  );
}
