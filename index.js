import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    scbBlue: {
      500: "#0473ea", // SCB Blue
    },
    scbGreen: {
      500: "#38d200", // SCB Green
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "scbBlue", // all buttons default to SCB Blue
      },
    },
  },
});

export default theme;
