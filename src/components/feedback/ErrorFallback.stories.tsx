import type { Meta, StoryObj } from "@storybook/react-vite";
import ErrorFallback from "./ErrorFallback";

const meta: Meta<typeof ErrorFallback> = {
  title: "App/Feedback/ErrorFallback",
  component: ErrorFallback,
  args: {
    resetErrorBoundary: () => alert("다시 시도"),
  },
};

export default meta;
type Story = StoryObj<typeof ErrorFallback>;

export const Default: Story = {
  args: {
    error: new Error("예상치 못한 오류가 발생했습니다."),
  },
};

export const CustomTitle: Story = {
  args: {
    error: new Error("데이터를 불러오지 못했습니다."),
    title: "데이터 로드 실패",
  },
};

export const HideDetails: Story = {
  args: {
    error: new Error("서버 내부 오류"),
    showDetails: false,
  },
};

export const NetworkError: Story = {
  args: {
    error: new Error("Network Error: Failed to fetch - 서버에 연결할 수 없습니다."),
    title: "네트워크 오류",
  },
};
