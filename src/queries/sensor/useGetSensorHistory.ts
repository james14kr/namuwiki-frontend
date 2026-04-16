import { getSensorHistory } from "@/api/sensor.api"
import { useQuery } from "@tanstack/react-query"

export const useGetSensorHistory = (cropId: number, limit = 20) => {
  return useQuery({
    queryKey: ["sensorHistory", cropId],
    queryFn: () => getSensorHistory(cropId, limit),
    enabled: !!cropId,
    refetchInterval: 60000
  })
}