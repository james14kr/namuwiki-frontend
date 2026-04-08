import type { FarmRegisterData } from "@/types/farmType";
import { api } from "@/utils";

export const postFarmRegister = async(data : FarmRegisterData) => {
  const response = await api.post("/farm", data)
  return response;
}

export const getFarmList = async () => {
  const response = await api.get("/farm");
  return response.data;
}