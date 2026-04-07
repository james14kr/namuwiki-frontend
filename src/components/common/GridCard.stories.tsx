import type { Meta, StoryObj } from "@storybook/react-vite";
import GridCard from "./GridCard";
import type { ColDef } from "ag-grid-community";

interface RowData {
  name: string;
  crop: string;
  status: string;
  temperature: number;
}

const columnDefs: ColDef<RowData>[] = [
  { field: "name", headerName: "이름", flex: 1 },
  { field: "crop", headerName: "작물", flex: 1 },
  { field: "status", headerName: "상태", flex: 1 },
  { field: "temperature", headerName: "온도 (°C)", flex: 1 },
];

const rowData: RowData[] = [
  { name: "농장 A", crop: "토마토", status: "정상", temperature: 22 },
  { name: "농장 B", crop: "딸기", status: "주의", temperature: 28 },
  { name: "농장 C", crop: "상추", status: "정상", temperature: 20 },
  { name: "농장 D", crop: "오이", status: "정상", temperature: 23 },
  { name: "농장 E", crop: "고추", status: "위험", temperature: 32 },
];

const meta: Meta<typeof GridCard<RowData>> = {
  title: "App/Common/GridCard",
  component: GridCard,
  decorators: [
    (Story) => (
      <div style={{ height: 400, width: 1000 }} className="flex flex-col">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GridCard<RowData>>;

export const Default: Story = {
  args: {
    title: "농장 목록",
    rowData,
    columnDefs,
  },
};

export const WithCount: Story = {
  args: {
    title: "농장 목록",
    count: rowData.length,
    rowData,
    columnDefs,
  },
};

export const Empty: Story = {
  args: {
    title: "농장 목록",
    count: 0,
    rowData: [],
    columnDefs,
  },
};
