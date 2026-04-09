import { getFarmDetail } from "@/api/farmApi"
import { useQuery } from "@tanstack/react-query"

export const useGetFarmDetail = (farmId : number) => {
  return useQuery({
    queryKey : ["farmDetail", farmId],
    queryFn : () => getFarmDetail(farmId),
    enabled : !!farmId
  });
};