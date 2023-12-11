"use client";
import { Button, Center } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  return (
    <Center w={"100%"} h={"100vh"}>
      <Button
        onClick={() => {
          router.push("/map");
        }}
      >
        MAP
      </Button>
    </Center>
  );
}
