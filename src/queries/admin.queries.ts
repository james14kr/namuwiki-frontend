import { selectFarmerList } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";

// 인증번호를 가진 농장주 조회
export const useGetFarmerList = () => {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: selectFarmerList,
  });
};