import { useGetMyFarmList } from "@/queries/farm/useGetMyFarmList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, MapPin, Plus } from "lucide-react";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "@/utils/auth";
import type { FarmItem } from "@/types/farmType";

const MyFarmList = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token.replace("Bearer ", "")) : null;
  const farmerEmail = decoded?.sub ?? "";

  const { data: farms, isLoading } = useGetMyFarmList(farmerEmail);

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Sprout className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">나의 농장 목록</h1>
        <Button
          className="ml-auto bg-green-600 hover:bg-green-700"
          onClick={() => nav("/namu/farm-register")}
        >
          <Plus className="h-4 w-4 mr-1" />
          농장 등록
        </Button>
      </div>

      {/* 목록 */}
      {(farms ?? []).length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          등록된 농장이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(farms ?? []).map((farm: FarmItem) => (
            <Card 
              key={farm.farmId} 
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => nav(`/namu/farm-detail/${farm.farmId}`)}
              >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-green-700 dark:text-green-400">
                  <Sprout className="h-4 w-4" />
                  {farm.farmName}
                </CardTitle>
                <Button onClick={() => nav(`/namu/crop-register/${farm.farmId}`)}>
                  농작물 추가
                </Button>
              </CardHeader>

              <CardContent className="space-y-1 text-sm text-muted-foreground">
                {farm.farmAddr && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {farm.farmAddr}
                  </div>
                )}
                {farm.farmDesc && (
                  <p className="line-clamp-2 pt-1 text-foreground/80">
                    {farm.farmDesc}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFarmList;