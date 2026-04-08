import { createBrowserRouter } from "react-router-dom";
import RouteError from "./pages/RouteError";
import { dynamic } from "@/utils/dynamic";
import DeviceRegistration from "./pages/namuwiki/admin/DeviceRegistration";
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
const PostDetailPage = dynamic(
  () => import("../routes/pages/namuwiki/post/PostDetail")
);
const KjkPage = dynamic(() => import("../routes/pages/namuwiki/kjk/Kjk"));
const Practice = dynamic(
  () => import("../routes/pages/namuwiki/practice/Practice")
);


export const router = createBrowserRouter([
  {
    path : "/namu/login",
    Component : LoginLayout,
    errorElement : <RouteError/>,
    children: [
      {
        index : true,
        Component : LoginPage
      }
    ]
  },
  {
    path: "/",
    Component: ProtectedRoute,
    errorElement: <RouteError />,
    children: [
      {
        Component : BasicLayout,
        children : [
          {
            index: true,
            Component: Home,
          },
          {
            path: "namu",
            children: [
              {
                path: "main-feed",
                Component: MainFeedPage,
              },
              {
                path: "dashboard",
                Component: DashboardPage,
              },
              {
                path: "ai-control",
                Component: AiControlPage,
              },
              {
                path: "community",
                Component: CommunityPage,
              },
              {
                path: "my-farm",
                Component: MyFarmPage,
              },
              {
                path: "plant-identify",
                Component: PlantIdentifyPage,
              },
              {
                path: "sale-records",
                Component: RegisterSalesPage,
              },
              {
                path: "sales-info",
                Component: SelectSalseInfoPage,
              },
              {
                path: "openai-test",
                Component: OpenAiControlTestPage,
              },
              {
                path: "post-register",
                Component: PostRegisterPage,
              },
              {
                path: "post-list",
                Component: PostListPage,
              },
              {
                path: "post-list/:postId",
                Component: PostDetailPage,
              },
              // {
              //   path: "post",
              //   Component: <User />,
              //   children: [
              //     {
              //       path: ":postId",
              //       Component: <User />,
              //     },
              //   ],
              // },
              {
                path: "kjk",
                Component: KjkPage,
              },
              {
                path: "practice",
                Component: Practice,
              },
              {
                path: "DeviceReg",
                Component: DeviceRegistration,
              },
            ],
          },
          {
            path: "sales-info",
            Component: SelectSalseInfoPage,
          },
        ],
      },
      {
        path: "namu",
        children: [
          {
            path: "main-feed",
            Component: MainFeedPage,
          },
          {
            path: "dashboard",
            Component: DashboardPage,
          },
          {
            path: "ai-control",
            Component: AiControlPage,
          },
          {
            path: "community",
            Component: CommunityPage,
          },
          {
            path: "my-farm",
            Component: MyFarmPage,
          },
          {
            path: "plant-identify",
            Component: PlantIdentifyPage,
          },
          {
            path: "sale-records",
            Component: RegisterSalesPage,
          },
          {
            path: "sales-info",
            Component: SelectSalseInfoPage,
          },
          {
            path: "openai-test",
            Component: OpenAiControlTestPage,
          },
          {
            path: "login",
            Component: LoginPage
          },
          {
            path: "post-register",
            Component: PostRegisterPage,
          },
          {
            path: "post-edit/:postId",
            Component: PostEditPage,
          },
          {
            path: "post-list",
            Component: PostListPage,
          },
          {
            path: "post-list/:postId",
            Component: PostDetailPage,
          },
          // {
          //   path: "post",
          //   Component: <User />,
          //   children: [
          //     {
          //       path: ":postId",
          //       Component: <User />,
          //     },
          //   ],
          // },
          {
            path: "kjk",
            Component: KjkPage,
          },
          {
            path: "practice",
            Component: Practice,
          },
          // {
          //   path: "Login",
          //   Component: Login,
          // },
        ],
      },
    ],
  },
]);
