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
  { label: "온도",     configured: (d: SensorActuatorData) => d.tempMax > 0, check: (d: SensorActuatorData) => d.tempC >= d.tempMin && d.tempC <= d.tempMax },
  { label: "토양수분", configured: (d: SensorActuatorData) => d.soilMax > 0, check: (d: SensorActuatorData) => d.soilMoistureValue >= d.soilMin && d.soilMoistureValue <= d.soilMax },
  { label: "조도",     configured: (d: SensorActuatorData) => d.luxMax > 0,  check: (d: SensorActuatorData) => d.ldrValue >= d.luxMin && d.ldrValue <= d.luxMax },
];

function getCropHealth(data: SensorActuatorData) {
  const active = METRICS.filter((m) => m.configured(data));
  if (active.length === 0) return null;
  const failed = active.filter((m) => !m.check(data)).map((m) => m.label);
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
                  <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-500">
                    {health.failed.join(", ")} 범위를 벗어났습니다
                  </p>
                </div>
              );
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
