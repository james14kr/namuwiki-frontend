export interface joinData {
  memEmail: string;
  memPw: string;
  memNickname: string;
  memName: string;
  memTel: string;
  memAdd: string;
  addDetail: string;
  memRole: string;
  farmerName: string;
  authCode: string;
}

export interface loginData {
  memEmail: string;
  memPw: string;
}

export interface memEmail {
  memEmail: string;
}

export interface authCode {
  authCode : string;
  farmerName: string;
  farmerTel: string;
}