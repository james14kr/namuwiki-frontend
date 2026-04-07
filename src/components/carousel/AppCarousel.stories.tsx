import type { Meta, StoryObj } from "@storybook/react-vite";
import AppCarousel from "./AppCarousel";

const PlaceholderItem = ({ label }: { label: string }) => (
  <div className="flex h-40 w-44 items-center justify-center rounded-lg border bg-muted text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

const items = ["슬라이드 1", "슬라이드 2", "슬라이드 3", "슬라이드 4"].map(
  (label) => <PlaceholderItem key={label} label={label} />
);

const meta: Meta<typeof AppCarousel> = {
  title: "App/Carousel/AppCarousel",
  component: AppCarousel,
  decorators: [
    (Story) => (
      <div className="flex h-[700px] w-full items-center justify-center">
        <div style={{ height: 400, width: 300 }} className="flex flex-col">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    children: items,
  },
};

export default meta;
type Story = StoryObj<typeof AppCarousel>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    children: items,
  },
};

export const AutoScroll: Story = {
  args: {
    autoScroll: true,
    autoScrollTime: 3000,
    children: items,
  },
};

export const InnerArrow: Story = {
  args: {
    innerArrow: true,
    children: items,
  },
};

export const NoButtons: Story = {
  args: {
    prevButtonDisable: true,
    nextButtonDisable: true,
    children: items,
  },
};
