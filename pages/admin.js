import { useEffect } from "react";
import { Box } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";

export default function AdminPage() {
  const [loaded, setLoaded] = useSessionStorage({
    key: "loaded",
    defaultValue: false,
  });

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return <Box></Box>;
}
