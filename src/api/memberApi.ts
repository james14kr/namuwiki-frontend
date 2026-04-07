import { api } from "@/utils";
import axios from "axios";

// 마이페이지 조회 axios
export const getMemInfo1 = async (memEmail) => {
  try {
    const response = await api.get(`/mypage`, { params: { memEmail } });
    return response;
  } catch (e) {
    console.log("마이페이지 조회 axios 오류", e);
  }
};
