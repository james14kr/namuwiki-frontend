import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMemInfo1 } from "../../../api/memberApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/tw.utils";
import {
  User,
  Phone,
  Mail,
  Lock,
  Trash2,
  LayoutDashboard,
  History,
  Activity,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { uploadImage } from "@/utils/uploadUtils";
import { isNullOrEmpty } from "@/utils/validate";
import { getUserEmail } from "@/utils/auth";

const MyFarm = () => {
  const nav = useNavigate();
  const cruuentUserEmail = getUserEmail();

  const [memInfo, setMemInfo] = useState<{
    memNickname?: string;
    memName?: string;
    memTel?: string;
    memEmail?: string;
    memProfileImg?: string;
  }>({});

  useEffect(() => {
    
    getMemInfo1(cruuentUserEmail).then((response: { data: typeof memInfo }) => {
      if (response) setMemInfo(response.data);
    });
  }, []);

  const initial = memInfo.memNickname?.charAt(0)?.toUpperCase() ?? "?";

  const [profileImg, setProfileImg] = useState<string>("");
  const inputRef = useRef(null);

  // useRef 변수를 태그에 ref속성에 넣으면 해당 element 값을 가지고 있을 수 있게 됨
  // element에 click이벤트를 강제 호출
  const handleClickEvent = () => {
    if (!inputRef || inputRef.current === null) return;

    (inputRef.current as HTMLInputElement).click();
  };

  const handleChangeEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];

    // Presigned URL 방식으로 S3에 이미지 업로드 하는 api
    const publicURL = await uploadImage(file, "my-page");
    setProfileImg(publicURL);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 프로필 히어로 배너 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-500 px-6 py-14">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4">
          <Avatar
            className="size-24 cursor-pointer shadow-2xl ring-4 ring-white/30"
            onClick={handleClickEvent}
          >
            {isNullOrEmpty(memInfo.memProfileImg) ? (
              <AvatarFallback className="bg-green-900/60 text-3xl font-bold text-white">
                {initial}
              </AvatarFallback>
            ) : (
              <AvatarImage src={memInfo.memProfileImg} />
            )}
          </Avatar>
          <input
            id="input"
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChangeEvent}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              {memInfo.memNickname || "닉네임"}
            </h1>
            <p className="mt-1 text-sm text-green-100/80">나무위키 농장주</p>
          </div>
        </div>

        {/* 장식 요소 */}
        <Leaf className="absolute right-10 top-4 size-24 rotate-12 text-white/10" />
        <Leaf className="absolute -left-2 bottom-2 size-16 -rotate-12 text-white/10" />
        <div className="absolute -bottom-8 left-1/2 h-16 w-full -translate-x-1/2 rounded-[50%] bg-background" />
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-2xl space-y-5 px-4 pb-10 pt-10">
        {/* 내 프로필 카드 */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-green-50 px-5 py-3.5 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-base text-green-700 dark:text-green-400">
              <User className="size-4" />내 프로필
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            <InfoRow
              icon={<User className="size-4 text-muted-foreground" />}
              label="이름"
              value={memInfo.memName}
            />
            <InfoRow
              icon={<Phone className="size-4 text-muted-foreground" />}
              label="전화번호"
              value={memInfo.memTel}
            />
            <InfoRow
              icon={<Mail className="size-4 text-muted-foreground" />}
              label="이메일"
              value={memInfo.memEmail}
            />
            <ActionRow
              icon={<Lock className="size-4 text-muted-foreground" />}
              label="비밀번호 수정"
              disabled
            />
            <ActionRow
              icon={<Trash2 className="size-4 text-danger" />}
              label="회원 탈퇴"
              labelClassName="text-danger"
              disabled
            />
          </CardContent>
        </Card>

        {/* 내 농장 카드 */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-green-50 px-5 py-3.5 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-base text-green-700 dark:text-green-400">
              <Leaf className="size-4" />내 농장
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            <ActionRow
              icon={<History className="size-4 text-muted-foreground" />}
              label="로그인 이력"
              disabled
            />
            <ActionRow
              icon={<Activity className="size-4 text-muted-foreground" />}
              label="내 활동 기록"
              disabled
            />
            <ActionRow
              icon={<LayoutDashboard className="size-4 text-green-600" />}
              label="농장 대시보드"
              labelClassName="font-medium text-green-700 dark:text-green-400"
              onClick={() => nav("/namu/dashboard")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 읽기 전용 정보 행
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center gap-3 px-5 py-3.5">
    {icon}
    <span className="w-24 shrink-0 text-sm text-muted-foreground">{label}</span>
    <span className="flex-1 text-sm font-medium text-foreground">
      {value || <span className="text-muted-foreground/40">—</span>}
    </span>
  </div>
);

// 액션 행 (클릭 가능 or 비활성)
const ActionRow = ({
  icon,
  label,
  labelClassName,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  labelClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    className={cn(
      "flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors",
      disabled
        ? "cursor-not-allowed opacity-40"
        : "cursor-pointer hover:bg-accent"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <span className={cn("flex-1 text-sm", labelClassName)}>{label}</span>
    {!disabled && <ChevronRight className="size-4 text-muted-foreground" />}
  </button>
);

export default MyFarm;
