import React, { useEffect, useRef } from "react";
import { useCombobox, InputBase, Combobox, Box, Text } from "@mantine/core";
import { IconWorldSearch } from "@tabler/icons-react";
import { addEllipsis } from "../../libs/custom";
import { locationHandler, handleChange } from "./mapHooks";
import classes from "./customAutoComplete.module.css";

const AutoCompItem = React.forwardRef(function AutoCompItem(props, ref) {
  const {
    label,
    region,
    country,
    group,
    center,
    border,
    setArea,
    mapRef,
    ...rest
  } = props;
  const data = {
    label,
    region,
    country,
    group,
    center,
    border,
  };

  return (
    <Box ref={ref} {...rest}>
      <Box p={5} onClick={() => locationHandler(data, mapRef)}>
        <Text order={6} lineClamp={1} truncate="end">
          {label}
        </Text>
        <Text fz={12} lineClamp={1} truncate="end">
          {group === "City" ? `${region}, ${country}` : country}
        </Text>
      </Box>
    </Box>
  );
});

export default function CustomAutoComplete({
  mapRef,
  version,
  countrySearchData,
  placeSearchData,
  countrySearch,
  setCountrySearch,
  placeSearch,
  setPlaceSearch,
}) {
  const prefaceThe = [
    "Bahamas",
    "Cayman Islands",
    "Falkland Islands",
    "Netherlands",
    "Philippines",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "US Virgin Islands",
    "Maldives",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Dominican Republic",
    "Central African Republic",
  ];

  const autoRef = useRef();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    },
  });

  const data = version === "country" ? countrySearchData : placeSearchData;
  let options;
  if (Array.isArray(data)) {
    options = data.map((item) => (
      <Combobox.Option value={item.label} key={item.id}>
        <AutoCompItem mapRef={mapRef} {...item} />
      </Combobox.Option>
    ));
  }

  useEffect(() => {
    combobox.selectFirstOption();
    const isInputFocused = autoRef.current === document.activeElement;
    if (!isInputFocused) combobox.closeDropdown();
    if (
      countrySearch &&
      countrySearch.length === 0 &&
      placeSearch &&
      placeSearch.length === 0
    ) {
      combobox.closeDropdown();
    } else if (isInputFocused) {
      if (
        (countrySearch && countrySearch.length > 2) ||
        (placeSearch && placeSearch.length > 2 && options.length > 0)
      ) {
        combobox.openDropdown();
      }
    } else if (!options || options?.length === 0) {
      combobox.closeDropdown();
    }
  }, [options, combobox, countrySearch, placeSearch]);

  return (
    <Combobox
      classNames={{
        dropdown:
          version === "country"
            ? classes.countryAutoCompleteDropdown
            : classes.placeAutoCompleteDropdown,
        option:
          version === "country"
            ? classes.countryAutoCompleteOption
            : classes.placeAutoCompleteOption,
      }}
      transitionProps={{
        transition: "fade",
        duration: 100,
        timingFunction: "ease",
      }}
      store={combobox}
      offset={3}
      onOptionSubmit={(value, optionProps) => {
        if (version === "country") {
          handleChange("country");
          setCountrySearch(value);
        } else {
          handleChange("place");
          setPlaceSearch(value);
        }
        locationHandler(optionProps.children.props, mapRef);
      }}
    >
      <Combobox.Target>
        <InputBase
          ref={autoRef}
          classNames={{
            root:
              version === "country"
                ? classes.countryAutoComplete
                : classes.placeAutoComplete,
            input:
              version === "country"
                ? classes.countryAutoCompleteInput
                : classes.placeAutoCompleteInput,
          }}
          size={version === "country" ? "lg" : "sm"}
          w={version === "country" ? 350 : "auto"}
          radius={version === "country" ? "xl" : "3px 3px 0 0"}
          pointer
          leftSection={<IconWorldSearch size={20} />}
          leftSectionWidth={35}
          rightSectionPointerEvents="none"
          value={version === "country" ? countrySearch : placeSearch}
          onBlur={() => combobox.closeDropdown()}
          onChange={(e) => {
            const search = e.target.value;
            if (version === "country") {
              handleChange("country");
              setCountrySearch(search);
            } else {
              handleChange("place");
              setPlaceSearch(search);
            }
            combobox.updateSelectedOptionIndex();
          }}
          placeholder={
            version === "country"
              ? "Where would you like to go?"
              : addEllipsis(
                  `Search in${prefaceThe.includes(area.label) ? " The" : ""} ${
                    area.country === "United States" ? area.country : area.label
                  }?`,
                  40
                )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
