import type { Meta, StoryObj } from "@storybook/react-vite";
import { TeamSwitcher } from "./team-switcher";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import PlantCommunityLogo from "@/components/layouts/Logo";
import type { Team } from "@/types/sidebarType";

const teams: Team[] = [
  {
    name: "플랜트 커뮤니티",
    logo: PlantCommunityLogo,
    plan: "Pro",
  },
  {
    name: "나주 딸기 팀",
    plan: "Free",
  },
  {
    name: "청주 토마토 팀",
    plan: "Enterprise",
  },
];

const meta: Meta<typeof TeamSwitcher> = {
  title: "App/Sidebar/TeamSwitcher",
  component: TeamSwitcher,
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
type Story = StoryObj<typeof TeamSwitcher>;

export const Static: Story = {
  args: {
    teams,
    useDropdown: false,
  },
};

export const Dropdown: Story = {
  args: {
    teams,
    useDropdown: true,
  },
};
