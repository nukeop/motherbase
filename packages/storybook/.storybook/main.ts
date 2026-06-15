import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
    disableWhatsNewNotifications: true,
  },

  features: {
    sidebarOnboardingChecklist: false,
    changeDetection: false,
  },
  viteFinal: async (config) => {
    const { mergeConfig, searchForWorkspaceRoot } = await import("vite");
    return mergeConfig(config, {
      plugins: [(await import("@tailwindcss/vite")).default()],
      server: {
        fs: {
          allow: [searchForWorkspaceRoot(process.cwd())],
        },
        watch: {
          ignored: ["!**/node_modules/@motherbase/**"],
        },
      },
    });
  },
};

export default config;
