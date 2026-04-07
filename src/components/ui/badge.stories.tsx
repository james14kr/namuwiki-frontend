import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  args: {
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { variant: "default", children: "기본" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "보조" },
};

export const Success: Story = {
  args: { variant: "success", children: "성공" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "위험" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "아웃라인" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">기본</Badge>
      <Badge variant="secondary">보조</Badge>
      <Badge variant="success">성공</Badge>
      <Badge variant="danger">위험</Badge>
      <Badge variant="outline">아웃라인</Badge>
    </div>
  ),
};
