import type { Meta, StoryObj } from "@storybook/react-vite";
import UserInfo from "./UserInfo";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof UserInfo> = {
  title: "App/Layouts/UserInfo",
  component: UserInfo,
};

export default meta;
type Story = StoryObj<typeof UserInfo>;

export const Default: Story = {};

export const WithChildren: Story = {
  args: {
    children: (
      <Button size="sm" variant="outline">
        알림
      </Button>
    ),
  },
};
