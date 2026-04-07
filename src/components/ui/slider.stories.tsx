import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  args: {
    className: "w-64",
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    max: 100,
    step: 1,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [40],
    max: 100,
    disabled: true,
  },
};
