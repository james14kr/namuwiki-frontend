import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import AppAlertDialog from "./AppAlertDialog";

const meta: Meta<typeof AppAlertDialog> = {
  title: "App/Alert/AppAlertDialog",
  component: AppAlertDialog,
};

export default meta;
type Story = StoryObj<typeof AppAlertDialog>;

const Wrapper = (args: React.ComponentProps<typeof AppAlertDialog>) => {
  const [open, setOpen] = useState(true);
  return (
    <AppAlertDialog
      {...args}
      open={open}
      onOpenChange={setOpen}
    />
  );
};

export const Default: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    title: "정말 삭제하시겠습니까?",
    description: "이 작업은 되돌릴 수 없습니다.",
    confirmText: "확인",
    cancelText: "취소",
  },
};

export const Destructive: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    title: "데이터를 삭제합니다",
    description: "선택한 항목을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "destructive",
  },
};

export const AsyncConfirm: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    title: "변경사항을 저장합니다",
    description: "서버에 데이터를 저장하는 중 잠시 기다려주세요.",
    confirmText: "저장",
    cancelText: "취소",
    onConfirm: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
  },
};
