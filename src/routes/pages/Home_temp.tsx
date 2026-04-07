import { useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import {
  type AgCartesianChartOptions,
  type AgChartOptions,
} from "ag-charts-community";
import { useTheme } from "@/components/theme-provider";

const data = [
  { asset: "Stocks", amount: 600 },
  { asset: "Bonds", amount: 400 },
  { asset: "Cash", amount: 700 },
  { asset: "Real Estate", amount: 500 },
  { asset: "Commodities", amount: 300 },
];

const data2 = [
  { quarter: "Q1 25", quota: 50, stretch: 30, actual: 65 },
  { quarter: "Q2 25", quota: 100, stretch: 38, actual: 160 },
  { quarter: "Q3 25", quota: 140, stretch: 50, actual: 120 },
  { quarter: "Q4 25", quota: 80, stretch: 34, actual: 96 },
];

const data3 = [
  {
    quarter: "Q1'18",
    iphone: 140,
    mac: 16,
    ipad: 14,
    wearables: 12,
    services: 20,
  },
  {
    quarter: "Q2'18",
    iphone: 124,
    mac: 20,
    ipad: 14,
    wearables: 12,
    services: 30,
  },
  {
    quarter: "Q3'18",
    iphone: 112,
    mac: 20,
    ipad: 18,
    wearables: 14,
    services: 36,
  },
  {
    quarter: "Q4'18",
    iphone: 118,
    mac: 24,
    ipad: 14,
    wearables: 14,
    services: 36,
  },
];

const Home = () => {
  const { theme } = useTheme();

  const options = useMemo<AgChartOptions>(() => {
    return {
      data: data,
      theme: theme === "light" ? "ag-default" : "ag-default-dark",
      series: [
        {
          type: "pie",
          angleKey: "amount",
          calloutLabelKey: "asset",
        },
      ],
    };
  }, [theme]);

  const options2 = useMemo<AgCartesianChartOptions>(() => {
    return {
      data: data2,
      title: {
        text: "작년 분기 대비 매출액",
      },
      theme: theme === "light" ? "ag-default" : "ag-default-dark",
      series: [
        {
          type: "bar",
          direction: "horizontal",
          xKey: "quarter",
          yKey: "quota",
          yName: "Quota",
          stacked: true,
          fillOpacity: 0.3,
          grouped: false,
          highlight: {
            enabled: false,
          },
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "quarter",
          yKey: "stretch",
          yName: "Stretch Target",
          stacked: true,
          fillOpacity: 0.3,
          grouped: false,
          highlight: {
            enabled: false,
          },
        },
        {
          type: "bar",
          direction: "horizontal",
          xKey: "quarter",
          yKey: "actual",
          yName: "Actual",
          grouped: false,
          widthRatio: 0.7,
        },
      ],
    };
  }, [theme]);

  const options3 = useMemo<AgChartOptions>(() => {
    return {
      title: {
        text: "분기별 부서 실적",
      },
      theme: theme === "light" ? "ag-material" : "ag-material-dark",
      data: data3,
      series: [
        {
          type: "bar",
          xKey: "quarter",
          yKey: "iphone",
          yName: "iPhone",
        },
        {
          type: "bar",
          xKey: "quarter",
          yKey: "mac",
          yName: "Mac",
        },
        {
          type: "bar",
          xKey: "quarter",
          yKey: "ipad",
          yName: "iPad",
        },
        {
          type: "bar",
          xKey: "quarter",
          yKey: "wearables",
          yName: "Wearables",
        },
        {
          type: "bar",
          xKey: "quarter",
          yKey: "services",
          yName: "Services",
        },
      ],
    };
  }, [theme]);

  return (
    <div className="h-full">
      <div className="mb-2 flex h-[20%] gap-3 text-primary-foreground">
        <div className="h-full w-1/2 rounded-md bg-primary px-6 py-4 shadow-md">
          <div className="mb-5 text-[24px]">오늘의 주문 건수</div>
          <div className="text-right text-[50px] font-black">13</div>
        </div>
        <div className="h-full w-1/2 rounded-md border px-6 py-4 bg-primary/40 text-black shadow-md">
          <div className="mb-5 text-[24px]">이 달의 주문 건수</div>
          <div className="text-right text-[50px] font-black">50</div>
        </div>
        <div className="h-full w-1/2 rounded-md border px-6 py-4 bg-primary/40 text-black shadow-md">
          <div className="mb-5 text-[24px]">오늘의 매출 금액</div>
          <div className="text-right text-[50px] font-black">
            {(500000).toLocaleString()}\
          </div>
        </div>
        <div className="h-full w-1/2 rounded-md bg-blue-400 px-6 py-4 shadow-md">
          <div className="mb-5 text-[24px]">이 달의 매출 금액</div>
          <div className="text-right text-[50px] font-black">
            {(1500000).toLocaleString()}\
          </div>
        </div>
      </div>
      <div className="flex h-[79%] w-full gap-3 pb-3">
        <div className="flex h-full w-[70%] flex-col gap-3 rounded-md">
          <div className="h-1/2 rounded-md border shadow-md">
            <AgCharts className="h-full" options={options2} />
          </div>
          <div className="h-1/2 rounded-md border shadow-md">
            <AgCharts className="h-full" options={options3} />
          </div>
        </div>
        <div className="flex w-[30%] flex-col gap-3 rounded-md border shadow-md">
            <AgCharts className="h-full" options={options} />
          <div className="px-3 font-bold">
            <div className="mb-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit
              deleniti, ea recusandae ab illum. Et velit autem impedit ea
              distinctio!
            </div>
            <div className="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
              cupiditate mollitia rem at ab? rem maxime, blanditiis tenetur.
            </div>
            <div className="mb-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa
              ullam harum quae eligendi reiciendis expedita officia optio
              voluptate? Natus quasi hic nam omnis totam placeat ipsum aut nobis
              reprehenderit eaque!
            </div>
            <div className="mb-4">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. magni
              quidem incidunt temporibus odit recusandae similique.
            </div>
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              reprehenderit, eum!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
