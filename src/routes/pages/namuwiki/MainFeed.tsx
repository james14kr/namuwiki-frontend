import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getListMain1 } from "@/api/mainfeed";
import DeviceCard from "@/components/namuwiki/DeviceCard";
import type { SensorActuatorData } from "@/types/namuType";

const MainFeed = () => {
  // 센서/액추에이터 데이터 목록 상태
  const [getMain, setGetMain] = useState<SensorActuatorData[]>([]);
  const nav = useNavigate();

  // API에서 메인 피드 데이터를 가져와 상태에 저장
  const getListMain = async () => {
    const response = await getListMain1();
    console.log("API 응답:", response?.data);
    if (response) {
      // 응답 구조가 배열인 경우와 data.data 중첩인 경우 모두 처리
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setGetMain(data);
    }
    console.log("response.data" + response.data);
  };

  // 마운트 시 즉시 로드 후 5초마다 데이터 폴링
  useEffect(() => {
    getListMain();
    const interval = setInterval(() => {
      getListMain();
    }, 60000); // 5초마다 갱신
    return () => clearInterval(interval); // 언마운트 시 인터벌 정리
  }, []);

  console.log("겟리스트메인", { getListMain });

  return (
    <>
      <div></div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => nav("/namu/post-register")}
          >
            <Plus className="size-4" />
            게시하기
          </Button>
        </div>

        {/* 디바이스 카드 목록 */}
        <div className="flex flex-col gap-4">
          {getMain.map((item, i) => (
            <DeviceCard key={item.deviceId} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainFeed;
