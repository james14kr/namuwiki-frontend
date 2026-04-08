import { Button, Input } from "@/components";
import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { IoMdLock } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { usePostLogin } from "@/queries/member.queries";
import { toastMutation } from "@/lib/toast";
import { tokenToString } from "typescript";

const LoginForm = () => {
  const nav = useNavigate();
  const usePostLoginMutate = usePostLogin();

  // input에 입력받은 로그인 데이터 저장할 state 변수
  const [loginData, setLoginData] = useState({
    memEmail: "",
    memPw: "",
  });

  // 비밀번호 보이기 / 숨김 저장할 state 변수
  const [showPw, setShowPw] = useState(false);

  // input에서 입력받은 데이터 저장할 함수
  const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // 로그인실행 함수
  const login = async () => {
    // 로그인 성공 시 응답 헤더에 토큰 실려서 옴
    await toastMutation(
      usePostLoginMutate.mutateAsync,
      loginData,
      "로딩중입니다.",
      (param) => {
        console.log(param);
        // 로그인 검증 성공시
        if (param.status === 200) {
          // 토큰 정보
          console.log(param.headers.authorization);

          // 토큰 LocalStorage에 저장
          localStorage.setItem("token", param.headers.authorization);
          
          //JWT 디코딩으로 role, name, email 꺼내기
          try{
            const token = param.headers.authorization;
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            localStorage.setItem("role", payload.role);
            localStorage.setItem("name", payload.name);
            localStorage.setItem("email", payload.email); 
          }catch(e){
            console.error("JWT 디코딩 실패", e)
          }

          // 로그인 성공 시 메인페이지로 이동
          nav("/");
        }
        return "로그인 성공했습니다.";
      },
      (error) => {
        console.error("에러 콜백:", error);
        return "아이디나 비밀번호 오류입니다.";
      }
    );
  };

  return (
    <div>
      <style>{`
        /* ── 필드 순차 등장 ── */
        @keyframes fieldFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .field-1 { animation: fieldFadeIn 0.35s ease-out 0.05s both; }
        .field-2 { animation: fieldFadeIn 0.35s ease-out 0.15s both; }
        .field-3 { animation: fieldFadeIn 0.35s ease-out 0.25s both; }
        .field-4 { animation: fieldFadeIn 0.35s ease-out 0.35s both; }

        /* ── 로그인 버튼 shine ── */
        @keyframes btnShine {
          0%   { left: -120%; }
          50%  { left: 140%;  }
          100% { left: 140%;  }
        }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          animation: btnShine 3s ease-in-out infinite 1s;
        }

        /* ── input focus 효과 ── */
        .input-wrap input:focus { box-shadow: 0 0 0 3px rgba(74,222,128,0.18); }

        /* ── 비밀번호찾기 hover 밑줄 ── */
        .find-pw { position: relative; }
        .find-pw::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: #15803d;
          transition: width 0.25s ease;
        }
        .find-pw:hover::after { width: 100%; }
      `}</style>

      {/* 이메일 */}
      <div className="field-1 mb-4">
        <label className="mb-1.5 block text-sm font-semibold text-green-900">
          이메일
        </label>
        <div className="input-wrap relative">
          <CiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-green-600" />
          <Input
            className="rounded-xl border-green-300 bg-green-50/40 pl-10 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
            placeholder="이메일을 입력하세요"
            name="memEmail"
            value={loginData.memEmail}
            onChange={(e) => handleLoginData(e)}
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="field-2 mb-7">
        <label className="mb-1.5 block text-sm font-semibold text-green-900">
          비밀번호
        </label>
        <div className="input-wrap relative">
          <IoMdLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-green-600" />
          <Input
            className="rounded-xl border-green-300 bg-green-50/40 pl-10 pr-11 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
            placeholder="비밀번호를 입력하세요"
            name="memPw"
            value={loginData.memPw}
            onChange={(e) => handleLoginData(e)}
            type={showPw ? "text" : "password"}
          />
          <Button
            variant="link"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-green-500 transition-colors duration-150 hover:text-green-800"
            type="button"
            onClick={() => setShowPw(!showPw)}
          >
            {showPw ? (
              <IoMdEye className="text-lg" />
            ) : (
              <IoIosEyeOff className="text-lg" />
            )}
          </Button>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div className="field-3">
        <Button
          className="btn-shine w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200/60 transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-200/80 active:scale-[0.98]"
          onClick={() => login()}
        >
          로그인
        </Button>
      </div>

      {/* 이메일, 비밀번호 찾기 */}
      <div className="field-4 mt-5 flex cursor-pointer items-center justify-center gap-1 text-sm text-green-600 transition-colors duration-150 hover:text-green-800">
        <p className="find-pw" onClick={() => {}}>이메일 찾기</p>
        <FaAngleRight className="text-xs" />
        <p className="find-pw">비밀번호 찾기</p>
        <FaAngleRight className="text-xs" />
      </div>
    </div>
  );
};

export default LoginForm;
