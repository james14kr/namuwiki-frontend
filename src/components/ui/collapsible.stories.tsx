import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Button } from "./button";
import { ChevronsUpDown } from "lucide-react";

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

const CollapsibleDemo = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-72 space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">작물 목록</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm">토마토</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">딸기</div>
        <div className="rounded-md border px-4 py-2 text-sm">상추</div>
        <div className="rounded-md border px-4 py-2 text-sm">오이</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const Default: Story = {
  render: () => <CollapsibleDemo defaultOpen={false} />,
};

export const Expanded: Story = {
  render: () => <CollapsibleDemo defaultOpen={true} />,
};
