import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components";
import { useGetSensorData } from "@/queries/sensor/useGetSensorData";
import DeviceCard from "./DeviceCard";
import type { CropItem } from "@/types/cropType";
import { useUnlinkDevice } from "@/queries/device/useUnlinkDevice";
import { useGetSensorHistory } from "@/queries/sensor/useGetSensorHistory";
import SensorChart from "./SensorChart";
import type { SensorActuatorData } from "@/types/namuType";

const METRICS = [
  { label: "온도",     unit: "°C", configured: (d: SensorActuatorData) => d.tempMax > 0, check: (d: SensorActuatorData) => d.tempC >= d.tempMin && d.tempC <= d.tempMax, current: (d: SensorActuatorData) => d.tempC,              min: (d: SensorActuatorData) => d.tempMin, max: (d: SensorActuatorData) => d.tempMax },
  { label: "토양수분", unit: "",    configured: (d: SensorActuatorData) => d.soilMax > 0, check: (d: SensorActuatorData) => d.soilMoistureValue >= d.soilMin && d.soilMoistureValue <= d.soilMax, current: (d: SensorActuatorData) => d.soilMoistureValue, min: (d: SensorActuatorData) => d.soilMin, max: (d: SensorActuatorData) => d.soilMax },
  { label: "조도",     unit: "",    configured: (d: SensorActuatorData) => d.luxMax > 0,  check: (d: SensorActuatorData) => d.ldrValue >= d.luxMin && d.ldrValue <= d.luxMax,                   current: (d: SensorActuatorData) => d.ldrValue,          min: (d: SensorActuatorData) => d.luxMin,  max: (d: SensorActuatorData) => d.luxMax },
];

function getCropHealth(data: SensorActuatorData) {
  const active = METRICS.filter((m) => m.configured(data));
  if (active.length === 0) return null;
  const failed = active
    .filter((m) => !m.check(data))
    .map((m) => ({ label: m.label, unit: m.unit, current: m.current(data), min: m.min(data), max: m.max(data) }));
  return { isHealthy: failed.length === 0, failed };
}

interface CropCardProps {
  crop: CropItem;
  isFarmOwner: boolean;                                      // 농장주 본인 여부
  onDelete: (cropId: number, cropName: string) => void;      // 삭제 핸들러
}

const CropCard = ({ crop, isFarmOwner, onDelete }: CropCardProps) => {
  // 이 crop에 연결된 기기의 최신 센서 데이터 (5초마다 자동 갱신)
  const { data: sensorData } = useGetSensorData(crop.cropId);
  const { mutate: unlink} = useUnlinkDevice(crop.cropId);

  const {data: SensorHistory} = useGetSensorHistory(crop.cropId);

  const handleUnlink = () => {
    if(window.confirm("기기 연결을 해제하시겠습니까?")){
      unlink();
    }
  }

  return (
    <Card>
      <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
        <CardTitle className="flex items-center justify-between text-green-700 dark:text-green-400">
          {crop.cropName}
          {/* 농장주 본인일 때만 삭제 버튼 표시 */}
          {isFarmOwner && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if(sensorData){
                  window.alert(`${sensorData.deviceId}기기가 연결되어 있습니다.\n먼저 기기 연결을 해제한 후 삭제 해주세요.`)
                  return;
                }
                onDelete(crop.cropId, crop.cropName);
              }}
              
            >
              삭제
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-5 text-sm text-muted-foreground">
        {/* 농작물 설명 */}
        {crop.cropDesc && <p>{crop.cropDesc}</p>}

        {/* 농작물 가격 */}
        <p className="font-semibold text-green-600">
          {crop.cropPrice.toLocaleString()}원
        </p>

        {/* 센서 데이터: 연결된 기기가 있으면 DeviceCard 표시, 없으면 안내 문구 */}
        {sensorData ? (
          <div className="space-y-2">
            {/* 생육 상태 뱃지 */}
            {(() => {
              const health = getCropHealth(sensorData);
              if (!health) return null;

              // 농장주: 상세 경고 표시
              if (isFarmOwner) {
                return health.isHealthy ? (
                  <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                    <span>🌱</span>
                    <span>잘 자라고 있어요</span>
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <span>⚠️</span>
                      <span>주의가 필요해요</span>
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {health.failed.map((f) => (
                        <li key={f.label} className="text-xs text-amber-600 dark:text-amber-500">
                          {f.label}: 현재 {f.current}{f.unit} (기준 {f.min}{f.unit} ~ {f.max}{f.unit})
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              // 일반 사용자: 건강하게 자라고 있을 때만 신뢰 배지 표시
              return health.isHealthy ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-950/30">
                  <span className="text-base">✅</span>
                  <div>
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400">IoT 인증 농산물</p>
                    <p className="text-xs text-green-600 dark:text-green-500">실시간 센서 데이터로 최적 환경에서 재배 중입니다</p>
                  </div>
                </div>
              ) : null;
            })()}
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <DeviceCard data={sensorData} />
              </div>
              <div className="min-w-0 flex-1">
                <SensorChart data={SensorHistory ?? []}/>
              </div>
            </div>
            {isFarmOwner && (
              <Button
                size="sm"
                variant="outline"
                className="w-full border-red-300 text-red-500 hover:bg-red-50"
                onClick={handleUnlink}>
                기기 연결 해제
              </Button>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground border border-dashed rounded-md p-3 text-center">
            연결된 기기가 없습니다
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CropCard;
