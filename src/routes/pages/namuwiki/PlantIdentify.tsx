import { useState } from "react";
import type { ColDef, RowClassParams } from "ag-grid-community";
import { Button, GridCard, ImageUploader, SectionCard } from "@/components";
import { useIdentifyPlant } from "@/queries/plant.queries";
import type { PlantResult } from "@/types/namuType";
import { toastMutation } from "@/lib/toast";

const colDefs: ColDef<PlantResult>[] = [
  {
    field: "key",
    headerName: "순위",
    width: 80,
    sortable: false,
  },
  {
    field: "score",
    headerName: "일치율",
    width: 100,
    valueFormatter: (p) =>
      p.value != null ? `${(p.value * 100).toFixed(1)}%` : "",
  },
  {
    field: "scientificName",
    headerName: "학명",
    flex: 1,
  },
  {
    field: "korName",
    headerName: "한글명",
    flex: 1,
    valueFormatter: (p) => p.value ?? "-",
  },
  {
    headerName: "속명",
    flex: 1,
    valueGetter: (p) =>
      p.data?.korGenusNm
        ? `${p.data.korGenusNm} (${p.data.genus})`
        : p.data?.genus ?? "",
  },
  {
    headerName: "과명",
    flex: 1,
    valueGetter: (p) =>
      p.data?.korFamilyNm
        ? `${p.data.korFamilyNm} (${p.data.family})`
        : p.data?.family ?? "",
  },
  {
    field: "commonNames",
    headerName: "영문 일반명",
    flex: 2,
    valueFormatter: (p) =>
      Array.isArray(p.value) ? p.value.join(", ") : "-",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const PlantIdentify = () => {
  const [images, setImages] = useState<File[]>([]);

  const { mutateAsync, data, isPending } = useIdentifyPlant();

  const handleAnalyze = async () => {
    if (images.length === 0) return;

    await toastMutation(
      mutateAsync,
      images,
      "이미지를 분석중입니다.",
      (data) => `최적의 일치 식물 : ${data.bestMatch}`,
      "분석에 실패하였습니다."
    );
    setImages([]);
  };

  const rowData: PlantResult[] = data?.results ?? [];

  const getRowClass = (params: RowClassParams<PlantResult>) => {
    if (params.data?.key === data?.bestMatchKey) {
      return "ag-row-best-match";
    }
    return "";
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="식물 사진 등록">
        <div className="flex flex-col gap-4">
          <ImageUploader files={images} onChange={setImages} />
          <div className="flex justify-end">
            <Button
              onClick={handleAnalyze}
              disabled={images.length === 0 || isPending}
            >
              {isPending ? "분석 중..." : "분석하기"}
            </Button>
          </div>
        </div>
      </SectionCard>
      <div className="h-52">
        <GridCard<PlantResult>
          title={
            data
              ? `분석 결과 — 최적 일치: ${data.bestMatch}`
              : "분석 결과"
          }
          count={rowData.length}
          rowData={rowData}
          overlayNoRowsTemplate='<span style="color: var(--foreground); font-size: 14px;">데이터가 없습니다.</span>'
          columnDefs={colDefs}
          getRowClass={getRowClass}
          className="h-full"
        />
      </div>

    </div>
  );
};

export default PlantIdentify;
