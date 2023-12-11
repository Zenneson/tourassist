"use client";
import { Button, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/map");
  }, [router]);

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
