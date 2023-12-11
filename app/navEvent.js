"use client";
import { useSessionStorage } from "@mantine/hooks";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [history, setHistory] = useSessionStorage({
    key: "history",
    defaultValue: ["empty"],
  });

  const [pageAdded, setPageAdded] = useState(false);
  useEffect(() => {
    if (pageAdded) return;
    const url = `${pathname}${searchParams}`;

    if (history.length > 0 && history[0] === "empty") {
      history.shift();
    }
    const newHistory = [...history, url];

    setHistory(newHistory);
    setPageAdded(true);
  }, [pathname, searchParams, history]);

  return null;
}
