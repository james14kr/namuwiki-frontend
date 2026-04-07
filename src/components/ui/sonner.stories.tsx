import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Toaster } from "./sonner";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster position="top-center" />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success("작업이 성공적으로 완료되었습니다.")}>
      성공 토스트 보기
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => toast.error("오류가 발생했습니다. 다시 시도해주세요.")}
    >
      오류 토스트 보기
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast("파일이 삭제되었습니다.", {
          action: {
            label: "실행취소",
            onClick: () => toast.success("삭제가 취소되었습니다."),
          },
        })
      }
    >
      액션 포함 토스트 보기
    </Button>
  ),
};
