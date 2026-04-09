import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppBreadcrumb, { type BreadcrumbInfo } from "../breadcrumb/AppBreadcrumb";
import UserInfo from "./UserInfo";
import type { NavMainItem } from "@/types/sidebarType";
import FarmBanner from "./FarmBanner";
import UserBanner from "./UserBanner";

interface Props {
  navMain: NavMainItem[];
}

function buildBreadcrumbs(navMain: NavMainItem[], pathname: string): BreadcrumbInfo[] {
  for (const item of navMain) {
    if (item.url === pathname && item.url !== "#") {
      return [{ title: item.title, to: item.url }];
    }
    if (item.items) {
      const sub = item.items.find((s) => s.url === pathname && s.url !== "#");
      if (sub) {
        return [
          { title: item.title, to: item.url },
          { title: sub.title, to: sub.url },
        ];
      }
    }
  }
  return [];
}

function resolveAppName(navMain: NavMainItem[], pathname: string): string {
  for (const item of navMain) {
    if (item.url === pathname && item.url !== "#") return item.title;
    if (item.items?.some((sub) => sub.url === pathname)) return item.title;
  }
  return "시스템";
}

const BasicHeader = ({ navMain }: Props) => {
  const { pathname } = useLocation();
  const breadcrumbs = buildBreadcrumbs(navMain, pathname);
  const appName = resolveAppName(navMain, pathname);

  const role = localStorage.getItem("role");

  return (
    <SidebarInset className="sticky top-0 z-10">
      <div className="relative">
        <div
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner.gif')" }}
        />
        {/* 이미지 위에 배너 띄우기 */}
        <div className="absolute bottom-0 left-0 right-0">
          {role === "FARMER" ? (
            <FarmBanner/>
          ) : (
            <UserBanner/>
          )}
        </div>
      </div>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 bg-sidebar">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex w-full items-center justify-between">
          <AppBreadcrumb appName={appName} data={breadcrumbs} />
          <UserInfo />
        </div>
      </header>
    </SidebarInset>
  );
};

export default BasicHeader;
