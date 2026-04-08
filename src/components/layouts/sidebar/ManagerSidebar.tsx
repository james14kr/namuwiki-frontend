import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ManagerSidebar = () => {

  const nav = useNavigate();

  const nickname = localStorage.getItem("nickname");

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/namu/login");
  }

  return (
    <div className="sticky top-0 flex h-svh w-80 flex-col gap-3 overflow-y-auto border-l bg-sidebar px-3 py-4">
        <Button className="w-30" onClick={() => handleLogout()}>로그아웃</Button>

        <div className="font-bold w-40 mt-1">내 정보</div>
      {/* 프로필 카드 */}
      <div className="rounded-md bg-primary-foreground p-4 shadow-md flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{nickname}</div>
          <Badge variant="danger">관리자</Badge>
        </div>
      </div>
    </div>
  )
}

export default ManagerSidebar