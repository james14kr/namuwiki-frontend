import { useEffect, useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { type AgChartOptions } from "ag-charts-community";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, delayMs = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setStarted(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);

  return count;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  format: "number" | "currency";
  trend: number;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
  sparkData: number[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  format,
  trend,
  gradientFrom,
  gradientTo,
  delay,
  sparkData,
}: StatCardProps) {
  const count = useCountUp(value, 1800, delay);
  const isPositive = trend >= 0;
  const maxSpark = Math.max(...sparkData);
  const formatted =
    format === "currency" ? `₩${count.toLocaleString()}` : count.toLocaleString();

  return (
    <div
      className="home-slide-up group relative overflow-hidden rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      {/* Watermark icon */}
      <div className="absolute -right-3 -top-3 opacity-[0.12] transition-all duration-300 group-hover:opacity-[0.22] group-hover:scale-110">
        <Icon className="h-24 w-24 text-white" />
      </div>

      <div className="relative z-10">
        {/* Icon + trend badge */}
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm shadow-inner">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div
            className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-bold backdrop-blur-sm ${
              isPositive ? "bg-white/25 text-white" : "bg-red-900/40 text-red-100"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </div>
        </div>

        {/* Value */}
        <div className="mt-4">
          <p className="text-xs font-medium text-white/70 tracking-wide uppercase">{label}</p>
          <p className="mt-1 text-2xl font-black tracking-tight text-white drop-shadow-sm">
            {formatted}
          </p>
        </div>

        {/* Sparkline */}
        <div className="mt-4 flex h-9 items-end gap-[3px]">
          {sparkData.map((h, i) => (
            <div
              key={i}
              className="home-sparkline-bar flex-1 rounded-t-sm bg-white/35 transition-all duration-200 hover:bg-white/60"
              style={{ height: `${(h / maxSpark) * 100}%`, animationDelay: `${delay + i * 55}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const monthlyData = [
  { month: "1월", revenue: 1200000, orders: 38 },
  { month: "2월", revenue: 980000, orders: 30 },
  { month: "3월", revenue: 1450000, orders: 45 },
  { month: "4월", revenue: 1100000, orders: 34 },
  { month: "5월", revenue: 1680000, orders: 52 },
  { month: "6월", revenue: 1320000, orders: 41 },
  { month: "7월", revenue: 1900000, orders: 59 },
  { month: "8월", revenue: 1560000, orders: 48 },
  { month: "9월", revenue: 2100000, orders: 65 },
  { month: "10월", revenue: 1750000, orders: 54 },
  { month: "11월", revenue: 2300000, orders: 71 },
  { month: "12월", revenue: 1500000, orders: 50 },
];

const quarterlyData = [
  { quarter: "Q1", 소설: 52, IT기술: 38, 자기계발: 24, 경영: 18 },
  { quarter: "Q2", 소설: 61, IT기술: 42, 자기계발: 31, 경영: 22 },
  { quarter: "Q3", 소설: 48, IT기술: 55, 자기계발: 28, 경영: 30 },
  { quarter: "Q4", 소설: 73, IT기술: 49, 자기계발: 40, 경영: 27 },
];

const categoryData = [
  { category: "소설", value: 35 },
  { category: "IT/기술", value: 25 },
  { category: "자기계발", value: 20 },
  { category: "경영/경제", value: 15 },
  { category: "기타", value: 5 },
];

const activities = [
  { id: 1, message: "신규 주문 #1289가 들어왔습니다", time: "2분 전", status: "new" as const },
  { id: 2, message: "주문 #1288이 배송 완료되었습니다", time: "15분 전", status: "done" as const },
  { id: 3, message: "주문 #1287 결제 처리 중", time: "32분 전", status: "pending" as const },
  { id: 4, message: "주문 #1286이 배송 완료되었습니다", time: "1시간 전", status: "done" as const },
  { id: 5, message: "신규 주문 #1285가 들어왔습니다", time: "1시간 전", status: "new" as const },
  { id: 6, message: "주문 #1284이 배송 완료되었습니다", time: "2시간 전", status: "done" as const },
  { id: 7, message: "주문 #1283 재고 부족 알림", time: "3시간 전", status: "pending" as const },
];

const STAT_CARDS = [
  {
    icon: ShoppingCart,
    labelKo: "오늘의 주문 건수",
    labelEn: "Today's Orders",
    value: 13,
    format: "number" as const,
    trend: 12.5,
    gradientFrom: "#f97316",
    gradientTo: "#ea580c",
    darkFrom: "#9a3412",
    darkTo: "#7c2d12",
    delay: 0,
    sparkData: [3, 5, 4, 7, 5, 8, 6, 9, 7, 10],
  },
  {
    icon: Package,
    labelKo: "이 달의 주문 건수",
    labelEn: "Monthly Orders",
    value: 50,
    format: "number" as const,
    trend: 8.2,
    gradientFrom: "#6366f1",
    gradientTo: "#4f46e5",
    darkFrom: "#3730a3",
    darkTo: "#312e81",
    delay: 120,
    sparkData: [4, 6, 5, 8, 6, 7, 8, 7, 9, 8],
  },
  {
    icon: DollarSign,
    labelKo: "오늘의 매출 금액",
    labelEn: "Today's Revenue",
    value: 500000,
    format: "currency" as const,
    trend: -3.1,
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    darkFrom: "#065f46",
    darkTo: "#064e3b",
    delay: 240,
    sparkData: [7, 5, 8, 6, 9, 7, 6, 8, 5, 7],
  },
  {
    icon: TrendingUp,
    labelKo: "이 달의 매출 금액",
    labelEn: "Monthly Revenue",
    value: 1500000,
    format: "currency" as const,
    trend: 15.7,
    gradientFrom: "#0ea5e9",
    gradientTo: "#0284c7",
    darkFrom: "#075985",
    darkTo: "#0c4a6e",
    delay: 360,
    sparkData: [3, 5, 6, 8, 7, 9, 8, 10, 9, 10],
  },
];

const ACTIVITY_CONFIG = {
  new: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  done: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
} as const;

// ─── Home Page ────────────────────────────────────────────────────────────────

const Home = () => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isKo = i18n.language === "ko";

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const agTheme = isDark ? "ag-default-dark" : "ag-default";

  // ── Chart options ────────────────────────────────────────────────────────

  const revenueOptions = useMemo<AgChartOptions>(
    () => ({
      theme: agTheme,
      title: { text: isKo ? "월별 매출 추이" : "Monthly Revenue Trend" },
      data: monthlyData,
      series: [
        {
          type: "area",
          xKey: "month",
          yKey: "revenue",
          yName: isKo ? "매출 (₩)" : "Revenue (₩)",
          fillOpacity: 0.25,
        },
      ],
    }),
    [agTheme, isKo]
  );

  const quarterlyOptions = useMemo<AgChartOptions>(
    () => ({
      theme: agTheme,
      title: { text: isKo ? "카테고리별 분기 판매량" : "Quarterly Sales by Category" },
      data: quarterlyData,
      series: [
        { type: "bar", xKey: "quarter", yKey: "소설", yName: isKo ? "소설" : "Novel", stacked: true },
        { type: "bar", xKey: "quarter", yKey: "IT기술", yName: "IT/Tech", stacked: true },
        { type: "bar", xKey: "quarter", yKey: "자기계발", yName: isKo ? "자기계발" : "Self-Dev", stacked: true },
        { type: "bar", xKey: "quarter", yKey: "경영", yName: isKo ? "경영" : "Business", stacked: true },
      ],
    }),
    [agTheme, isKo]
  );

  const pieOptions = useMemo<AgChartOptions>(
    () => ({
      theme: agTheme,
      title: { text: isKo ? "카테고리별 점유율" : "Category Share" },
      data: categoryData,
      series: [
        {
          type: "pie",
          angleKey: "value",
          calloutLabelKey: "category",
          innerRadiusRatio: 0.6,
          sectorSpacing: 3,
        },
      ],
    }),
    [agTheme, isKo]
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto scrollbar-thin pb-1">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div
        className="home-animate-gradient relative overflow-hidden rounded-2xl shadow-xl"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)"
            : "linear-gradient(135deg, #f97316 0%, #f59e0b 40%, #ef4444 70%, #f97316 100%)",
          backgroundSize: "300% 300%",
        }}
      >
        {/* Floating decorations */}
        <div className="home-float-slow absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div
          className="home-float-medium absolute right-28 top-3 h-16 w-16 rounded-2xl bg-white/10"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="home-float-fast absolute right-14 bottom-3 h-10 w-10 rounded-full bg-white/15"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="home-float-slow absolute left-1/3 -top-6 h-24 w-24 rounded-full bg-white/5"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="home-float-fast absolute left-2/3 bottom-2 h-8 w-8 rounded-xl bg-white/10"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative z-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Welcome text */}
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/75">
                {isKo ? "실시간 대시보드" : "Live Dashboard"}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white drop-shadow-sm md:text-3xl">
              {isKo ? "안녕하세요! 오늘도 화이팅 🚀" : "Welcome Back! Let's crush it 🚀"}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              {isKo
                ? "오늘의 비즈니스 현황을 한눈에 확인하세요."
                : "Here's what's happening with your business today."}
            </p>
          </div>

          {/* Quick summary pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { labelKo: "오늘 주문", labelEn: "Orders", value: "13건", Icon: ShoppingCart },
              { labelKo: "오늘 매출", labelEn: "Revenue", value: "₩500,000", Icon: DollarSign },
              { labelKo: "처리 대기", labelEn: "Pending", value: "3건", Icon: Zap },
            ].map((pill, i) => (
              <div
                key={pill.labelKo}
                className="home-fade-scale flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <pill.Icon className="h-4 w-4 text-white/90" />
                <div>
                  <div className="text-[10px] font-medium text-white/60">
                    {isKo ? pill.labelKo : pill.labelEn}
                  </div>
                  <div className="text-sm font-bold text-white">{pill.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.labelKo}
            icon={card.icon}
            label={isKo ? card.labelKo : card.labelEn}
            value={card.value}
            format={card.format}
            trend={card.trend}
            gradientFrom={isDark ? card.darkFrom : card.gradientFrom}
            gradientTo={isDark ? card.darkTo : card.gradientTo}
            delay={card.delay}
            sparkData={card.sparkData}
          />
        ))}
      </div>

      {/* ── Charts + Activity ────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 gap-3" style={{ minHeight: 420 }}>

        {/* Left: Charts stacked */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            className="home-fade-scale flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
            style={{ animationDelay: "500ms", minHeight: 200 }}
          >
            <AgCharts className="h-full" options={revenueOptions} />
          </div>
          <div
            className="home-fade-scale flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
            style={{ animationDelay: "600ms", minHeight: 200 }}
          >
            <AgCharts className="h-full" options={quarterlyOptions} />
          </div>
        </div>

        {/* Right: Pie + Activity */}
        <div className="flex w-72 flex-shrink-0 flex-col gap-3 xl:w-80">

          {/* Donut chart */}
          <div
            className="home-fade-scale overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
            style={{ animationDelay: "700ms", height: 260 }}
          >
            <AgCharts className="h-full" options={pieOptions} />
          </div>

          {/* Activity feed */}
          <div
            className="home-fade-scale flex flex-1 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm"
            style={{ animationDelay: "800ms" }}
          >
            {/* Feed header */}
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">
                {isKo ? "최근 활동" : "Recent Activity"}
              </span>
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {activities.length}
              </span>
            </div>

            {/* Feed items */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {activities.map((item, idx) => {
                const cfg = ACTIVITY_CONFIG[item.status];
                const ActivityIcon =
                  item.status === "new"
                    ? ShoppingCart
                    : item.status === "done"
                    ? CheckCircle2
                    : Loader2;

                return (
                  <div
                    key={item.id}
                    className="home-slide-right flex items-start gap-3 border-b px-4 py-3 last:border-0 transition-colors duration-150 hover:bg-muted/40 cursor-default"
                    style={{ animationDelay: `${880 + idx * 65}ms` }}
                  >
                    <div className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${cfg.bg} ${cfg.text}`}>
                      <ActivityIcon
                        className={`h-3 w-3 ${item.status === "pending" ? "animate-spin" : ""}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug text-foreground">{item.message}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </div>
                    </div>
                    <div className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${cfg.dot}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
