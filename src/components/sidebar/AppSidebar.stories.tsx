import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutDashboard, Sprout, Settings, FolderKanban } from "lucide-react";
import AppSidebar from "./AppSidebar";
import PlantCommunityLogo from "@/components/layouts/Logo";
import type { SidebarData } from "@/types/sidebarType";

const sidebarData: SidebarData = {
  user: {
    name: "김농부",
    email: "farmer@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "플랜트 커뮤니티",
      logo: PlantCommunityLogo,
    },
  ],
  navMain: [
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
        { title: "상추", url: "/crops/lettuce" },
      ],
    },
    {
      title: "설정",
      url: "/settings",
      icon: Settings,
    },
  ],
  projects: [
    { name: "나주 딸기 프로젝트", url: "/projects/1", icon: FolderKanban },
    { name: "청주 토마토 프로젝트", url: "/projects/2", icon: FolderKanban },
  ],
};

const meta: Meta<typeof AppSidebar> = {
  title: "App/Sidebar/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

export const Default: Story = {
  args: {
    data: sidebarData,
  },
};

export const WithContentTitle: Story = {
  args: {
    data: sidebarData,
    contentTitle: "메뉴",
  },
};
