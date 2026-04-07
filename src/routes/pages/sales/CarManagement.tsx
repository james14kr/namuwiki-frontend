import { useState } from "react";
import type { ColDef } from "ag-grid-community";
import AppSelect, { type ItemType } from "@/components/select/AppSelect";
import { Button, Input, Label, SectionCard, GridCard } from "@/components";
import type { CarInfo } from "@/types/salesType";
import { infoToast } from "@/lib/toast";

const MANUFACTURERS: ItemType[] = [
  { value: "현대", title: "현대" },
  { value: "기아", title: "기아" },
  { value: "제네시스", title: "제네시스" },
  { value: "BMW", title: "BMW" },
  { value: "벤츠", title: "벤츠" },
  { value: "아우디", title: "아우디" },
];

const colDefs: ColDef<CarInfo>[] = [
  {
    field: "no",
    headerName: "No",
    width: 80,
    sortable: true,
  },
  { field: "modelNo", headerName: "모델번호", flex: 1 },
  { field: "modelName", headerName: "모델명", flex: 2 },
  { field: "manufacturer", headerName: "제조사", flex: 1 },
  {
    field: "price",
    headerName: "차량가격",
    flex: 2,
    valueFormatter: (p) =>
      p.value != null ? `₩${Number(p.value).toLocaleString()}` : "",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CarManagement = () => {
  const [manufacturer, setManufacturer] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const rowData: CarInfo[] = [];

  const isFormValid =
    manufacturer !== "" && modelName.trim() !== "" && price !== 0;

  const handleRegister = () => {
    if (!isFormValid) return;

    infoToast("등록");

    setManufacturer("");
    setModelName("");
    setPrice(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <SectionCard title="차량 등록">
        <div className="flex items-end justify-between gap-5">
          <div className="flex flex-wrap items-end gap-5">
            <div className="flex items-center gap-2">
              <Label className="w-14 shrink-0 text-sm font-medium">
                제조사
              </Label>
              <AppSelect
                id="car-manufacturer"
                items={MANUFACTURERS}
                placeholder="선택"
                value={manufacturer}
                onValueChange={setManufacturer}
                className="w-36 max-w-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="car-model-name"
                className="w-14 shrink-0 text-sm font-medium"
              >
                모델명
              </Label>
              <Input
                id="car-model-name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="모델명 입력"
                className="w-44"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="car-price"
                className="w-14 shrink-0 text-sm font-medium"
              >
                차량가격
              </Label>
              <Input
                id="car-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.type === "number" ? Number(e.target.value) : 0
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="가격 입력"
                className="w-44"
              />
            </div>
          </div>
          <Button onClick={handleRegister} disabled={!isFormValid}>
            등록
          </Button>
        </div>
      </SectionCard>

      <GridCard<CarInfo>
        title="등록된 차량 목록"
        count={rowData.length}
        rowData={rowData}
        columnDefs={colDefs}
      />
    </div>
  );
};

export default CarManagement;
