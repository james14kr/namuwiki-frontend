import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { SidebarData } from "@/types/sidebarType";

interface AppSideBarProps {
  data: SidebarData;
  contentTitle?: string;
}

export default function AppSidebar({
  data,
  contentTitle,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSideBarProps) {
  if (data === null) return;
  return (
    <Sidebar collapsible="icon" {...props}>
      {data.teams && (
        <SidebarHeader className="border-b h-12">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={data.navMain} contentTitle={contentTitle} />
        {data.projects && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
