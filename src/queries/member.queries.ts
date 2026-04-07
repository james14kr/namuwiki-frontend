import { useMutation } from "@tanstack/react-query";
import { postEmail, postJoinData, postLogin, postNickname } from "@/api/member.api";
import type { joinData, loginData } from "@/types/memberType";

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
    mutationFn: (param : string) => postEmail(param),
  });
};

// 닉네임 중복 조회
export const usePostNickname = () => {
  return useMutation({
    // 닉네임 전달
    mutationFn: (param : string) => postNickname(param)
  });
};

// 로그인 - spring security에게 전달
export const usePostLogin = () => {
  return useMutation({
    mutationFn: (param: loginData) => postLogin(param),
  });
};

