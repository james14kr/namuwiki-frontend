import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import DatePicker from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "App/DatePicker/DatePicker",
  component: DatePicker,
  args: {
    id: "datepicker",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    id: "datepicker-default",
    placeholder: "날짜를 선택하세요",
  },
};

export const WithLabel: Story = {
  args: {
    id: "datepicker-label",
    label: "시작일",
    placeholder: "날짜를 선택하세요",
  },
};

export const CustomFormat: Story = {
  args: {
    id: "datepicker-format",
    label: "날짜",
    format: "MM/dd/yyyy",
    defaultValue: new Date(),
  },
};

export const Disabled: Story = {
  args: {
    id: "datepicker-disabled",
    label: "비활성화",
    defaultValue: new Date(),
    disabled: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="space-y-2">
        <DatePicker
          id="datepicker-controlled"
          label="제어형 날짜 선택"
          value={date}
          onChange={setDate}
        />
        <p className="text-sm text-muted-foreground">
          선택된 날짜: {date?.toLocaleDateString("ko-KR") ?? "없음"}
        </p>
      </div>
    );
  },
};
