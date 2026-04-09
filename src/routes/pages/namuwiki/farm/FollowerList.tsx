import { useGetFollowerList } from "@/queries/follow.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "@/utils/auth";

const FollowerList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token.replace("Bearer ", "")) : null;
  const farmerEmail = decoded?.sub ?? "";

  console.log("token:", token);
  console.log("decoded:", decoded);
  console.log("farmerEmail:", farmerEmail);  // 추가

  const { data: followers, isLoading } = useGetFollowerList(farmerEmail);

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

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

      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">팔로워 목록</h1>
        <span className="ml-auto text-sm text-muted-foreground">
          총 {(followers ?? []).length}명
        </span>
      </div>

      {/* 목록 */}
      {(followers ?? []).length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          팔로워가 없습니다.
        </div>
      ) : (
        <Card>
          <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Users className="h-5 w-5" />
              나를 팔로우하는 회원
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {(followers ?? []).map((item: { followerEmail: string; followerNickname: string }) => (
              <div key={item.followerEmail} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-green-100 text-sm font-bold text-green-700">
                    {item.followerNickname?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.followerNickname}</p>
                  <p className="text-xs text-muted-foreground">{item.followerEmail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FollowerList;
