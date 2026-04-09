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

export const getFarmDetail = async (farmId : number) => {
  const response = await api.get(`/farm/${farmId}`)
  return response.data;
}

export const getMyFarmList = async (farmerEmail : string) => {
  const response = await api.get("/farm/my", {params : {farmerEmail}});
  return response.data;
}