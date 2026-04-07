import React from "react";

/**
 * PlantCommunityLogo
 * 
 * Usage:
 *   import PlantCommunityLogo from "./PlantCommunityLogo";
 *   <PlantCommunityLogo width={200} height={200} />
 *
 * React.ElementType 호환 — props로 width, height, className 조절 가능
 */

interface PlantCommunityLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const PlantCommunityLogo: React.FC<PlantCommunityLogoProps> = ({
  width = 200,
  height = 200,
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="Plant Community Logo"
    >
      <defs>
        {/* 원형 배경 그라디언트 */}
        <radialGradient id="bgGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#E8F5E9" />
          <stop offset="100%" stopColor="#C8E6C9" />
        </radialGradient>

        {/* 잎 그라디언트 - 왼쪽 */}
        <linearGradient id="leafLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>

        {/* 잎 그라디언트 - 오른쪽 */}
        <linearGradient id="leafRight" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>

        {/* 잎 그라디언트 - 중앙 위 */}
        <linearGradient id="leafCenter" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#A5D6A7" />
          <stop offset="100%" stopColor="#43A047" />
        </linearGradient>

        {/* 줄기 그라디언트 */}
        <linearGradient id="stemGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>

        {/* 사람 아이콘용 */}
        <linearGradient id="personGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#1B5E20" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>

      {/* 원형 배경 */}
      <circle cx="100" cy="100" r="95" fill="url(#bgGrad)" />
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="none"
        stroke="#43A047"
        strokeWidth="3"
      />

      {/* ===== 식물 (새싹) ===== */}
      {/* 줄기 */}
      <path
        d="M100 130 Q100 105 100 85"
        stroke="url(#stemGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 왼쪽 잎 */}
      <path
        d="M100 105 Q75 90 65 65 Q90 75 100 105Z"
        fill="url(#leafLeft)"
      />
      {/* 왼쪽 잎맥 */}
      <path
        d="M100 105 Q82 88 72 72"
        stroke="#E8F5E9"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* 오른쪽 잎 */}
      <path
        d="M100 105 Q125 90 135 65 Q110 75 100 105Z"
        fill="url(#leafRight)"
      />
      {/* 오른쪽 잎맥 */}
      <path
        d="M100 105 Q118 88 128 72"
        stroke="#E8F5E9"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* 중앙 위 잎 */}
      <path
        d="M100 85 Q88 55 100 35 Q112 55 100 85Z"
        fill="url(#leafCenter)"
      />
      {/* 중앙 잎맥 */}
      <path
        d="M100 82 L100 42"
        stroke="#E8F5E9"
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* ===== 커뮤니티 (3명의 사람) ===== */}
      {/* 왼쪽 사람 */}
      <circle cx="72" cy="138" r="7" fill="url(#personGrad)" />
      <path
        d="M72 145 Q72 158 72 162"
        stroke="#2E7D32"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* 중앙 사람 */}
      <circle cx="100" cy="135" r="8" fill="url(#personGrad)" />
      <path
        d="M100 143 Q100 158 100 163"
        stroke="#2E7D32"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 오른쪽 사람 */}
      <circle cx="128" cy="138" r="7" fill="url(#personGrad)" />
      <path
        d="M128 145 Q128 158 128 162"
        stroke="#2E7D32"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* 사람들 연결 아치 (커뮤니티 유대) */}
      <path
        d="M62 162 Q100 150 138 162"
        stroke="#388E3C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
};

export default PlantCommunityLogo;
