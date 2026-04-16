import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetSensorHistory } from "@/queries/sensor/useGetSensorHistory";

type MetricKey = "tempC" | "humidity" | "soilMoistureValue";
type PeriodKey = "1d" | "7d" | "30d";

const TABS: { key: MetricKey; label: string; unit: string; color: string }[] = [
  { key: "tempC",             label: "온도",     unit: "°C", color: "#ef4444" },
  { key: "humidity",          label: "습도",     unit: "%",  color: "#3b82f6" },
  { key: "soilMoistureValue", label: "토양수분", unit: "",   color: "#22c55e" },
];

const PERIODS: { key: PeriodKey; label: string; days: number }[] = [
  { key: "1d",  label: "하루",   days: 1  },
  { key: "7d",  label: "일주일", days: 7  },
  { key: "30d", label: "한달",   days: 30 },
];

const getStartDate = (days: number) => {
  const now = new Date();
  now.setDate(now.getDate() - days);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const formatTime = (dateStr: string, days: number) => {
  if (days <= 1) return dateStr.slice(11, 16);       // HH:mm
  if (days <= 7) return dateStr.slice(5, 13);        // MM-DD HH
  return dateStr.slice(5, 10);                       // MM-DD
};

interface TooltipEntry { value?: string | number | readonly (string | number)[] }
interface CustomTooltipProps {
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: string | number;
  unit: string;
}

const CustomTooltip = ({ active, payload, label, unit }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md text-xs">
      <p className="mb-1 text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">
        {payload[0].value}{unit}
      </p>
    </div>
  );
};

const SensorChart = ({ cropId }: { cropId: number }) => {
  const [activeTab, setActiveTab]       = useState<MetricKey>("tempC");
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("1d");

  const period    = PERIODS.find((p) => p.key === activePeriod)!;
  const tab       = TABS.find((t) => t.key === activeTab)!;
  const startDate = useMemo(() => getStartDate(period.days), [activePeriod]);

  const { data: rawData, isLoading } = useGetSensorHistory(cropId, 5000, startDate);

  if (isLoading) {
    return (
      <div className="flex h-36 items-center justify-center text-xs text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  if (!rawData || rawData.length < 2) {
    return (
      <div className="mt-3 rounded-xl border bg-card p-4 shadow-sm">
        {/* 지표 탭 */}
        <div className="mb-3 flex gap-1 rounded-lg bg-muted p-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                activeTab === t.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>{t.label}</button>
          ))}
        </div>
        {/* 기간 탭 */}
        <div className="mb-3 flex gap-1">
          {PERIODS.map((p) => (
            <button key={p.key} onClick={() => setActivePeriod(p.key)}
              className={`rounded-full px-3 py-0.5 text-xs transition-all ${
                activePeriod === p.key ? "font-semibold text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              style={activePeriod === p.key ? { backgroundColor: tab.color } : {}}
            >{p.label}</button>
          ))}
        </div>
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
          해당 기간에 수집된 데이터가 없습니다.
        </div>
      </div>
    );
  }

  const chartData = [...rawData].reverse().map((d) => ({
    ...d,
    time: formatTime(d.createDate, period.days),
  }));

  return (
    <div className="mt-3 rounded-xl border bg-card p-4 shadow-sm">
      {/* 지표 탭 */}
      <div className="mb-3 flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
              activeTab === t.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* 기간 탭 */}
      <div className="mb-3 flex gap-1">
        {PERIODS.map((p) => (
          <button key={p.key} onClick={() => setActivePeriod(p.key)}
            className={`rounded-full px-3 py-0.5 text-xs transition-all ${
              activePeriod === p.key ? "font-semibold text-white" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            style={activePeriod === p.key ? { backgroundColor: tab.color } : {}}
          >{p.label}</button>
        ))}
      </div>

      {/* 최신값 */}
      <div className="mb-3 flex items-end gap-1">
        <span className="text-2xl font-bold" style={{ color: tab.color }}>
          {chartData[chartData.length - 1]?.[tab.key]}
        </span>
        <span className="mb-0.5 text-sm text-muted-foreground">{tab.unit}</span>
        <span className="mb-0.5 ml-auto text-xs text-muted-foreground">
          {period.label} · {rawData.length}개
        </span>
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${tab.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={tab.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={tab.color} stopOpacity={0}   />
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
