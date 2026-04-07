import type { Meta, StoryObj } from "@storybook/react-vite";
import FeedCard from "./FeedCard";
import type { FeedPost } from "@/types/namuType";

const baseFeedPost: FeedPost = {
  id: 1,
  author: "김농부",
  avatarColor: "bg-green-500",
  crop: "토마토",
  timeAgo: "5분 전",
  badge: { label: "농업인", variant: "success" },
  content: "오늘 온도가 28°C까지 올라 자동 환기 시스템을 가동했습니다. 토마토 상태는 양호합니다.",
  sensors: [
    { label: "온도", value: "28°C" },
    { label: "습도", value: "65%" },
    { label: "조도", value: "1200lx" },
    { label: "CO2", value: "450ppm" },
  ],
  barCount: 5,
  activeBarCount: 3,
  tags: ["#토마토", "#온도관리", "#자동화"],
  likes: 12,
  comments: 4,
  category: "농업인",
};

const meta: Meta<typeof FeedCard> = {
  title: "App/Namuwiki/FeedCard",
  component: FeedCard,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeedCard>;

export const Default: Story = {
  args: {
    post: baseFeedPost,
  },
};

export const ManyTags: Story = {
  args: {
    post: {
      ...baseFeedPost,
      id: 2,
      tags: ["#딸기", "#수확", "#봄", "#제철", "#유기농", "#나주", "#신선", "#직거래"],
      crop: "딸기",
      author: "이딸기",
      avatarColor: "bg-red-400",
    },
  },
};

export const HighEngagement: Story = {
  args: {
    post: {
      ...baseFeedPost,
      id: 3,
      author: "박명농",
      avatarColor: "bg-blue-500",
      likes: 248,
      comments: 57,
      activeBarCount: 5,
      content: "이번 수확량이 역대 최고입니다! 새로운 비료 배합 덕분인 것 같습니다.",
    },
  },
};
