import { createTheme } from "@mantine/core";
import classes from "../styles/tourTheme.module.css";

export const tourTheme = createTheme({
  focusRing: "never",
  focusClassName: classes.focus,
  colors: {
    dark: [
      "#C1C2C5",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#131314",
      "#101113",
      "#0b0c0d",
      "#050506",
      "#020202",
      "#010101",
    ],
    blue: [
      "#4DFFFF",
      "#41FDFF",
      "#3AEBFD",
      "#33D9F8",
      "#2DC7F3",
      "#1C7BB2",
      "#186CA6",
      "#145D9A",
      "#104E8E",
      "#0D3F82",
    ],
  },
  cursorType: "pointer",
  primaryColor: "blue",
  primaryShade: { light: 5, dark: 9 },
  components: {
    Combobox: {
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    InputBase: {
      defaultProps: {
        variant: "filled",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    Input: {
      defaultProps: {
        variant: "filled",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    TextInput: {
      defaultProps: {
        variant: "filled",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    NumberInput: {
      defaultProps: {
        variant: "filled",
        suffix: ".00",
        thousandSeparator: ",",
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
        input: {
          textAlign: "right",
        },
      },
    },
    ScrollArea: {
      defaultProps: {
        scrollbarSize: 8,
        type: "hover",
      },
    },
    Switch: {
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    Button: {
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
        arrowSize: 10,
        openDelay: 1500,
        closeDelay: 0,
        events: { hover: true, focus: true, touch: false },
      },
      styles: {
        root: {
          transition: "all 200ms ease",
        },
      },
    },
    LoadingOverlay: {
      defaultProps: {
        loaderProps: {
          type: "bars",
        },
      },
    },
  },
  defaultRadius: 3,
  headings: {
    fontFamily: "Montserrat, sans-serif",
  },
  fontFamily: "Open Sans, sans-serif",
  TypographyStylesProvider: {
    fontFamily: "Homemade Apple",
  },
});
