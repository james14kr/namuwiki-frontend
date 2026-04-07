import type { Meta, StoryObj } from "@storybook/react-vite";
import Spinner from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "App/Feedback/Spinner",
  component: Spinner,
  decorators: [
    (Story) => (
      <div style={{ height: "100%", width: "100%" }} className="flex flex-col">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 64,
  },
};

export const CustomLabel: Story = {
  args: {
    label: "데이터 로딩 중...",
    size: 40,
  },
};

export const Fullscreen: Story = {
  args: {
    fullscreen: true,
    label: "페이지를 불러오는 중입니다...",
  },
  parameters: {
    layout: "fullscreen",
  },
};
