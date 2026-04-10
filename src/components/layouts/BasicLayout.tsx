import BasicHeader from "./BasicHeader";
import { ThemeProvider } from "../theme-provider";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../sidebar/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import FarmSidebar from "./sidebar/FarmSidebar";
import UserSidebar from "./sidebar/UserSidebar";

import { Home, Users , AppWindow, UserPlus, Sprout, MonitorCog, User, Settings, Cpu} from "lucide-react";
import type { SidebarData } from "@/types/sidebarType";
import PlantCommunityLogo from "./Logo";
import ManagerSidebar from "./sidebar/ManagerSidebar";

const userNavMain = [
  {title: "홈", url : "/namu/post-list", icon: Home},
  { 
    title: "게시판", 
    url: "/namu/post-list", 
    icon: AppWindow},
  {
    title : "마이페이지",
    url : "/namu/my_farm",
    icon : Users,
    items : [
      {
        title: "내 정보 수정",
        url : "/namu/my-farm"
      }
    ]
  },
  {
    title : "농장 목록",
    url : "/namu/farm-list",
    icon : Sprout,
  },
]

const farmerNavMain = [
  { 
    title: "홈", 
    url: "/namu/post-list", 
    icon: Home 
  },
  { 
    title: "게시판", 
    url: "/namu/post-list", 
    icon: AppWindow,
    items : [
      {
        title: "게시판 목록",
        url : "/namu/post-list"
      }
    ]
  },
  { 
    title: "마이페이지", 
    url: "/namu/my-farm", 
    icon: Users ,
    items : [
      {
        title: "내 정보 수정",
        url : "/namu/my-farm"
      }
    ]
  },
  { 
    title: "팔로워 목록", 
    url: "/namu/follower-list", 
    icon: UserPlus 
  }, 
  { 
    title: "내 농장 관리", 
    url: "/namu/dashboard", 
    icon: Sprout ,
    items : [
      {
        title: "농장 등록 하기",
        url : "/namu/farm-register"
      },
      {
        title: "나의 농장 목록",
        url : "/namu/my-farm-list"
      },
      
    ]
  }, 
  { 
    title: "기기 등록", 
    url: "#", 
    icon: MonitorCog ,
    items : [
      {
        title: "나의 기기 목록",
        url : "#"
      },
      {
        title: "기기 등록 하기",
        url : "/namu/device-register",
        icon : Cpu
      },
    ]
  },               
];

const adminNavMain = [
  {
    title : "홈",
    url : "/",
    icon : Home
  },
  {
    title : "회원 관리",
    url : "/namu/admin/MemberManagement",
    icon : User
  },
  {
    title : "기기 관리",
    url : "/namu/admin/DeviceRegistration",
    icon : Settings 
  },
  {
    title : "게시글 관리",
    url : "/namu/post-list",
    icon : AppWindow
  },
  {
    title : "기기 등록",
    url : "/namu/admin/device-create",
    icon : Cpu
  },
  {
    title : "기기 목록",
    url : "/namu/admin/device-list",
    icon : Cpu
  }
]

const BasicLayout = () => {
  const role = localStorage.getItem("role");

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
      navMain: role === "FARMER" ? farmerNavMain : role === "ADMIN" ? adminNavMain : userNavMain
  };
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
          {role === "FARMER" ? <FarmSidebar/> : role === "ADMIN" ? <ManagerSidebar/> : <UserSidebar/>}
  
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


// [
//         {
//           title: "홈",
//           url: "/namu/post-list",
//           icon: Home,
//           isActive: true,
//         },
//         {
//           title: "게시판",
//           url: "#",
//           icon: ActivitySquareIcon,
//           isActive: true,
//           items: [
//             // {
//             //   title: "메인 피드",
//             //   url: "/namu/main-feed",
//             // },
//             // {
//             //   title: "농장 대시보드",
//             //   url: "/namu/dashboard",
//             // },
//             // {
//             //   title: "작물별 AI 제어",
//             //   url: "/namu/ai-control",
//             // },
//             // {
//             //   title: "커뮤니티",
//             //   url: "/namu/community",
//             // },
//             // {
//             //   title: "마이페이지",
//             //   url: "/namu/my-farm",
//             // },
//             // {
//             //   title: "테스트",
//             //   url: "/namu/plant-identify",
//             // },
//             // {
//             //   title: "OpenAI테스트",
//             //   url: "/namu/openai-test",
//             // },
//             // {
//             //   title: "게시물 목록",
//             //   url: "/namu/post-list",
//             // },
//             // {
//             //   title: "KJK테스트",
//             //   url: "/namu/kjk",
//             // },
//             // {
//             //   title: "로그인",
//             //   url: "/namu/login",
//             // },
//             // {
//             //   title: "기기 등록 확인",
//             //   url: "/namu/deviceReg",
//             // },
//           ],
//         },
//         {
//           title : "마이페이지",
//           url : "/namu/my_farm",
//           icon : ActivitySquareIcon,
//           items : [
//             {
//               title: "내 정보 수정",
//               url : "/namu/my-farm"
//             }
//           ]
//         },
      
//       ],8