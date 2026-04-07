import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import type { User } from "@/types/sidebarType";

const meta: Meta<typeof NavUser> = {
  title: "App/Sidebar/NavUser",
  component: NavUser,
  decorators: [
    (Story) => (
      <Sidebar>
        <SidebarContent>
          <Story />
        </SidebarContent>
      </Sidebar>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NavUser>;

const user: User = {
  name: "김농부",
  email: "farmer@example.com",
};

export const Default: Story = {
  args: { user },
};

export const WithAvatar: Story = {
  args: {
    user: {
      ...user,
      avatar: "https://github.com/shadcn.png",
    },
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: {
      name: "이름없음",
      email: "noavatar@example.com",
    },
  },
};
