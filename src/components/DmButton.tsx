import { dmApi } from '@/api/dm.api';
import { getUserEmail } from '@/utils/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


interface DmButtonProps{
  targetEmail : string;
  children : React.ReactNode; // 프로필 이미지 닉네임 감싸는용도
}

const DmButton = ({targetEmail, children}:DmButtonProps) => {

  const nav = useNavigate();
  const currentUserEmail = getUserEmail();
  const [tooltipPos, setTooltipPos] = useState<{x:number; y:number} | null>(null);

  const onMouseMove = (e: React.MouseEvent)=>{
    if(currentUserEmail === targetEmail) return;
    setTooltipPos({x:e.clientX + 12, y:e.clientY+12});
  };

  const onMouseLeave = ()=>{
    setTooltipPos(null);
  };

  const onDmClick = async (e:React.MouseEvent)=>{
    e.stopPropagation();
    if(!currentUserEmail || currentUserEmail === targetEmail){
      return;
    }
    const room = await dmApi.getOrCreateRoom({
      senderEmail : currentUserEmail,
      receiverEmail : targetEmail,
    });
    nav(`/namu/dm/${room.id}`);
  };




  return (
    <>
      <div 
        className="bg-red-500 w-20"
        onClick={(e)=>e.stopPropagation()}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}

      >
        
        {tooltipPos && (
        <div
          
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          onClick={onDmClick}
        >
          DM 보내기
        </div>
      )}
      </div>
    </>
  );
};

export default DmButton;