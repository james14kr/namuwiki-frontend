import type { Preview } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../src/components/theme-provider";
import { SidebarProvider } from "../src/components/ui/sidebar";
import "../src/index.css";
import "../src/i18n";
import { setupGridGlobalOption } from "../src/utils/gridUtil";

setupGridGlobalOption();

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
          <SidebarProvider>
            <Story />
          </SidebarProvider>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default preview;
