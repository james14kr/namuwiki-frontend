import type { Meta, StoryObj } from "@storybook/react-vite";
import SectionCard from "./SectionCard";

const meta: Meta<typeof SectionCard> = {
  title: "App/Common/SectionCard",
  component: SectionCard,
};

export default meta;
type Story = StoryObj<typeof SectionCard>;

export const WithTitle: Story = {
  args: {
    title: "센서 정보",
    children: (
      <div className="flex gap-4">
        <div className="rounded-md border bg-muted/50 px-4 py-3">
          <div className="text-xs text-muted-foreground">온도</div>
          <div className="text-lg font-bold">22°C</div>
        </div>
        <div className="rounded-md border bg-muted/50 px-4 py-3">
          <div className="text-xs text-muted-foreground">습도</div>
          <div className="text-lg font-bold">65%</div>
        </div>
        <div className="rounded-md border bg-muted/50 px-4 py-3">
          <div className="text-xs text-muted-foreground">조도</div>
          <div className="text-lg font-bold">1200 lux</div>
        </div>
      </div>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    children: (
      <p className="text-sm text-muted-foreground">
        제목 없이 콘텐츠만 표시하는 섹션 카드입니다.
      </p>
    ),
  },
};

export const CustomContent: Story = {
  args: {
    title: "농장 현황",
    children: (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded border p-2">
          <span className="text-sm">나주 딸기 농장</span>
          <span className="text-xs text-green-600">정상</span>
        </div>
        <div className="flex items-center justify-between rounded border p-2">
          <span className="text-sm">청주 토마토 농장</span>
          <span className="text-xs text-yellow-600">주의</span>
        </div>
        <div className="flex items-center justify-between rounded border p-2">
          <span className="text-sm">전주 상추 농장</span>
          <span className="text-xs text-red-600">위험</span>
        </div>
      </div>
    ),
  },
};
