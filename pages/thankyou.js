import { useEffect } from "react";
import { Center, Title } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";

export default function ThankYou() {
  const [loaded, setLoaded] = useSessionStorage({
    key: "loaded",
    defaultValue: false,
  });

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <Center mt={80}>
      <Title>Thank You</Title>
    </Center>
  );
}
