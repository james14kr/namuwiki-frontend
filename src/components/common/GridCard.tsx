import { cn } from "@/utils/tw.utils";
import type { AgGridReactProps } from "ag-grid-react";
import AppGrid from "@/components/grid/AppGrid";
import { useTheme } from "@/components/theme-provider";

interface GridCardProps<T> extends AgGridReactProps<T> {
  title: string;
  count?: number;
  className?: string;
}

function GridCard<T>({
  title,
  count,
  className,
  ...gridProps
}: GridCardProps<T>) {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  // green 테마는 light 계열이므로 ag-theme-quartz 사용

  return (
    <section className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <h2 className="mb-3 text-base font-semibold text-foreground">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({count}건)
          </span>
        )}
      </h2>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-xl border shadow-sm",
          isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz"
        )}
      >
        <AppGrid<T> {...gridProps} className="h-full" />
      </div>
    </section>
  );
}

export default GridCard;
