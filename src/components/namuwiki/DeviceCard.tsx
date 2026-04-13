import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/tw.utils";
import type { SensorActuatorData } from "@/types/namuType";

// createDate(ISO 문자열)를 현재 시각 기준 상대 시간으로 변환
const formatDate = (dateStr: string) => {
  if(!dateStr) return "정보 없음";
  const normalized = dateStr.endsWith("Z") || dateStr.includes("+")
    ? dateStr
    : dateStr + "Z";
  const date = new Date(normalized);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${Math.floor(diffHours / 24)}일 전`;
};

const DeviceCard = ({ data }: { data: SensorActuatorData }) => {
   // 온도 값을 soilMax 기준으로 8단계 바 차트로 변환
  const activeBars_temp = Math.min(
    8,
    Math.round((data.tempC / (data.tempMax || 100)) * 8)
  );

   // 조도 값을 soilMax 기준으로 8단계 바 차트로 변환
  const activeBars_ldr = Math.min(
    8,
    Math.round((data.ldrValue / (data.luxMax || 100)) * 8)
  );
  
  
  // 토양수분 값을 soilMax 기준으로 8단계 바 차트로 변환
  const activeBars_soil = Math.min(
    8,
    Math.round((data.soilMoistureValue / (data.soilMax || 100)) * 8)
  );


  // 센서 데이터 표시 목록
  const sensors = [
    { label: "온도", value: `${data.tempC}°C` },
    { label: "습도", value: `${data.humidity}%` },
    { label: "조도", value: `${data.ldrValue}` },
    { label: "토양수분", value: `${data.soilMoistureValue}%` },
  ];

  // 액추에이터 상태 목록 (1: ON, 0: OFF)
  const actuators = [
    { label: "팬", status: data.fanStatus },
    { label: "LED", status: data.ledStatus },
    { label: "펌프", status: data.pumpStatus },
  ];
  
  return (
    <Card>
      <CardContent className="p-5">
        {/* 카드 헤더: 디바이스 ID, 데이터 등록 시각, IoT 연동 뱃지 */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* 디바이스 ID 첫 글자를 아바타로 표시 */}
            <Avatar className="size-9">
              <AvatarFallback className="bg-emerald-700 text-sm font-semibold text-white">
                {data.deviceId?.charAt(0)?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {`${data.deviceId} ( ${data.crops} ) `}
              </div>
              {/* 마지막 센서 데이터 수집 시각 */}
              <div className="text-xs text-muted-foreground">
                {formatDate(data.createDate)}
              </div>
            </div>
          </div>
          <Badge variant="success">IoT 연동</Badge>
        </div>

        {/* 센서 수치 4칸 그리드 */}
        <div className="mb-3 grid grid-cols-4 gap-2">
          {sensors.map((sensor) => (
            <div
              key={sensor.label}
              className="rounded-md border bg-muted/50 px-3 py-2"
            >
              <div className="text-xs text-muted-foreground">{sensor.label}</div>
              <div className="text-sm font-bold text-foreground">
                {sensor.value}
              </div>
            </div>
          ))}
        </div>

        {/* 온도 기반 바 차트 (activeBars 개수만큼 진한 색으로 표시) */}
        <div className="mb-3 flex gap-1">
          <p
            className="text-sm"
          >온도</p>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-sm",
                i < activeBars_temp ? "bg-rose-500" : "bg-rose-500/25"
              )}
            />
          ))}
        </div>


        {/* 조도 기반 바 차트 (activeBars 개수만큼 진한 색으로 표시) */}
        <div className="mb-3 flex gap-1">
          <p
            className="text-sm"
          >조도</p>
          {Array.from({ length: 8 }).map((_, i) => (
            
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-sm",
                i < activeBars_ldr ? "bg-orange-400" : "bg-orange-400/25"
              )}
            />
          ))}
        </div>




        {/* 토양수분 기반 바 차트 (activeBars 개수만큼 진한 색으로 표시) */}
        <div className="mb-3 flex gap-1">
          <p
            className="text-sm"
          >토수</p>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-sm",
                i < activeBars_soil ? "bg-blue-500" : "bg-blue-500/25"
              )}
            />
          ))}
        </div>

        {/* 액추에이터 ON/OFF 상태 (초록 점: ON, 회색 점: OFF) */}
        <div className="flex flex-wrap gap-3">
          {actuators.map((a) => (
            <span
              key={a.label}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  a.status === 1 ? "bg-success" : "bg-muted-foreground"
                )}
              />
              {a.label} {a.status === 1 ? "ON" : "OFF"}
            </span>
          ))}
        </div>
        <div>
        
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
