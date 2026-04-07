import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutDashboard, Sprout, Settings, Users } from "lucide-react";
import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import type { NavMainItem } from "@/types/sidebarType";

const items: NavMainItem[] = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "작물 관리",
    url: "#",
    icon: Sprout,
    items: [
      { title: "토마토", url: "/crops/tomato" },
      { title: "딸기", url: "/crops/strawberry" },
    ],
  },
  {
    title: "설정",
    url: "/settings",
    icon: Settings,
  },
];

const meta: Meta<typeof NavMain> = {
  title: "App/Sidebar/NavMain",
  component: NavMain,
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
type Story = StoryObj<typeof NavMain>;

export const Default: Story = {
  args: {
    items: items.filter((i) => !i.items),
  },
};

export const WithSubItems: Story = {
  args: {
    items,
  },
};

export const WithContentTitle: Story = {
  args: {
    items: [
      ...items,
      { title: "사용자 관리", url: "/users", icon: Users },
    ],
    contentTitle: "메인 메뉴",
  },
};
