import { createBrowserRouter } from "react-router-dom";
import RouteError from "./pages/RouteError";
import { dynamic } from "@/utils/dynamic";
import ProtectedRoute from "./ProtectedRoute";
import LoginLayout from "@/components/layouts/LoginLayout";

// lazy pages
// Code Splitting
const BasicLayout = dynamic(() => import("../components/layouts/BasicLayout"));
const Home = dynamic(() => import("../routes/pages/Home"));

const RegisterSalesPage = dynamic(
  () => import("../routes/pages/sale-records/RegisterSales")
);
const SelectSalseInfoPage = dynamic(
  () => import("../routes/pages/sale-records/SelectSalseInfo")
);
const MainFeedPage = dynamic(() => import("../routes/pages/namuwiki/MainFeed"));
const DashboardPage = dynamic(
  () => import("../routes/pages/namuwiki/Dashboard")
);
const AiControlPage = dynamic(
  () => import("../routes/pages/namuwiki/AiControl")
);
const CommunityPage = dynamic(
  () => import("../routes/pages/namuwiki/Community")
);
const MyFarmPage = dynamic(() => import("../routes/pages/namuwiki/MyFarm"));
const PlantIdentifyPage = dynamic(
  () => import("../routes/pages/namuwiki/PlantIdentify")
);
const OpenAiControlTestPage = dynamic(
  () => import("../routes/pages/namuwiki/OpenAiControlTest")
);
const LoginPage = dynamic(
  () => import("./pages/namuwiki/member/LoginPage")
);
const PostRegisterPage = dynamic(
  () => import("../routes/pages/namuwiki/post/PostRegister")
);
const PostEditPage = dynamic(
  () => import("../routes/pages/namuwiki/post/PostEdit")
);
const PostListPage = dynamic(
  () => import("../routes/pages/namuwiki/post/PostList")
);
const PostFeedPage = dynamic(
  () => import("../routes/pages/namuwiki/post/PostFeed")
)
const PostDetailPage = dynamic(
  () => import("../routes/pages/namuwiki/post/PostDetail")
);
const KjkPage = dynamic(() => import("../routes/pages/namuwiki/kjk/Kjk"));
const Practice = dynamic(
  () => import("../routes/pages/namuwiki/practice/Practice")
);

//농장주가 농장 등록하는 페이지
const FarmRegisterPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/FarmRegister")
)

//일반 사용자가 볼 수 있는 농장 목록 페이지
const FarmListPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/FarmList")
)

//일반 사용자가 볼 수 있는 농장 상세 페이지
const FarmDetailPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/FarmDetail")
)

//농장주가 자신이 등록한 농장 목록 페이지
const MyFarmListPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/MyFarmList")
)

//농작물 등록 페이지
const CropRegisterpage = dynamic(
  () => import("../routes/pages/namuwiki/farm/CropRegister")
)

//농장주를 팔로우한 팔로워 목록 페이지
const FollowerListPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/FollowerList")
)

//농장주가 기기 등록하는 페이지
const DeviceRegisterPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/DeviceRegister")
)

//농장주가 등록한 기기 목록 페이지
const MyDeviceListPage = dynamic(
  () => import("../routes/pages/namuwiki/farm/MyDeviceList")
)

// 관리자 페이지
const DeviceRegistration = dynamic(
  () => import("./pages/namuwiki/admin/DeviceRegistration")
);
const MemberManagement = dynamic(
  () => import("./pages/namuwiki/admin/MemberManagement")
);
const PostManagement = dynamic(
  () => import("./pages/namuwiki/admin/PostManagement")
);
const AdminDeviceCreatePage = dynamic(
  () => import("./pages/namuwiki/admin/AdminDeviceCreate")
)
const AdminDeviceListPage = dynamic(
  () => import("./pages/namuwiki/admin/AdminDeviceList")
)


export const router = createBrowserRouter([
  {
    path: "/namu/login",
    Component: LoginLayout,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
    ],
  },
  {
    path: "/",
    Component: ProtectedRoute,
    errorElement: <RouteError />,
    children: [
      {
        Component: BasicLayout,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "namu",
            children: [
              { path: "main-feed",     Component: MainFeedPage },
              { path: "dashboard",     Component: DashboardPage },
              { path: "ai-control",    Component: AiControlPage },
              { path: "community",     Component: CommunityPage },
              { path: "my-farm",       Component: MyFarmPage },
              { path: "plant-identify",Component: PlantIdentifyPage },
              { path: "sale-records",  Component: RegisterSalesPage },
              { path: "sales-info",    Component: SelectSalseInfoPage },
              { path: "openai-test",   Component: OpenAiControlTestPage },
              { path: "post-register", Component: PostRegisterPage },
              { path: "post-edit/:postId", Component: PostEditPage },
              { path: "post-list",     Component: PostListPage },
              { path: "post-feed",     Component: PostFeedPage },
              { path: "post-list/:postId", Component: PostDetailPage },
              { path: "kjk",           Component: KjkPage },
              { path: "practice",      Component: Practice },
              { path: "farm-register", Component: FarmRegisterPage},
              { path: "farm-list", Component: FarmListPage},
              { path: "farm-detail/:farmId", Component: FarmDetailPage},
              { path: "my-farm-list", Component: MyFarmListPage},
              { path: "follower-list", Component: FollowerListPage},
              { path: "crop-register/:farmId", Component: CropRegisterpage},
              { path: "my-device-list", Component: MyDeviceListPage},

              // 관리자 페이지
              { path: "admin/DeviceRegistration", Component: DeviceRegistration },
              { path: "admin/MemberManagement",   Component: MemberManagement },
              { path: "admin/PostManagement",     Component: PostManagement },
              { path: "admin/device-create",     Component: AdminDeviceCreatePage },
              { path: "admin/device-list",     Component: AdminDeviceListPage },
              { path: "device-register",     Component: DeviceRegisterPage },
            ],
          },
        ],
      },
    ],
  },
]);
