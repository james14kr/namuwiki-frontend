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

  // 메세지 목록 하단으로 스크롤
  const scrollToBottom = ()=>{
    messagesEndRef.current?.scrollIntoView({behavior : "smooth"});
  };

  // 기존 메세지 불러오기
  useEffect(()=>{
    if(!roomId || !currentUserEmail) return;
    dmApi.getMessages(Number(roomId), currentUserEmail).then((data)=>{
      setMessages(data ?? []);
    });
  },[roomId, currentUserEmail]);

  // WebSocket 연결
  useEffect(()=>{
    if(!roomId || !currentUserEmail) return;

    const client = new Client({
      webSocketFactory : () => new SockJS("http://localhost:8080/api/ws"),
      onConnect : ()=>{
        // 채팅방 구독
        client.subscribe(`/sub/dm/room/${roomId}`,(message)=>{
          const newMessage : ChatMessageDTO = JSON.parse(message.body);
          setMessages((prev)=>[...prev, newMessage]);
        });
      },
    });
    client.activate();
    stompClient.current = client;

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      client.deactivate();
    };
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






  return (
    <>
      {/* 헤더 */}
      <div>
        <Button
          onClick={()=>nav("/namu/dm")}
        >
          <ArrowLeft />
        </Button>
        <span>채팅방</span>
        
      </div>

      {/* 메세지 목록 */}
      <div>
        {messages.map((msg) => {
          const isMine = msg.senderEmail === currentUserEmail;
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row" }}>
              {!isMine && (
                <Avatar>
                  <AvatarFallback>
                    {msg.senderNickname?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                {!isMine && <span>{msg.senderNickname}</span>}
                <div>{msg.content}</div>
                <span>{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>


      {/* 메세지 입력 */}
      <div>
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













    </>
  );
};

export default DmChat;