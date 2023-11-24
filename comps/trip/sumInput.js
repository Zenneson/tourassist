import { useEffect } from "react";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { useSessionStorage } from "@mantine/hooks";
import { NumberInput } from "@mantine/core";
import classes from "./sumInput.module.css";

export default function SumInput() {
  const [totalCost, setTotalCost] = useSessionStorage({
    key: "totalCost",
    defaultValue: 0,
  });

  const handleChange = (e) => {
    setTotalCost(e);
  };

  useEffect(() => {
    console.log("COST TOTAL:   ", totalCost);
  });

  return (
    <NumberInput
      classNames={{ input: classes.totalCostInput }}
      id="totalId"
      min={0}
      leftSection={<IconCurrencyDollar />}
      size="xl"
      w={225}
      value={totalCost}
      onChange={(e) => {
        handleChange(e);
      }}
    />
  );
}
