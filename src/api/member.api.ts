// member 관련 api 모음집!

import { api } from "@/utils";

/**
 *
 * @param joinData 회원가입 API 실행 함수
 * @returns
 */
export const postJoinData = async (joinData: object) => {
  try {
    const response = await api.post("/members", joinData);
    return response;
  } catch (e) {
    console.log("회원가입 api 오류", e);
    throw e;
  }
};

/**
 * 이메일 중복 조회 api
 *
 * @returns
 */
export const postEmail = async (memEmail: string) => {
  try {
    const response = await api.post("/members/memEmail", { memEmail });
    return response.data;
  } catch (e) {
    console.log("이메일 중복 조회 api 오류", e);
    throw e;
  }
};

/**
 * 닉네임 중복 조회 api
 * @param memNickname 닉네임
 * @returns
 */
export const postNickname = async (memNickname: string) => {
  try {
    const response = await api.post("/members/memNickname", { memNickname });
    return response.data;
  } catch (e) {
    console.log("닉네임 중복 조회 api 오류", e);
    throw e;
  }
};

/**
 * 로그인 - spring security에게 전달
 * @returns
 */
export const postLogin = async (loginData: object) => {
  try {
    const response = await api.post("/members/login", loginData);
    return response;
  } catch (e) {
    console.log("로그인 api 오류", e);
    throw e;
  }
};


