import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type { SensorHistory } from "@/types/namuType";

interface Props {
  data: SensorHistory[];
}

type MetricKey = "tempC" | "humidity" | "soilMoistureValue";

const TABS: { key: MetricKey; label: string; unit: string; color: string; gradient: string }[] = [
  { key: "tempC",            label: "온도",     unit: "°C", color: "#ef4444", gradient: "#fecaca" },
  { key: "humidity",         label: "습도",     unit: "%",  color: "#3b82f6", gradient: "#bfdbfe" },
  { key: "soilMoistureValue",label: "토양수분", unit: "",   color: "#22c55e", gradient: "#bbf7d0" },
];

const formatTime = (dateStr: string) => dateStr.slice(11, 16);

const CustomTooltip = ({ active, payload, label, unit }: TooltipProps<number, string> & { unit: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md text-xs">
      <p className="mb-1 text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
};

const SensorChart = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<MetricKey>("tempC");

  if (!data || data.length < 2) {
    return (
      <div className="flex h-36 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
        수집된 데이터가 부족합니다.
      </div>
    );
  }

  const chartData = [...data].reverse().map((d) => ({
    ...d,
    time: formatTime(d.createDate),
  }));

  const tab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="mt-3 rounded-xl border bg-card p-4 shadow-sm">
      {/* 탭 */}
      <div className="mb-4 flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
              activeTab === t.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 현재 탭 최신값 */}
      <div className="mb-3 flex items-end gap-1">
        <span className="text-2xl font-bold" style={{ color: tab.color }}>
          {chartData[chartData.length - 1]?.[tab.key]}
        </span>
        <span className="mb-0.5 text-sm text-muted-foreground">{tab.unit}</span>
        <span className="mb-0.5 ml-auto text-xs text-muted-foreground">
          최근 {data.length}개
        </span>
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${tab.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={tab.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={tab.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            interval={Math.ceil((chartData.length - 1) / 4)}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} unit={tab.unit} />}
            cursor={{ stroke: tab.color, strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey={tab.key}
            stroke={tab.color}
            strokeWidth={2.5}
            fill={`url(#grad-${tab.key})`}
            dot={false}
            activeDot={{ r: 5, fill: tab.color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
