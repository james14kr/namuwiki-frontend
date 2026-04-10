import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, Cpu } from "lucide-react";
import { usePostDeviceRegister } from "@/queries/device/usePostDeviceRegister";
import { useGetMyCropList } from "@/queries/crop/useGetMyCropList";
import { decodeToken } from "@/utils/auth";
import type { CropItem } from "@/types/cropType";

const DeviceRegister = () => {
  const navigate = useNavigate();
  const { mutate } = usePostDeviceRegister();

  // 로그인한 농장주 이메일 추출
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token.replace("Bearer", "")) : null;
  const farmerEmail = decoded?.sub ?? "";

  const [form, setForm] = useState({
    deviceId: "",
    cropId: 0,
  });

  // 농장주의 모든 농작물 목록 조회 (농장 ID 없이 이메일 기반으로 조회 필요)
  const { data: crops } = useGetMyCropList(farmerEmail);

  const handleSubmit = () => {
    if (!form.deviceId || !form.cropId) {
      alert("기기 ID와 농작물을 모두 선택해주세요.");
      return;
    }
    mutate(
      { ...form, farmerEmail },
      { onSuccess: () => navigate("/namu/my-farm-list") }
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
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
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Cpu className="h-5 w-5" />
            기기 등록
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">

          {/* 기기 ID 입력 */}
          <div className="space-y-1">
            <Label>기기 식별번호 *</Label>
            <Input
              value={form.deviceId}
              onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
              placeholder="관리자에게 받은 기기 ID를 입력하세요"
            />
          </div>

          {/* 연결할 농작물 선택 */}
          <div className="space-y-1">
            <Label>연결할 농작물 *</Label>
            <select
              onChange={(e) => setForm({ ...form, cropId: Number(e.target.value) })}
              className="w-full border rounded p-2"
            >
              <option value="">농작물 선택</option>
              {(crops ?? []).map((crop: CropItem) => (
                <option key={crop.cropId} value={crop.cropId}>
                  {crop.cropName}
                </option>
              ))}
            </select>
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
};

export default DeviceRegister;
