import type { FarmRegisterData } from "@/types/farmType";
import { api } from "@/utils";

export const postFarmRegister = async(data : FarmRegisterData) => {
  const response = await api.post("/farm", data)
  return response;
}