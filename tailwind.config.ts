import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        black: {
          100: "#6B6B6B",
          200: "#525252",
          300: "#373737",
          400: "#1F1F1F",
          500: "#040404",
        },
        gray: {
          50: "#FFFFFF",
          100: "#DEDEDE",
          200: "#C4C4C4",
          300: "#ABABAB",
          400: "#999999",
          500: "#808080",
        },
        primary: {
          blue: {
            50: "#F5FAFF",
            100: "#E9F4FF",
            200: "#4DA9FF",
            300: "#1B92FF",
            400: "#242945",
          },
        },
        secondary: {
          yellow: {
            100: "#FFC149",
          },
          red: {
            100: "#FFEEF0",
            200: "#FF4F64",
          },
        },
        background: {
          100: "#FAFAFA",
          200: "#F7F7F7",
          300: "#EFEFEF",
          400: "#F4F7FB",
        },
        line: {
          100: "#F2F2F2",
          200: "#E6E6E6",
        },
      },
    },
  },
};

export default config;
