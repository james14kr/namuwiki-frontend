import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostCrop } from "@/queries/crop/usePostCrop";
import { Button, Input, Textarea } from "@/components";
import { ArrowLeft, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";

const CropRegister = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { mutate } = usePostCrop();

  const [form, setForm] = useState({
    cropName: "",
    cropDesc: "",
    cropPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { farmId: Number(farmId), ...form, cropPrice: Number(form.cropPrice) },
      { onSuccess: () => navigate("/namu/my-farm-list") }
    );
  };

  return (
  <div className="mx-auto max-w-2xl space-y-6 pb-10">

    {/* 뒤로가기 버튼 */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="gap-1 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      뒤로가기
    </Button>

    <Card>
      {/* 헤더 - 농장 등록과 동일한 스타일 */}
      <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Sprout className="h-5 w-5" />
          농작물 등록
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">

        {/* 농작물 이름 */}
        <div className="space-y-1">
          <Label>농작물 이름 *</Label>
          <Input
            name="cropName"
            value={form.cropName}
            onChange={handleChange}
            placeholder="농작물 이름을 입력하세요"
          />
        </div>

        {/* 농작물 설명 */}
        <div className="space-y-1">
          <Label>농작물 설명</Label>
          <Textarea
            name="cropDesc"
            value={form.cropDesc}
            onChange={handleChange}
            placeholder="농작물을 간단히 소개해주세요"
            rows={3}
          />
        </div>

        {/* 가격 */}
        <div className="space-y-1">
          <Label>가격 *</Label>
          <Input
            name="cropPrice"
            type="number"
            value={form.cropPrice}
            onChange={handleChange}
            placeholder="가격을 입력하세요"
          />
        </div>

        {/* 등록 버튼 - 농장 등록과 동일한 스타일 */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
          onClick={handleSubmit}
        >
          농작물 등록하기
        </Button>

      </CardContent>
    </Card>
  </div>
);

};

export default CropRegister;
