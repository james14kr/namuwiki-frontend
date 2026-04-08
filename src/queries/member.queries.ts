import { useMutation } from "@tanstack/react-query";
import {
  postAuthCode,
  postCheckFarmerAuth,
  postEmail,
  postJoinData,
  postLogin,
  postNickname,
} from "@/api/member.api";
import type { authCode, joinData, loginData } from "@/types/memberType";

// export const useGetPosts = () => {
//   return useQuery({
//     queryKey: queryKeys.post.all,
//     queryFn: postApi.getAll,
//   });
// };

// 회원가입
export const usePostJoinData = () => {
  return useMutation({
    mutationFn: (param: joinData) => postJoinData(param),
  });
};

// 이메일 중복 조회, 이메일 찾기 조회
export const usePostEmail = () => {
  return useMutation({
    // 이메일을 전달
    mutationFn: (param: string) => postEmail(param),
  });
};

// 닉네임 중복 조회
export const usePostNickname = () => {
  return useMutation({
    // 닉네임 전달
    mutationFn: (param: string) => postNickname(param),
  });
};

// 로그인 - spring security에게 전달
export const usePostLogin = () => {
  return useMutation({
    mutationFn: (param: loginData) => postLogin(param),
  });
};

// 인증번호 생성
export const usePostAuthCode = () => {
  return useMutation({
    mutationFn: (param: object) => postAuthCode(param),
  });
};

// 인증번호 유효성검사
export const usePostCheckFarmerAuth = () => {
  return useMutation({
    mutationFn: (param: object) => postCheckFarmerAuth(param),
  });
};
