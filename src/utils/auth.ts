

// JWT 토큰 디코딩
// header.payload.signature 3구분


// 유저정보는 payload
export const decodeToken = (token:string)=>{
  try{
    const payload = token.split(".")[1]; 
    // .으로 나눈 2번째가 payload

    return JSON.parse(atob(payload));
    // atob() : base64 인코딩된 payload 디커딩한 문자열을 객체로 변환

  } catch{
    return null;
    // 디코딩 실패시 null
  }
};


// 현재 로그인 유저 role
export const getUserRole = (): string|null => {
  const token = localStorage.getItem("token");
  if(!token) return null;
  const decoded = decodeToken(token.replace("Bearer ", ""));
  // 앞에 Bearer 제거
  return decoded?.role ?? null;
};




// 관리자면 true, 아니면 false
export const isAdmin = ():boolean =>{
  return getUserRole() === "ADMIN";
};

// 현재 로그인 유저 이메일
export const getUserEmail = (): string | null=>{
  const token = localStorage.getItem("token");
  if(!token) return null;
  const decoded = decodeToken(token.replace("Bearer ", ""));
  return decoded?.sub ?? null;
};

