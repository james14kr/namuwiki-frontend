import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { Button } from "./button";
import { Info } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-full h-[700px] flex items-center justify-center p-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">마우스를 올려보세요</Button>
      </TooltipTrigger>
      <TooltipContent>툴팁 내용입니다</TooltipContent>
    </Tooltip>
  ),
};

export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">위쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="top">위에 표시되는 툴팁</TooltipContent>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">아래쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">아래에 표시되는 툴팁</TooltipContent>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">왼쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="left">왼쪽에 표시되는 툴팁</TooltipContent>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">오른쪽</Button>
      </TooltipTrigger>
      <TooltipContent side="right">오른쪽에 표시되는 툴팁</TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm">
          <Info size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>추가 정보를 확인하세요</TooltipContent>
    </Tooltip>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 place-items-center">
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">위</Button>
        </TooltipTrigger>
        <TooltipContent side="top">top</TooltipContent>
      </Tooltip>
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">좌</Button>
        </TooltipTrigger>
        <TooltipContent side="left">left</TooltipContent>
      </Tooltip>
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">우</Button>
        </TooltipTrigger>
        <TooltipContent side="right">right</TooltipContent>
      </Tooltip>
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">아래</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">bottom</TooltipContent>
      </Tooltip>
      <div />
    </div>
  ),
};
