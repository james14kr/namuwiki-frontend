import type { Meta, StoryObj } from "@storybook/react-vite";
import BasicLayout from "./BasicLayout";

const meta: Meta<typeof BasicLayout> = {
  title: "App/Layouts/BasicLayout",
  component: BasicLayout,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BasicLayout>;

export const Default: Story = {};
