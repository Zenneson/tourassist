import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  Text,
  useCombobox,
} from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { tripTypesAtom } from "../page";
import classes from "../styles/multiSelect.module.css";

const tripTypes = [
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

export default function MultiSelect() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [data, setData] = useState(tripTypes);
  const [value, setValue] = useAtom(tripTypesAtom);

  const exactOptionMatch = data.some((item) => item === search);

  const handleValueSelect = (val) => {
    setSearch("");

    if (val === "$create") {
      setData((current) => [...current, search]);
      setValue((current) => [...current, search]);
    } else {
      setValue((current) =>
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val]
      );
    }
  };

  const handleValueRemove = (val) =>
    setValue((current) => current.filter((v) => v !== val));

  const displayedValues = value.slice(0, MAX_DISPLAYED_VALUES);
  const additionalValuesCount = value.length - MAX_DISPLAYED_VALUES;

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
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm" justify="space-between">
          <span>{item}</span>
          {value.includes(item) ? <CheckIcon size={12} /> : null}
        </Group>
      </Combobox.Option>
    ));

  const remainingChoices = MAX_SELECTABLE_ITEMS - value.length;
  let dynamicPlaceholder;
  if (remainingChoices === MAX_SELECTABLE_ITEMS) {
    dynamicPlaceholder = "Choose up to 5";
  } else if (remainingChoices > 1) {
    dynamicPlaceholder = `${remainingChoices} choices left`;
  } else if (remainingChoices === 1) {
    dynamicPlaceholder = "1 choice left";
  } else {
    dynamicPlaceholder = "Maximum choices reached";
  }

  useEffect(() => {
    if (value.length >= MAX_SELECTABLE_ITEMS) {
      combobox.closeDropdown();
    }
  }, [value.length, combobox]);

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
            if (value.length < MAX_SELECTABLE_ITEMS) {
              combobox.openDropdown();
            }
          }}
        >
          <Pill.Group className={classes.singleLine}>
            {values}
            {additionalValuesCount > 0 && (
              <Pill size="sm">+{additionalValuesCount} more</Pill>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={value.length > 0 ? "" : "Add Trip Types..."}
                disabled={value.length >= MAX_SELECTABLE_ITEMS}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
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
