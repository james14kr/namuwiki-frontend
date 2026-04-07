import BasicHeader from "./BasicHeader";
import { ThemeProvider } from "../theme-provider";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../sidebar/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

import { Home, SquareTerminal, ActivitySquareIcon } from "lucide-react";
import type { SidebarData } from "@/types/sidebarType";
import PlantCommunityLogo from "./Logo";
import { Item } from "@radix-ui/react-select";

const data: SidebarData = {
  teams: [
    {
      name: "나무위키",
      logo: PlantCommunityLogo,
    },
  ],
  user: {
    name: "김우연",
    email: "rladndus321@gmail.com",
  },
  navMain: [
    {
      title: "홈",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "게시판",
      url: "#",
      icon: ActivitySquareIcon,
      isActive: true,
      items: [
        // {
        //   title: "메인 피드",
        //   url: "/namu/main-feed",
        // },
        // {
        //   title: "농장 대시보드",
        //   url: "/namu/dashboard",
        // },
        // {
        //   title: "작물별 AI 제어",
        //   url: "/namu/ai-control",
        // },
        // {
        //   title: "커뮤니티",
        //   url: "/namu/community",
        // },
        // {
        //   title: "마이페이지",
        //   url: "/namu/my-farm",
        // },
        // {
        //   title: "테스트",
        //   url: "/namu/plant-identify",
        // },
        // {
        //   title: "OpenAI테스트",
        //   url: "/namu/openai-test",
        // },
        // {
        //   title: "게시물 목록",
        //   url: "/namu/post-list",
        // },
        // {
        //   title: "KJK테스트",
        //   url: "/namu/kjk",
        // },
        // {
        //   title: "로그인",
        //   url: "/namu/login",
        // },
        // {
        //   title: "기기 등록 확인",
        //   url: "/namu/deviceReg",
        // },
      ],
    },
    {
      title : "마이페이지",
      url : "/namu/my_farm",
      icon : ActivitySquareIcon,
      items : [
        {
          title: "내 정보 수정",
          url : "/namu/mypage"
        }
      ]
    },
    {
      title : "농장 목록",
      url : "/namu/farmList",
      icon : ActivitySquareIcon,
      items : [
        {
          title: "팔로우 농장 목록",
          url : "/namu/fallowFarmList"
        }
      ]
    },
  ],
};

const BasicLayout = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar data={data} />
        <main className="flex w-full">
          <div className="w-full">
            <BasicHeader navMain={data.navMain} />
            <div className="m-2">
              <Outlet />
            </div>
          </div>
          <div className="sticky top-0 flex h-svh w-80 flex-col gap-3 overflow-y-auto border-l bg-sidebar px-3 py-4">
            <div className="font-bold">내 농장 현황</div>
            <div>
              <div className="flex gap-3">
                <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
                  <div className="mb-2">온도</div>
                  <div className="text-xl font-bold text-primary">23°C</div>
                </div>
                <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
                  <div className="mb-2">습도</div>
                  <div className="text-xl font-bold text-foreground">68%</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-3">
                <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
                  <div className="mb-2">급수</div>
                  <div className="text-xl font-bold text-primary">완료</div>
                </div>
                <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
                  <div className="mb-2">이상</div>
                  <div className="text-xl font-bold text-danger">1건</div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold">알림</span>
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-xl bg-danger"></div>
                  <div>
                    <div className="text-sm">온도 이상 28°C</div>
                    <div className="text-sm opacity-50">초과 5분 전</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="mt-1 h-2 w-2 rounded-xl bg-success"></div>
                  <div>
                    <div className="text-sm">자동 급수 완료</div>
                    <div className="text-sm opacity-50">오전 9:00</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-xl bg-blue-500"></div>
                  <div>
                    <div className="text-sm">나주 딸기 새 게시글</div>
                    <div className="text-sm opacity-50">15분 전</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="font-bold">인기 농장</span>
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="font-bold text-gray-400">1</div>
                  <div>
                    <div className="text-sm">나주 딸기 농장</div>
                    <div className="text-sm opacity-50">팔로워 1,204명</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="font-bold text-gray-400">2</div>
                  <div>
                    <div className="text-sm">청주 토마토 농장</div>
                    <div className="text-sm opacity-50">팔로워 984명</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "group toast border shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton:
                "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton:
                "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
          }}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default BasicLayout;
