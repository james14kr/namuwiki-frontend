import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderKanban, Leaf } from "lucide-react";
import { NavProjects } from "./nav-projects";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import type { Project } from "@/types/sidebarType";

const projects: Project[] = [
  { name: "나주 딸기 프로젝트", url: "/projects/1", icon: FolderKanban },
  { name: "청주 토마토 프로젝트", url: "/projects/2", icon: Leaf },
  { name: "전주 상추 프로젝트", url: "/projects/3", icon: FolderKanban },
];

const meta: Meta<typeof NavProjects> = {
  title: "App/Sidebar/NavProjects",
  component: NavProjects,
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
type Story = StoryObj<typeof NavProjects>;

export const Default: Story = {
  args: {
    projects,
  },
};
