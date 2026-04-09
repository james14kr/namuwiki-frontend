import type { StringLiteral } from "typescript";

export interface FarmRegisterData {
  farmerEmail : string;
  farmName : string;
  farmAddr : string;
  farmDesc : string;
}

export interface FarmItem{
  farmId : number;
  farmerEmail : string;
  farmName : string;
  farmAddr : string;
  farmDesc : string;
  createDate : string;
}