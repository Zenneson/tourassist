import { useState } from "react";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { NumberInput } from "@mantine/core";
import { useFormContext } from "../../pages/tripPlanner";
import classes from "./sumInput.module.css";

export default function SumInput(props) {
  const { disallowEmptyField } = props;
  const handleChange = (e) => {
    setTotalCost(e);
  };

  const form = useFormContext();
  const costSum = form.getTransformedValues();

  return (
    <NumberInput
      id="costSum"
      classNames={{ input: classes.totalCostInput }}
      clampBehavior="strict"
      isAllowed={disallowEmptyField}
      min={0}
      leftSection={<IconCurrencyDollar />}
      size="xl"
      w={225}
      value={costSum || 0}
      onChange={(e) => {
        handleChange(e);
      }}
    />
  );
}
