import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components";
import { useGetSensorData } from "@/queries/sensor/useGetSensorData";
import DeviceCard from "./DeviceCard";
import type { CropItem } from "@/types/cropType";
import { useUnlinkDevice } from "@/queries/device/useUnlinkDevice";

interface CropCardProps {
  crop: CropItem;
  isFarmOwner: boolean;                                      // 농장주 본인 여부
  onDelete: (cropId: number, cropName: string) => void;      // 삭제 핸들러
}

const CropCard = ({ crop, isFarmOwner, onDelete }: CropCardProps) => {
  // 이 crop에 연결된 기기의 최신 센서 데이터 (5초마다 자동 갱신)
  const { data: sensorData } = useGetSensorData(crop.cropId);
  const { mutate: unlink} = useUnlinkDevice(crop.cropId);

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
              onClick={() => onDelete(crop.cropId, crop.cropName)}
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
            <DeviceCard data={sensorData} />
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
