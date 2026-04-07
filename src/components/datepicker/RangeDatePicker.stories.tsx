import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RangeDatePicker } from "./RangeDatePicker";
import type { DateRange } from "react-day-picker";

const meta: Meta<typeof RangeDatePicker> = {
  title: "App/DatePicker/RangeDatePicker",
  component: RangeDatePicker,
  args: {
    id: "range-datepicker",
  },
};

export default meta;
type Story = StoryObj<typeof RangeDatePicker>;

export const Default: Story = {
  args: {
    id: "range-default",
    placeholder: "날짜 범위를 선택하세요",
  },
};

export const WithLabel: Story = {
  args: {
    id: "range-label",
    label: "조회 기간",
    placeholder: "날짜 범위를 선택하세요",
  },
};

export const Disabled: Story = {
  args: {
    id: "range-disabled",
    label: "비활성화",
    disabled: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
      <div className="space-y-2">
        <RangeDatePicker
          id="range-controlled"
          label="기간 선택"
          value={range}
          onChange={setRange}
        />
        <p className="text-sm text-muted-foreground">
          선택된 범위: {range?.from?.toLocaleDateString("ko-KR") ?? "없음"}{" "}
          {range?.to ? `~ ${range.to.toLocaleDateString("ko-KR")}` : ""}
        </p>
      </div>
    );
  },
};
