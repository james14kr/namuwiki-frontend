import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  args: {
    className: "w-80",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "내용을 입력해주세요...",
    rows: 5,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "수정할 수 없는 텍스트 영역입니다.",
    disabled: true,
  },
};
