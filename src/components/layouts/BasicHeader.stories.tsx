import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutDashboard, Sprout, Settings } from "lucide-react";
import BasicHeader from "./BasicHeader";
import type { NavMainItem } from "@/types/sidebarType";

const navMain: NavMainItem[] = [
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

const meta: Meta<typeof BasicHeader> = {
  title: "App/Layouts/BasicHeader",
  component: BasicHeader,
  args: {
    navMain,
  },
};

export default meta;
type Story = StoryObj<typeof BasicHeader>;

export const Default: Story = {};
