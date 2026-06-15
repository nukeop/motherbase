import "@motherbase/ui/styles.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0a0a0a" },
        { name: "light", value: "#fafafa" },
      ],
    },
  },
};

export default preview;
