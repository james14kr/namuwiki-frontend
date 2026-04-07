import type { Meta, StoryObj } from "@storybook/react-vite";
import AppBreadcrumb from "./AppBreadcrumb";

const meta: Meta<typeof AppBreadcrumb> = {
  title: "App/Breadcrumb/AppBreadcrumb",
  component: AppBreadcrumb,
  args: {
    appName: "홈",
    data: [],
  },
};

export default meta;
type Story = StoryObj<typeof AppBreadcrumb>;

export const Default: Story = {
  args: {
    appName: "홈",
    data: [
      { title: "게시판", to: "/board" },
      { title: "공지사항", to: "/board/notice" },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    appName: "홈",
    data: [{ title: "대시보드", to: "/dashboard" }],
  },
};

export const ManyLevels: Story = {
  args: {
    appName: "홈",
    data: [
      { title: "카테고리", to: "/category" },
      { title: "농업", to: "/category/farm" },
      { title: "작물 관리", to: "/category/farm/crops" },
      { title: "토마토", to: "/category/farm/crops/tomato" },
      { title: "수확 일지", to: "#" },
    ],
  },
};
