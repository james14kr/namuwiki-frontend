import { dmApi } from '@/api/dm.api';
import { getUserEmail } from '@/utils/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";

interface DmButtonProps{
  targetEmail : string;
  children : React.ReactNode; // 프로필 이미지 닉네임 감싸는용도
}

const DmButton = ({ targetEmail, children }: DmButtonProps) => {
  const nav = useNavigate();
  const currentUserEmail = getUserEmail();
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (currentUserEmail === targetEmail) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setTooltipPos({ x: e.clientX + 12, y: e.clientY + 12 });
  };

  const onMouseLeave = () => {
    // 바로 숨기지 않고 약간 딜레이 줘서 툴팁으로 이동할 시간 확보
    hideTimer.current = setTimeout(() => {
      setTooltipPos(null);
    }, 300);
  };

  const onTooltipMouseEnter = () => {
    // 툴팁에 마우스 올리면 숨김 취소
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const onTooltipMouseLeave = () => {
    setTooltipPos(null);
  };

  const onProfileClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserEmail || currentUserEmail === targetEmail) return;
    const room = await dmApi.getOrCreateRoom({
      senderEmail: currentUserEmail,
      receiverEmail: targetEmail,
    });
    nav(`/namu/dm/${room.id}`);
  };

  return (
    <>
      <div
        className="inline-flex items-center cursor-pointer"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onProfileClick}
      >
        {children}
      </div>

      {tooltipPos && (
      <div
        className="fixed z-[9999] bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"  // ← pointer-events-none으로 툴팁은 클릭 안되게
        style={{ left: tooltipPos.x, top: tooltipPos.y }}
      >
        DM 보내기
      </div>
    )}
    </>
  );
};

export default DmButton;