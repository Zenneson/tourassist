import { useState } from "react";
import {
  PillsInput,
  Pill,
  Combobox,
  CheckIcon,
  Group,
  useCombobox,
} from "@mantine/core";
import classes from "./multiSelect.module.css";

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

const MAX_SELECTABLE_ITEMS = 10;
const MAX_DISPLAYED_VALUES = 3;

export function MultiSelect() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [data, setData] = useState(tripTypes);
  const [value, setValue] = useState([]);

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

  return (
    <Combobox
      classNames={{
        option: classes.comboBoxOption,
      }}
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
          description="Choose up to 10 types"
          inputWrapperOrder={["label", "error", "input", "description"]}
          onClick={() => combobox.openDropdown()}
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
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
                disabled={value.length >= MAX_SELECTABLE_ITEMS} // Disable input if 10 items are selected
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
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
