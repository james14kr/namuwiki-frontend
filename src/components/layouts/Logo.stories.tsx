import type { Meta, StoryObj } from "@storybook/react-vite";
import PlantCommunityLogo from "./Logo";

const meta: Meta<typeof PlantCommunityLogo> = {
  title: "App/Layouts/Logo",
  component: PlantCommunityLogo,
};

export default meta;
type Story = StoryObj<typeof PlantCommunityLogo>;

export const Default: Story = {
  args: {
    width: 200,
    height: 200,
  },
};

export const Small: Story = {
  args: {
    width: 100,
    height: 100,
  },
};

export const Large: Story = {
  args: {
    width: 400,
    height: 400,
  },
};
