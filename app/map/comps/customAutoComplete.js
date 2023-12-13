"use client";
import { areaAtom } from "@libs/atoms";
import { addEllipsis } from "@libs/custom";
import { Box, Combobox, InputBase, Text, useCombobox } from "@mantine/core";
import { IconWorldSearch } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import classes from "../styles/mymap.module.css";

const AutoCompItem = React.forwardRef(function AutoCompItem(props, ref) {
  const {
    label,
    region,
    country,
    group,
    center,
    border,
    mapRef,
    locationHandler,
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
    <Box ref={ref} {...rest} data={data}>
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
  version,
  mapRef,
  countrySearchData,
  placeSearchData,
  countrySearch,
  setCountrySearch,
  placeSearch,
  setPlaceSearch,
  handleChange,
  locationHandler,
}) {
  const area = useAtomValue(areaAtom);

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

  const [autoDropOpen, setAutoDropOpen] = useState(false);
  const searchRef = useRef();
  const combobox = useCombobox({
    searchRef: searchRef,
    defaultOpened: false,
    opened: autoDropOpen,
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === "keyboard") {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex("active");
      }
    },
  });

  const inputLogic = () => {
    combobox.selectFirstOption();
    const isInputFocused = searchRef.current === document.activeElement;
    if (
      countrySearch &&
      countrySearch.length === 0 &&
      placeSearch &&
      placeSearch.length === 0
    ) {
      setAutoDropOpen(false);
    } else if (isInputFocused) {
      if (
        (countrySearch && countrySearch.length > 2) ||
        (placeSearch && placeSearch.length > 2 && options.length > 0)
      ) {
        setAutoDropOpen(true);
      }
    }
  };

  useEffect(() => {
    inputLogic();
    if (autoDropOpen) {
      combobox.openDropdown();
    } else {
      combobox.closeDropdown();
    }
  }, [autoDropOpen, combobox]);

  const data = version === "country" ? countrySearchData : placeSearchData;
  let options;
  if (Array.isArray(data)) {
    options = data.map((item) => (
      <Combobox.Option value={item.label} key={item.id}>
        <AutoCompItem
          mapRef={mapRef}
          locationHandler={locationHandler}
          {...item}
        />
      </Combobox.Option>
    ));
  }

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
      resetSelectionOnOptionHover={true}
      store={combobox}
      offset={3}
      onOptionSubmit={(value, optionProps) => {
        handleChange(version);
        if (version === "country") {
          setCountrySearch(value);
        } else {
          setPlaceSearch(value);
        }
        locationHandler(optionProps.children.props, mapRef);
      }}
    >
      <Combobox.Target>
        <InputBase
          ref={searchRef}
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
          onBlur={() => setAutoDropOpen(false)}
          onChange={(e) => {
            const search = e.target.value;
            handleChange(version);
            if (version === "country") {
              setCountrySearch(search);
            } else {
              setPlaceSearch(search);
            }
            combobox.updateSelectedOptionIndex();
          }}
          placeholder={
            version === "country"
              ? "Where would you like to go?"
              : addEllipsis(
                  `Search in${prefaceThe.includes(area.label) ? " The" : ""} ${
                    area.label
                  }?`,
                  40
                )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
