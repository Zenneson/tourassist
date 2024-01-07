"use client";
import { useTripPlannerState } from "@libs/store";
import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  Text,
  useCombobox,
} from "@mantine/core";
import { shallowEqual } from "@mantine/hooks";
import { IconCheckbox } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "../styles/multiSelect.module.css";

const types = [
  "Adventure",
  "Business",
  "Charity",
  "Family",
  "Reseach",
  "Romantic",
  "Tourism",
  "Vacation",
];

const MAX_SELECTABLE_ITEMS = 5;
const MAX_DISPLAYED_VALUES = 3;

export default function MultiSelect(props) {
  const { selectedTypes, setSelectedTypes } = props;
  const [data, setData] = useState(types);
  const [search, setSearch] = useState("");
  const { tripTypes } = useTripPlannerState();
  useEffect(() => {
    if (shallowEqual(tripTypes, selectedTypes)) return;
    setSelectedTypes(tripTypes);
  }, [tripTypes]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const exactOptionMatch = data.some((item) => item === search);

  const handleValueSelect = (val) => {
    setSearch("");
    if (!Array.isArray(selectedTypes)) return;

    if (val === "$create") {
      setData((current) => [...current, search]);
      setSelectedTypes((current) => [...current, search]);
    } else {
      setSelectedTypes((current) =>
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val]
      );
    }
  };

  const handleValueRemove = (val) => {
    if (!Array.isArray(selectedTypes)) return;
    setSelectedTypes((current) => current.filter((v) => v !== val));
  };

  const displayedValues = selectedTypes.slice(0, MAX_DISPLAYED_VALUES);
  const additionalValuesCount = selectedTypes.length - MAX_DISPLAYED_VALUES;

  const values = displayedValues.map((item) => (
    <Pill
      size="sm"
      key={item}
      withRemoveButton
      onRemove={() => handleValueRemove(item)}
    >
      {item}
    </Pill>
  ));

  const options = data
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option
        value={item}
        key={item}
        active={selectedTypes.includes(item)}
      >
        <Group gap="sm" justify="space-between">
          <span>{item}</span>
          {selectedTypes.includes(item) ? <CheckIcon size={12} /> : null}
        </Group>
      </Combobox.Option>
    ));

  const getDynamicPlaceholder = (remainingChoices) => {
    if (remainingChoices === MAX_SELECTABLE_ITEMS) {
      return "Choose up to 5";
    } else if (remainingChoices > 1) {
      return `${remainingChoices} choices left`;
    } else if (remainingChoices === 1) {
      return "1 choice left";
    } else {
      return "Maximum choices reached";
    }
  };
  const dynamicPlaceholder = getDynamicPlaceholder(selectedTypes.length);

  useEffect(() => {
    if (selectedTypes.length >= MAX_SELECTABLE_ITEMS) {
      combobox.closeDropdown();
    }
  }, [selectedTypes.length, combobox]);

  return (
    <Combobox
      classNames={{
        option: classes.comboBoxOption,
      }}
      px={10}
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          classNames={{
            root: classes.multiRoot,
            description: classes.multiDesc,
            label: classes.labelSize,
          }}
          size="xl"
          label="What type of trip is this?"
          inputWrapperOrder={["label", "error", "input", "description"]}
          onClick={() => {
            if (selectedTypes.length < MAX_SELECTABLE_ITEMS) {
              combobox.openDropdown();
            }
          }}
        >
          <Pill.Group className={classes.singleLine}>
            {values.length > 0 ? (
              values
            ) : (
              <Text opacity={0.3} fz={12.5}>
                Add Trip Types...
              </Text>
            )}
            {additionalValuesCount > 0 && (
              <Pill size="sm">+{additionalValuesCount} more</Pill>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                disabled={selectedTypes.length >= MAX_SELECTABLE_ITEMS}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(selectedTypes[selectedTypes.length - 1]);
                  }
                  if (
                    event.key === "Enter" &&
                    search.trim() !== "" &&
                    !exactOptionMatch
                  ) {
                    event.preventDefault();
                    handleValueSelect("$create");
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}

          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">Add: {search}</Combobox.Option>
          )}

          {exactOptionMatch &&
            search.trim().length > 0 &&
            options.length === 0 && (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          <Combobox.Footer>
            <Group gap={5} justify="flex-end">
              <Text fz="xs" c="dimmed">
                {dynamicPlaceholder}
              </Text>
              <IconCheckbox stroke={1} size={18} opacity={0.3} />
            </Group>
          </Combobox.Footer>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
