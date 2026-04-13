import { useGetMyDevices } from "@/queries/device/useGetMyDevices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Sprout, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { decodeToken } from "@/utils/auth";
import type { DeviceItem } from "@/types/deviceType";

const MyDeviceList = () => {
  // 로그인한 농장주 이메일 추출
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token.replace("Bearer ", "")) : null;
  const farmerEmail = decoded?.sub ?? "";

  const { data: devices, isLoading } = useGetMyDevices(farmerEmail);

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
        <Cpu className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">나의 기기 목록</h1>
      </div>

      {/* 기기 없을 때 */}
      {(devices ?? []).length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          등록된 기기가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(devices ?? []).map((device: DeviceItem) => (
            <Card key={device.deviceId} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2 border-b bg-green-50 dark:bg-green-950/20">
                <CardTitle className="flex items-center justify-between text-base">
                  {/* 기기 ID */}
                  <span className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Cpu className="h-4 w-4" />
                    {device.deviceId}
                  </span>
                  {/* 연결 상태 뱃지 */}
                  {device.isActive === 1 ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      연결됨
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      미연결
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 pt-4 text-sm text-muted-foreground">
                {/* 연결된 농작물 */}
                <div className="flex items-center gap-2">
                  <Sprout className="h-3.5 w-3.5 shrink-0 text-green-600" />
                  <span>
                    농작물:{" "}
                    <span className="text-foreground font-medium">
                      {device.cropName ?? "미연결"}
                    </span>
                  </span>
                </div>

                {/* 연결된 농장 */}
                {device.farmName && (
                  <div className="flex items-center gap-2">
                    <span className="ml-[22px]">
                      농장:{" "}
                      <span className="text-foreground font-medium">
                        {device.farmName}
                      </span>
                    </span>
                  </div>
                )}

                {/* 등록일 */}
                {device.registeredAt && (
                  <p className="text-xs ml-[22px]">
                    등록일: {new Date(device.registeredAt).toLocaleDateString("ko-KR")}
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

export default MyDeviceList;
