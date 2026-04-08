import { Button } from "@/components/ui/button";
import React from 'react'
import { useNavigate } from "react-router-dom";

const UserSidebar = () => {
  const nav = useNavigate();
  // JWT에서 꺼낸 정보 (LoginForm에서 저장한 값 활용 가능)
  const name = localStorage.getItem("name") ?? "사용자";
  const email = localStorage.getItem("email") ?? "";

  // 로그아웃 실행 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/namu/login");
  };
  

  return (
    <div className="sticky top-0 flex h-svh w-80 flex-col gap-3 overflow-y-auto border-l bg-sidebar px-3 py-4">
      <div className="flex gap-16">
        <div className="font-bold w-40 mt-1">내 정보</div>
        <Button className="w-30" onClick={() => handleLogout()}>로그아웃</Button>
      </div>
      {/* 프로필 카드 */}
      <div className="rounded-md bg-primary-foreground p-4 shadow-md flex flex-col gap-1">
        <div className="text-sm font-bold">{name}</div>
        <div className="text-xs opacity-50">{email}</div>
      </div>

      {/* 팔로우 중인 농장 */}
      <div>
        <span className="font-bold">팔로우 중인 농장</span>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="font-bold text-gray-400">1</div>
            <div>
              <div className="text-sm">나주 딸기 농장</div>
              <div className="text-sm opacity-50">팔로워 1,204명</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold text-gray-400">2</div>
            <div>
              <div className="text-sm">청주 토마토 농장</div>
              <div className="text-sm opacity-50">팔로워 984명</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
