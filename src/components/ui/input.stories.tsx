import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, Mail, Lock, User } from "lucide-react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div className="w-32">
        <Story/>
      </div>
    ),
  ],
  args: {
    className: "max-w-sm",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: {
    type: "text",
    placeholder: "텍스트를 입력하세요",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "example@email.com",
    icon: <Mail size={16} />,
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    icon: <Lock size={16} />,
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "숫자를 입력하세요",
    min: 0,
    max: 100,
    className: "w-44"
  },
};

export const Search_: Story = {
  name: "Search",
  args: {
    type: "search",
    placeholder: "검색어를 입력하세요",
    icon: <Search size={16} />,
  },
};

export const File: Story = {
  args: {
    type: "file",
    accept: "image/*",
  },
};

export const Range: Story = {
  args: {
    type: "range",
    min: 0,
    max: 100,
    defaultValue: 50,
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "비활성화 상태",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    type: "text",
    value: "읽기 전용 값",
    readOnly: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    type: "text",
    placeholder: "사용자 이름",
    icon: <User size={16} />,
    iconPosition: "left",
  },
};

export const WithRightIcon: Story = {
  args: {
    type: "text",
    placeholder: "검색",
    icon: <Search size={16} />,
    iconPosition: "right",
  },
};
