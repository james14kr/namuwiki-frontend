import { Button } from "@/components/ui/button";
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from "react-router-dom";
import { decodeToken } from "@/utils/auth";
import { useGetFollowList } from "@/queries/follow.queries";
import type { FollowItem } from "@/types/followType";


const UserSidebar = () => {
  const nav = useNavigate();
  // JWT에서 꺼낸 정보 (LoginForm에서 저장한 값 활용 가능)
  const nickname = localStorage.getItem("nickname");

  // 로그아웃 실행 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/namu/login");
  };

  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token.replace("Bearer ", "")) : null;
  const followerEmail = decoded?.sub ?? "";

  const {data : followList} = useGetFollowList(followerEmail);

  const farmerFollowList = (followList ?? []).filter((item:FollowItem) => item.farmerRole === "FARMER");
  const userFollowList = (followList ?? []).filter((item:FollowItem) => item.farmerRole === "USER")

  return (
    <div className="sticky top-0 flex h-svh w-80 flex-col gap-3 overflow-y-auto border-l bg-sidebar px-3 py-4">
        <Button className="w-30" onClick={() => handleLogout()}>로그아웃</Button>

        <div className="font-bold w-40 mt-1">내 정보</div>
      {/* 프로필 카드 */}
      <div className="rounded-md bg-primary-foreground p-4 shadow-md flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{nickname}</div>
          <Badge variant="secondary">일반회원</Badge>
        </div>
      </div>

      {/* 팔로우 중인 농장 */}
      <div className="rounded-md bg-primary-foreground p-4 shadow-md flex flex-col gap-1">
        <span className="font-bold">팔로우 중인 농장</span>
        <div className="mt-4 flex flex-col gap-4">
          {farmerFollowList.length > 0 ? farmerFollowList.map((item: FollowItem) => (
            <div key={item.farmerEmail}className="text-sm"> 
              {item.farmerNickname}님 농장
            </div>
          )) : <div className="text-xs text-muted-foreground">팔로우 중인 농장이 없습니다.</div> 
        }
        </div>
      </div>

      <div className="rounded-md bg-primary-foreground p-4 shadow-md flex flex-col gap-1">
        <span className="font-bold">팔로우 중인 유저</span>
        <div className="mt-4 flex flex-col gap-4">
          {userFollowList.length > 0 ? userFollowList.map((item: FollowItem) => (
            <div key={item.farmerEmail}className="text-sm"> 
              {item.farmerNickname}님
            </div>
          )) : <div className="text-xs text-muted-foreground">팔로우 중인 유저가 없습니다.</div> 
        }
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
