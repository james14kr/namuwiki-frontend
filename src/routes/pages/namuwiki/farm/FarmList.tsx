import { useGetFarmList } from "@/queries/farm/useGetFarmList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, MapPin, Search } from "lucide-react";
import { Input } from "@/components";
import { useState } from "react";
import type { FarmItem } from "@/types/farmType";
import { useNavigate } from "react-router-dom";

const FarmList = () => {
  const nav = useNavigate();
  const { data: farms, isLoading } = useGetFarmList();
  const [search, setSearch] = useState("");

  const filtered = (farms ?? []).filter((farm: FarmItem) =>
    farm.farmName.includes(search) || farm.farmAddr.includes(search)
  );

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
        <h1 className="text-2xl font-bold">농장 목록</h1>
        <span className="ml-auto text-sm text-muted-foreground">
          총 {filtered.length}개 농장
        </span>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="농장 이름 또는 주소 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          등록된 농장이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((farm: FarmItem) => (
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

export default FarmList;
