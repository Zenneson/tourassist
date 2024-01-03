"use client";
import { Button, Center } from "@mantine/core";
import Link from "next/link";

export default function AdminPage() {
  return (
    <Center w={"100%"} h={"100vh"}>
      <Button component={Link} href="/map">
        MAP
      </Button>
    </Center>
  );
}
