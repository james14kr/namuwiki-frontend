import type { Meta, StoryObj } from "@storybook/react-vite";
import AppGrid from "./AppGrid";
import type { ColDef } from "ag-grid-community";

interface RowData {
  farm: string;
  crop: string;
  location: string;
  humidity: number;
  temperature: number;
}

const columnDefs: ColDef<RowData>[] = [
  { field: "farm", headerName: "농장명", flex: 1 },
  { field: "crop", headerName: "작물", flex: 1 },
  { field: "location", headerName: "위치", flex: 1 },
  { field: "humidity", headerName: "습도 (%)", flex: 1, sortable: true },
  { field: "temperature", headerName: "온도 (°C)", flex: 1, sortable: true },
];

const rowData: RowData[] = [
  { farm: "나주 딸기 농장", crop: "딸기", location: "전남 나주", humidity: 70, temperature: 18 },
  { farm: "청주 토마토 농장", crop: "토마토", location: "충북 청주", humidity: 65, temperature: 22 },
  { farm: "전주 상추 농장", crop: "상추", location: "전북 전주", humidity: 80, temperature: 20 },
  { farm: "수원 고추 농장", crop: "고추", location: "경기 수원", humidity: 60, temperature: 25 },
  { farm: "제주 감귤 농장", crop: "감귤", location: "제주", humidity: 75, temperature: 19 },
];

const meta: Meta<typeof AppGrid<RowData>> = {
  title: "App/Grid/AppGrid",
  component: AppGrid,
  decorators: [
    (Story) => (
      <div style={{ height: 300, width: 1000 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppGrid<RowData>>;

export const Default: Story = {
  args: {
    rowData,
    columnDefs,
    className: "h-full",
  },
};

export const WithSorting: Story = {
  args: {
    rowData,
    columnDefs,
    className: "h-full",
    defaultColDef: {
      sortable: true,
      filter: true,
    },
  },
};

export const Empty: Story = {
  args: {
    rowData: [],
    columnDefs,
    className: "h-full",
  },
};
