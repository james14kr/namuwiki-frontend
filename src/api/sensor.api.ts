import type { SensorActuatorData } from "@/types/namuType";
import { api } from "@/utils";

//cropId로 최신 센서 데이터 조회
export const getSensorDataByCropId = async (cropId : number): Promise<SensorActuatorData | null> => {
  const response = await api.get(`/sensorActuator/latest/crop`, {params: {cropId}});
  return response.status === 204 ? null : response.data;
}