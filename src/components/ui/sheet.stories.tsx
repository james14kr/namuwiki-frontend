import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Button } from "./button";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof Sheet>;

const SheetDemo = ({ side }: { side: "left" | "right" | "top" | "bottom" }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline">{side} 열기</Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>시트 제목</SheetTitle>
        <SheetDescription>
          {side} 방향으로 열리는 시트입니다. 여기에 콘텐츠를 넣을 수 있습니다.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-2">
        <p className="text-sm">콘텐츠 영역</p>
      </div>
    </SheetContent>
  </Sheet>
);

export const Left: Story = {
  render: () => <SheetDemo side="left" />,
};

export const Right: Story = {
  render: () => <SheetDemo side="right" />,
};

export const Top: Story = {
  render: () => <SheetDemo side="top" />,
};

export const Bottom: Story = {
  render: () => <SheetDemo side="bottom" />,
};
