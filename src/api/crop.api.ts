import type { CropRegisterData } from "@/types/cropType";
import { api } from "@/utils";

export const postCropRegister = async (data: CropRegisterData) => {
  const response = await api.post("/crop", data);
  return response.data;
}

export const getCropList = async (farmId : number) => {
  const response = await api.get("/crop", {params: {farmId}});
  return response.data;
}