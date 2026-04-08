import React from 'react'
import { Badge } from '@/components/ui/badge'

const FarmSidebar = () => {
  const nickname = localStorage.getItem("nickname");

  return (
    <div className="sticky top-0 flex h-svh w-80 flex-col gap-3 overflow-y-auto border-l bg-sidebar px-3 py-4">
      <div className="font-bold">내 농장 현황</div>
      <div className="rounded-md bg-primary-foreground p-4 shadow-md flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">{nickname}</div>
          <Badge variant="success">농장주</Badge>
        </div>
      </div>
      <div>
        <div className="flex gap-3">
          <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
            <div className="mb-2">온도</div>
            <div className="text-xl font-bold text-primary">23°C</div>
          </div>
          <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
            <div className="mb-2">습도</div>
            <div className="text-xl font-bold text-foreground">68%</div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex gap-3">
          <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
            <div className="mb-2">급수</div>
            <div className="text-xl font-bold text-primary">완료</div>
          </div>
          <div className="h-20 flex-1 rounded-md bg-primary-foreground p-3 shadow-md">
            <div className="mb-2">이상</div>
            <div className="text-xl font-bold text-danger">1건</div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-bold">알림</span>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-xl bg-danger"></div>
            <div>
              <div className="text-sm">온도 이상 28°C</div>
              <div className="text-sm opacity-50">초과 5분 전</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="mt-1 h-2 w-2 rounded-xl bg-success"></div>
            <div>
              <div className="text-sm">자동 급수 완료</div>
              <div className="text-sm opacity-50">오전 9:00</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-xl bg-blue-500"></div>
            <div>
              <div className="text-sm">나주 딸기 새 게시글</div>
              <div className="text-sm opacity-50">15분 전</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="font-bold">인기 농장</span>
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
  )
}

export default FarmSidebar