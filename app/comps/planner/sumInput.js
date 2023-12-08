import { useState, useEffect } from "react";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { NumberInput } from "@mantine/core";
import { useFormContext } from "../../../pagesx/tripPlanner";
import classes from "./styles/sumInput.module.css";

export default function SumInput(props) {
  const { disallowEmptyField } = props;
  const form = useFormContext();
  const costSum = form.getTransformedValues();
  const [totalCost, setTotalCost] = useState(costSum);

  useEffect(() => {
    const num = parseInt(costSum);
    setTotalCost(num);
  }, [costSum]);

  return (
    <NumberInput
      id="costsSum"
      classNames={{ input: classes.totalCostInput }}
      clampBehavior="strict"
      isAllowed={disallowEmptyField}
      min={0}
      leftSection={<IconCurrencyDollar />}
      size="xl"
      w={225}
      value={form.values.totalCost || costSum || 0}
      onChange={(e) => {
        const num = parseInt(e);
        form.setFieldValue("totalCost", num);
      }}
    />
  );
}
