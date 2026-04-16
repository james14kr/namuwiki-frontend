import { Button, Input } from '@/components';
import React from 'react'
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserEmail } from "@/utils/auth";
import { dmApi } from "@/api/dm.api";
import type { ChatMessageDTO } from "@/types/dmType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { string } from 'zod';


const formatTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 9);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};


const DmChat = () => {

  const nav = useNavigate();
  const {roomId} = useParams<{roomId:string}>();
  const currentUserEmail = getUserEmail();
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [opponentNickname, setOpponentNickname] = useState<string>("");

  // 메세지 목록 하단으로 스크롤
  const scrollToBottom = ()=>{
    messagesEndRef.current?.scrollIntoView({behavior : "smooth"});
  };

  // 누구와의 채팅방인지
  useEffect(() => {
  if (!roomId || !currentUserEmail) return;
  dmApi.getMyRooms(currentUserEmail).then((rooms) => {
    const room = rooms.find((r) => r.id === Number(roomId));
    if (!room) return;
    // 내가 sender면 상대는 receiver, 반대도 마찬가지
    const nickname = room.senderEmail === currentUserEmail
      ? room.receiverNickname
      : room.senderNickname;
    setOpponentNickname(nickname);
  });
}, [roomId, currentUserEmail]);

  // 기존 메세지 불러오기
  useEffect(()=>{
    if(!roomId || !currentUserEmail) return;
    dmApi.getMessages(Number(roomId), currentUserEmail).then((data)=>{
      setMessages(data ?? []);
    });
  },[roomId, currentUserEmail]);




  // 메세지 보낸때마다 스크롤 내리기
  useEffect(()=>{
    scrollToBottom();
  },[messages]);

  // 메세지 전송
  const sendMessage = ()=>{
    if (!inputValue.trim() || !stompClient.current || !currentUserEmail) return;
    stompClient.current.publish({
      destination: "/pub/dm/message",
      body : JSON.stringify({
        roomId : Number(roomId),
        senderEmail : currentUserEmail,
        content : inputValue,
        createdAt : new Date().toISOString(),
      }),
    });
    setInputValue("");
  };


  // 엔터키로 전송
  const onKeyDown = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key === "Enter"&& !e.shiftKey){
      e.preventDefault();
      sendMessage();
    }
  };

// WebSocket 연결
  useEffect(() => {
  if (!roomId || !currentUserEmail) return;

  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/api/ws"),
    onConnect: () => {
      console.log("WebSocket 연결 성공!");
      // 채팅방 구독
      client.subscribe(`/sub/dm/room/${roomId}`, (message) => {
        console.log("메시지 수신:", message.body);
        const newMessage: ChatMessageDTO = JSON.parse(message.body);
        console.log("현재 messages 길이:", messages.length);
        setMessages((prev) => {
          console.log("prev 길이:", prev.length);
          return [...prev, newMessage];
        });
      });
    },
    onDisconnect: () => {
      console.log("WebSocket 연결 해제!");
    },
    onStompError: (frame) => {
      console.log("STOMP 오류:", frame);
    },
  });

  client.activate();
  stompClient.current = client;
// 컴포넌트 언마운트 시 연결 해제
  return () => {
    client.deactivate();
  };
}, [roomId]);



  return (
    <>
      <div>
        <Button
          onClick={()=>nav("/namu/dm")}
        >
          <ArrowLeft/> 채팅방으로 이동
        </Button>

      </div>
      <div className="flex flex-col max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center py-3 mb-3 border-b">
          <span
            className="text-2xl font-bold"
          >{opponentNickname} 님과의 채팅방</span>
          
        </div>
  
        {/* 메세지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 bg-primary/5 ">
          {messages.map((msg, index) => {
            const isMine = msg.senderEmail === currentUserEmail;
            
            const prevMsg = messages[index - 1];
            const showTime = !prevMsg || 
              formatTime(prevMsg.createdAt) !== formatTime(msg.createdAt);
  
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMine && (
                  <Avatar className="h-11 w-11">
                    {msg.senderProfileImg ? (
                      <AvatarImage src={msg.senderProfileImg} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                        {msg.senderNickname?.[0] ?? "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div className={`flex flex-col max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
                  {showTime && (
                    <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm break-words ${
                    isMine
                      ? "bg-primary/10 border border-primary/30 rounded-br-sm"
                      : "bg-muted rounded-bl-sm border-border"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
  
  
        {/* 메세지 입력 */}
        <div className="flex items-center gap-3 px-4 py-4 mt-3 border-t bg-background">
          <Input 
            
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="메세지를 입력하세요"
  
          />
          <Button
            onClick={sendMessage}
          >
            <Send />
          </Button>
        </div>
  
  
  
  
  
  
  
  
  
  
  
  
  
      </div>
    </>
  );
};

export default DmChat;