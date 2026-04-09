import { Button, Input, Postcode, Textarea } from '@/components';
import type { PostInfo } from '@/components/postcode/Postcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastMutation } from '@/lib/toast';
import { usePostFarmRegister } from '@/queries/farm/FarmRegister';
import type { FarmRegisterData } from '@/types/farmType';
import { decodeToken } from '@/utils/auth';
import { Label } from '@radix-ui/react-dropdown-menu';
import { ArrowLeft, Sprout } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FarmRegister = () => {

  const nav = useNavigate();
  const farmMutation = usePostFarmRegister();
  
  const token = localStorage.getItem("token")
  const decoded = token ? decodeToken(token.replace("Bearer", "")) : null;
  const farmerEmail = decoded.sub ?? "";

  const [farm, setFarm] = useState<FarmRegisterData>({
    farmerEmail,
    farmName : "",
    farmAddr : "",
    farmDesc : "",
  })

  const handleChange = (
    e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFarm({...farm, [e.target.name] : e.target.value})
  }

  const handleAddressSelect = (addr : PostInfo) => {
    setFarm({...farm, farmAddr : addr.fullAddress});
  }

  const handleSubmit = () => {
    toastMutation(
      farmMutation.mutateAsync,
      farm,
      "농장 등록 중...",
      "농장이 등록되었습니다!",
      "농장 등록에 실패하였습니다.",
      { onSuccess: () => nav(-1) }
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => nav(-1)}
        className="gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </Button>

      <Card>
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Sprout className="h-5 w-5" />
            농장 등록
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-1">
            <Label>농장 이름 *</Label>
            <Input
              name="farmName"
              value={farm.farmName}
              onChange={handleChange}
              placeholder="농장 이름을 입력하세요"
            />
          </div>

          <div className="space-y-1">
            <Label>농장 주소</Label>
            <div className="flex gap-2">
              <Input
                value={farm.farmAddr}
                readOnly
                placeholder="주소 검색을 클릭하세요"
              />
              <Postcode onAddressSelect={handleAddressSelect} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>농장 소개</Label>
            <Textarea
              name="farmDesc"
              value={farm.farmDesc}
              onChange={handleChange}
              placeholder="농장을 간단히 소개해주세요"
              rows={3}
            />
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={handleSubmit}
            disabled={farmMutation.isPending}
          >
            농장 등록하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


export default FarmRegister