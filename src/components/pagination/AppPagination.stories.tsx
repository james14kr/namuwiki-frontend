import type { Meta, StoryObj } from "@storybook/react-vite";
import AppPagination from "./AppPagination";

const meta: Meta<typeof AppPagination> = {
  title: "App/Pagination/AppPagination",
  component: AppPagination,
  args: {
    onPageClick: (page: number) => console.log("페이지 클릭:", page),
  },
};

export default meta;
type Story = StoryObj<typeof AppPagination>;

export const FewPages: Story = {
  args: {
    totalRow: 15,
    maxRow: 5,
  },
};

export const ManyPages: Story = {
  args: {
    totalRow: 100,
    maxRow: 5,
  },
};

export const SinglePage: Story = {
  args: {
    totalRow: 3,
    maxRow: 5,
  },
};
