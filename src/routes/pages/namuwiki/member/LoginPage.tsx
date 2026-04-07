import React, { useState } from "react";
import LoginForm from "./LoginForm";
import JoinForm from "./JoinForm";

const LoginPage = () => {
  const [inputRadio, setInputRadio] = useState<"login" | "join">("login");
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const isSuccessHandle = (isSueccess: boolean) => {
    if (isSueccess) {
      handleTabChange("login");
    }
  };

  const handleTabChange = (tab: "login" | "join") => {
    if (tab === inputRadio) return;
    setDirection(tab === "join" ? "left" : "right");
    setAnimKey((prev) => prev + 1);
    setInputRadio(tab);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        /* ── 슬라이드 전환 애니메이션 ── */
        @keyframes slideInFromLeft {
          0%   { opacity: 0; transform: translateX(-64px) scale(0.96); }
          55%  { opacity: 1; transform: translateX(6px)  scale(1.01); }
          100% { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes slideInFromRight {
          0%   { opacity: 0; transform: translateX(64px)  scale(0.96); }
          55%  { opacity: 1; transform: translateX(-6px)  scale(1.01); }
          100% { opacity: 1; transform: translateX(0)     scale(1); }
        }
        .slide-in-left  { animation: slideInFromLeft  0.42s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
        .slide-in-right { animation: slideInFromRight 0.42s cubic-bezier(0.22, 0.61, 0.36, 1) both; }

        /* ── 페이지 첫 진입 ── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.55s ease-out both; }

        /* ── NamuWiki 타이틀 둥실둥실 ── */
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-6px); }
        }
        .title-float { animation: titleFloat 3.6s ease-in-out infinite; }

        /* ── 잎사귀 흔들기 ── */
        @keyframes leafL {
          0%, 100% { transform: rotate(-10deg) translateY(0); }
          50%       { transform: rotate(6deg)  translateY(-2px); }
        }
        @keyframes leafR {
          0%, 100% { transform: rotate(10deg)  translateY(0); }
          50%       { transform: rotate(-6deg) translateY(-2px); }
        }
        .leaf-l { animation: leafL 2.6s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }
        .leaf-r { animation: leafR 3.1s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }

        /* ── 배경 블롭 유영 ── */
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0)     scale(1); }
          33%       { transform: translate(20px, -16px) scale(1.04); }
          66%       { transform: translate(-14px, 12px) scale(0.97); }
        }
        .blob  { animation: blobDrift 10s ease-in-out infinite; }
        .blob2 { animation: blobDrift 13s ease-in-out infinite reverse; }
        .blob3 { animation: blobDrift  8s ease-in-out infinite 2s; }

        /* ── 타이틀 shimmer ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .title-shimmer {
          background: linear-gradient(
            90deg,
            #14532d 0%,
            #166534 30%,
            #16a34a 50%,
            #166534 70%,
            #14532d 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4.5s linear infinite;
        }

        /* ── 탭 버튼 눌림 효과 ── */
        .tab-btn:active { transform: scale(0.93); }

        /* ── 카드 상단 스트라이프 펄스 ── */
        @keyframes stripePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.75; }
        }
        .stripe-pulse { animation: stripePulse 3s ease-in-out infinite; }

        /* ── 도트 인디케이터 확장 ── */
        .dot-expand { transition: width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s; }
      `}</style>

      {/* ── 배경 장식 블롭들 ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="blob  absolute -top-28 -left-28  w-80 h-80 bg-green-100  rounded-full opacity-50 blur-3xl" />
        <div className="blob2 absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-50 rounded-full opacity-60 blur-3xl" />
        <div className="blob3 absolute top-1/3 -right-16  w-56 h-56 bg-green-200  rounded-full opacity-25 blur-2xl" />
        <div className="blob  absolute bottom-1/4 left-10   w-32 h-32 bg-teal-100   rounded-full opacity-30 blur-xl" />
      </div>

      {/* ── 메인 컨테이너 ── */}
      <div className="relative w-full max-w-md fade-in-up">

        {/* ════════════════════════════════
            헤더: [로그인] · NamuWiki · [회원가입]
        ════════════════════════════════ */}
        <div className="flex items-center justify-center gap-6 mb-3">

          {/* 로그인 탭 버튼 */}
          <button
            onClick={() => handleTabChange("login")}
            className={`tab-btn relative py-2 px-5 text-sm font-bold tracking-wide rounded-full transition-all duration-300 focus:outline-none ${
              inputRadio === "login"
                ? "text-white bg-green-600 shadow-lg shadow-green-200/70"
                : "text-green-600 bg-transparent hover:bg-green-50 hover:text-green-700"
            }`}
          >
            로그인
            {inputRadio === "login" && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
            )}
          </button>

          {/* NamuWiki 타이틀 */}
          <div className="flex flex-col items-center select-none px-1">
            <div className="flex items-end gap-0.5 mb-1">
              <span className="leaf-l text-lg">🌿</span>
              <span className="leaf-r text-base">🌱</span>
            </div>
            <h1 className="title-float title-shimmer text-[2.15rem] font-black tracking-tight leading-none">
              NamuWiki
            </h1>
            <p className="mt-1.5 text-[9px] font-semibold tracking-[0.22em] text-green-400 uppercase">
              Plant Community
            </p>
          </div>

          {/* 회원가입 탭 버튼 */}
          <button
            onClick={() => handleTabChange("join")}
            className={`tab-btn relative py-2 px-5 text-sm font-bold tracking-wide rounded-full transition-all duration-300 focus:outline-none ${
              inputRadio === "join"
                ? "text-white bg-green-600 shadow-lg shadow-green-200/70"
                : "text-green-600 bg-transparent hover:bg-green-50 hover:text-green-700"
            }`}
          >
            회원가입
            {inputRadio === "join" && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
            )}
          </button>
        </div>

        {/* 탭 인디케이터 바 */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <span
            className={`dot-expand block h-1.5 rounded-full ${
              inputRadio === "login" ? "w-8 bg-green-500" : "w-2 bg-green-200"
            }`}
          />
          <span className="block w-1 h-1 rounded-full bg-green-300" />
          <span
            className={`dot-expand block h-1.5 rounded-full ${
              inputRadio === "join" ? "w-8 bg-green-500" : "w-2 bg-green-200"
            }`}
          />
        </div>

        {/* ════════════════════════════════
            폼 카드 (key → remount → animation)
        ════════════════════════════════ */}
        <div
          key={animKey}
          className={`${
            direction === "left" ? "slide-in-left" : "slide-in-right"
          } bg-white rounded-3xl shadow-2xl shadow-green-100/70 border border-green-100 overflow-hidden`}
        >
          {/* 카드 상단 컬러 스트라이프 */}
          <div className="stripe-pulse h-1.5 w-full bg-gradient-to-r from-green-300 via-green-500 to-emerald-400" />

          <div className="px-8 pt-6 pb-8">
            {/* 폼 구분선 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-200" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-green-500 uppercase">
                {inputRadio === "login" ? "Sign In" : "Create Account"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-200" />
            </div>

            {inputRadio === "login" ? (
              <LoginForm />
            ) : (
              <JoinForm successJoin={isSuccessHandle} />
            )}
          </div>
        </div>

        {/* ── 하단 도트 ── */}
        <div className="flex justify-center mt-5 gap-2">
          {(["login", "mid", "join"] as const).map((dot) => {
            const active =
              (dot === "login" && inputRadio === "login") ||
              (dot === "join" && inputRadio === "join");
            return (
              <span
                key={dot}
                className={`dot-expand block rounded-full ${
                  dot === "mid"
                    ? "w-1.5 h-1.5 bg-green-200"
                    : active
                    ? "w-6 h-2 bg-green-500"
                    : "w-2 h-2 bg-green-200"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
