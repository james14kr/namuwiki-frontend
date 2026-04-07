import { useMemo, useState } from "react";
import { GridCard } from "@/components";
import type { SalesInfo } from "@/types/salesType";
import type { ColGroupDef, ColDef } from "ag-grid-community";
import dayjs from "dayjs";

const SelectSalseInfo = () => {
  const data = [];
  const result = useMemo(() => {
    if (!data) return [];
    return data.map((x: SalesInfo, i: number) => {
      return {
        no: i + 1,
        ...x,
      };
    });
  }, [data]);
  const [colDefs] = useState<(ColDef<SalesInfo> | ColGroupDef)[]>([
    {
      field: "no",
      headerName: "No",
      width: 80,
      sortable: true,
    },
    {
      headerName: "구매자 정보",
      marryChildren: true,
      children: [
        { field: "buyerName", headerName: "구매자명", flex: 1 },
        {
          field: "buyerPhone",
          headerName: "연락처",
          flex: 1,
          valueFormatter: (p) => (!p.value ? "-" : p.value),
        },
        {
          field: "salesDate",
          headerName: "판매일",
          flex: 1,
          valueFormatter: (p) =>
            p.value != null ? dayjs(p.value).format("YYYY-MM-DD HH:mm:ss") : "",
        },
        { field: "color", headerName: "색상", flex: 1 },
      ],
    },
    {
      headerName: "구매자 정보",
      marryChildren: true,
      children: [
        { field: "modelName", headerName: "모델명", flex: 1 },
        {
          field: "price",
          headerName: "가격",
          flex: 1,
          valueFormatter: (p) =>
            p.value != null ? `₩${Number(p.value).toLocaleString()}원` : "",
        },
      ],
    },
  ]);
  return (
    <div className="flex h-full flex-col">
      <GridCard<SalesInfo>
        title="등록된 판매정보 목록"
        count={result.length}
        rowData={result}
        columnDefs={colDefs}
      />
    </div>
  );
};

export default SelectSalseInfo;
