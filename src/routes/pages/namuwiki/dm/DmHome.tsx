import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEmail } from "@/utils/auth";
import { dmApi } from "@/api/dm.api";
import type { ChatRoomDTO } from "@/types/dmType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import React from 'react';
import DmButton from "@/components/DmButton";

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
    <div className="mx-auto max-w-3xl px-t py-6 space-y-3">
      <h1 className="text-lg font-bold flex items-center gap-1 mb-6">
        <MessageCircle  className="text-primary"/> DM목록
      </h1>
      
      {rooms.length === 0 ? (
        <p  className="text-center text-sm text-muted-foreground py-10">
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
              <CardContent className="py-4 cursor-pointer hover:bg-accent transition-colors">
                <div className="flex items-center gap-3 ">
                  <Avatar className="h-12 w-12 shrink-0">
                    {opponent.profileImg ? (
                      <AvatarImage src={opponent.profileImg}/>
                    ) : (
                      <AvatarFallback  className="font-bold">
                        {opponent.nickname?.[0]??"U"}
                      </AvatarFallback>
  
                    )}
                  </Avatar>
                  <div>
                    <div>
                      <span
                        className="font-bold text-lg"
                      >{opponent.nickname}</span>
                      <span
                        className="text-sm"
                      >{formatDate(room.createdAt)}</span>
                    </div>
                  </div>
                </div>
                  <p
                    className="text-lg mt-4"
                  >{room.lastMessage ?? "대화를 시작해보세요"}</p>
                {room.unreadCount > 0 && (
                  <span className="text-sm ">
                    {room.unreadCount}개의 읽지 않은 메세지가 있습니다.
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