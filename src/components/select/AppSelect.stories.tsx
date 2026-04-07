import type { Meta, StoryObj } from "@storybook/react-vite";
import AppSelect, { type ItemType } from "./AppSelect";

const items: ItemType[] = [
  { value: "tomato", title: "토마토" },
  { value: "strawberry", title: "딸기" },
  { value: "lettuce", title: "상추" },
  { value: "pepper", title: "고추", disabled: true },
  { value: "cucumber", title: "오이" },
];

const meta: Meta<typeof AppSelect> = {
  title: "App/Select/AppSelect",
  component: AppSelect,
  args: {
    id: "app-select",
    items,
  },
};

export default meta;
type Story = StoryObj<typeof AppSelect>;

export const Default: Story = {
  args: {
    id: "select-default",
    placeholder: "작물을 선택하세요",
  },
};

export const WithLabel: Story = {
  args: {
    id: "select-label",
    label: "작물 선택",
    description: "재배 중인 작물을 선택해주세요.",
    placeholder: "작물을 선택하세요",
  },
};

export const Disabled: Story = {
  args: {
    id: "select-disabled",
    label: "비활성화",
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    id: "select-empty",
    label: "빈 목록",
    items: [],
  },
};
