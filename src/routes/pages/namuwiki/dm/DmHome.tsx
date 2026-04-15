import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEmail } from "@/utils/auth";
import { dmApi } from "@/api/dm.api";
import type { ChatRoomDTO } from "@/types/dmType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import React from 'react';

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 9);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};



const DmHome = () => {
  const nav = useNavigate();
  const currentUserEmail = getUserEmail();
  const [rooms, setRooms] = useState<ChatRoomDTO[]>([]);

  useEffect(()=>{
    if(!currentUserEmail) return;
    dmApi.getMyRooms(currentUserEmail).then((data)=>setRooms(data));
  }, [currentUserEmail]);


  // 상대방 정보 가져오는 기능(sender <-> receiver)
  const getOpponent = (room:ChatRoomDTO)=>{
    if(room.senderEmail === (currentUserEmail ?? "")){
      return {
        email: room.receiverEmail,
        nickname : room.receiverNickname,
        profileImg : room.receiverProfileImg,
      };
    };
    return {
      email: room.senderEmail,
      nickname: room.senderNickname,
      profileImg: room.senderProfileImg,
    };







  };







  return (
    <div>
      <h1>
        <MessageCircle /> DM목록
      </h1>
      
      {rooms.length === 0 ? (
        <p>
          대화 내역이 없습니다.
        </p>

      ) : (
        rooms.map((room)=>{
          const opponent = getOpponent(room);
          return (
            <Card
              key={room.id}
              onClick={()=>nav(`/namu/dm/${room.id}`)}
            >
              <CardContent>
                <Avatar>
                  {opponent.profileImg ? (
                    <AvatarImage src={opponent.profileImg}/>
                  ) : (
                    <AvatarFallback>
                      {opponent.nickname?.[0]??"U"}
                    </AvatarFallback>

                  )}
                </Avatar>
                <div>
                  <div>
                    <span>{opponent.nickname}</span>
                    <span>{formatDate(room.createdAt)}</span>
                  </div>
                  <p>{room.lastMessage ?? "대화를 시작해보세요"}</p>
                </div>
                {room.unreadCount > 0 && (
                  <span>
                    {room.unreadCount}
                  </span>
                )}
                
              </CardContent>
            </Card>
          );
        })
      )}
      
    </div>
  );
};

export default DmHome;