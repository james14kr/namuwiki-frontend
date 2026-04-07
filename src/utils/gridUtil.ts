import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
  themeQuartz,
  type GridApi,
} from "ag-grid-community";

import { AllCommunityModule as chartsModules, ModuleRegistry as chartsModuleRegistry } from "ag-charts-community";
import {
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_KR,
} from "@ag-grid-community/locale";
import i18n from "@/i18n";

const myTheme = themeQuartz.withParams({
  // 핵심 색상
  accentColor: "hsl(var(--primary))",

  // 배경/글자
  backgroundColor: "hsl(var(--background))",
  foregroundColor: "hsl(var(--foreground))",

  // 헤더
  headerBackgroundColor: "hsl(var(--muted))",
  headerTextColor: "hsl(var(--foreground))",

  // 보더
  borderColor: "hsl(var(--border))",

  rowHoverColor: "hsl(var(--accent))",
  selectedRowBackgroundColor: "hsl(var(--secondary))",

  // 입력/포커스
  inputBorder: "hsl(var(--input))",
  inputFocusBorder: "hsl(var(--ring))",
  borderRadius: 0,
  wrapperBorderRadius: 0,
  inputBorderRadius: 0,
  checkboxBorderRadius: 0,
});

export const setupGridGlobalOption = () => {
  provideGlobalGridOptions({
    theme: myTheme,
    localeText: getAgGridLocale(i18n.language),
  });

  ModuleRegistry.registerModules([AllCommunityModule]);
  chartsModuleRegistry.registerModules([chartsModules]);
};

export const getAgGridLocale = (lng: string) => {
  const lang = (lng ?? "ko").toLowerCase();

  if (lang.startsWith("ko")) return AG_GRID_LOCALE_KR;

  return AG_GRID_LOCALE_EN;
};

export const GridUtils = {
  // 마아아안약에 any타입 풀어줄거면 <T extends object = any> 로 제네릭 바꾸기
  getAllRows<T extends object>(api: GridApi): T[] {
    const rowData: T[] = [];
    api.forEachNode((node) => {
      if (node.data) {
        rowData.push(node.data);
      }
    });
    return rowData;
  },
};
