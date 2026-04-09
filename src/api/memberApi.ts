import { api } from "@/utils";
import axios from "axios";
import type { MemInfoDTO } from "@/types/memberType";

export const memberApi = {

  // 마이페이지 조회 axios
  getMemInfo: async (memEmail: string): Promise<MemInfoDTO> => {
    const { data } = await api.get(`/mypage`, { params: { memEmail } });
    return data;
  },

  // 마이페이지 프사 업데이트 axios
  updateProfileImg: async (memEmail: string, memProfileImg: string) => {
    const { data } = await api.put(`/mypage/profile-img`, { memEmail, memProfileImg });
    return data;
  },






  
};






