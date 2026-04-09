import { useEffect, useRef } from "react";

export default function UserBanner({ speed = 27 }) {
  // localStorage에서 닉네임 가져오기
  const nickname = localStorage.getItem("nickname") ?? "방문자";

  const messages = [
    `👋 ${nickname}님 환영합니다`,
    "Namuwiki SNS 커뮤니티에 오신걸 환영합니다"
  ];

  const content = messages.map((m, i) => (
    <span key={i} style={{ paddingRight: 60 }}>· {m}</span>
  ));

  return (
    <div style={{ overflow: "hidden", background: "rgba(255, 255, 255, 0.6)", padding: "10px 0", }}>
      <div style={{
        display: "flex",
        whiteSpace: "nowrap",
        animation: `marquee ${speed}s linear infinite`,
      }}>
        <>{content}</>
        <>{content}</>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
