import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Calendar } from "./calendar";
import type { DateRange as DayPickerDateRange } from "react-day-picker";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    mode: "single",
  },
};

export const WithSelectedDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [range, setRange] = useState<DayPickerDateRange | undefined>();
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-md border"
      />
    );
  },
};
