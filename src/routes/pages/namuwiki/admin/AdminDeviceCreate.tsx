import { Button, Input } from '@/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePostDevice } from '@/queries/farm/usePostDevice';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Cpu } from 'lucide-react';
import React, { useState } from 'react'

const AdminDeviceCreate = () => {

  const [deviceId, setDeviceId] = useState("");
  const {mutate} = usePostDevice();

  // 자동 생성 로직
  const handleAutoGenerate = () => {
    // NAMU-2026-랜덤4자리 형식으로 자동 생성
    const random = Math.floor(1000 + Math.random() * 9000);
    setDeviceId(`NAMU-2026-${random}`);
  };

  const handleSubmit = () => {
    if(!deviceId) return;
    mutate(deviceId, {
      onSuccess : () => {
        alert("기기가 등록되었습니다.")
        setDeviceId("");
      }
    })
  }

  // 관리자가 기기 ID를 직접 입력하거나 자동 생성하여 등록하는 페이지
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      <Card>
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Cpu className="h-5 w-5" />
            기기 ID 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-1">
            <Label>기기 식별번호 *</Label>
            <div className="flex gap-2">
              <Input
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="예: NAMU-2026-001"
              />
              {/* 자동 생성 버튼 */}
              <Button variant="outline" onClick={handleAutoGenerate}>
                자동생성
              </Button>
            </div>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={handleSubmit}
          >
            기기 등록하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );

}

export default AdminDeviceCreate