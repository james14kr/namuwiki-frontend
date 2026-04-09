import { useParams, useNavigate } from "react-router-dom";
import { useGetFarmDetail } from "@/queries/farm/useGetFarmDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Sprout, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components";
import { useQueryClient } from "@tanstack/react-query";
import { decodeToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useDeleteFollow, usePostFollow } from "@/queries/follow.queries";
import { getCheckFollow } from "@/api/follow.api";

const FarmDetail = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { data: farm, isLoading } = useGetFarmDetail(Number(farmId));
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token.replace("Bearer ", "")) : null;
  const followerEmail = decoded.sub ?? "";

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if(!followerEmail || !farm?.farmerEmail) return;
    getCheckFollow({followerEmail, farmerEmail : farm.farmerEmail}).then(setIsFollowing)
  }, [followerEmail, farm])

  const followMutation = usePostFollow();
  const unfollowMutation = useDeleteFollow();

  const handleFollow = async () => {
    if(isFollowing){
      await unfollowMutation.mutateAsync({followerEmail, farmerEmail : farm.farmerEmail});
      setIsFollowing(false);
    }else{
      await followMutation.mutateAsync({followerEmail, farmerEmail : farm.farmerEmail});
      setIsFollowing(true);
    }
    queryClient.invalidateQueries({queryKey : ["followList"]});
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="flex h-60 items-center justify-center text-muted-foreground">
        농장 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const initial = farm.memNickname?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Button>

      {/* 농장주 프로필 */}
      <Card>
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <User className="h-5 w-5" />
            농장주 프로필
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div className="flex itmes-center gap-4">
              <Avatar className="h-16 w-16">
                {farm.memProfileImg ? (
                  <AvatarImage src={farm.memProfileImg} />
                ) : (
                  <AvatarFallback className="bg-green-100 text-xl font-bold text-green-700">
                    {initial}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold">{farm.memNickname}</p>
                <p className="text-sm text-muted-foreground">{farm.memName}</p>
              </div>
            </div>
            <Button
              className={isFollowing
                ? "w-32 flex  border border-green-600 bg-white text-green-400 hover:bg-green-50"
                : "w-32 bg-green-600 hover:bg-green-700 text-white"
              }
              onClick={handleFollow}
              disabled={followerEmail === farm.farmerEmail} // 본인 농장은 팔로우 불가
            >
              {isFollowing ? "팔로우 취소" : "팔로우"}
            </Button>

          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {farm.memTel || "정보 없음"}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {farm.farmerEmail}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 농장 정보 */}
      <Card>
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Sprout className="h-5 w-5" />
            {farm.farmName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-5 text-sm text-muted-foreground">
          {farm.farmAddr && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {farm.farmAddr}
            </div>
          )}
          {farm.farmDesc && (
            <p className="pt-1 text-foreground/80">{farm.farmDesc}</p>
          )}
        </CardContent>
      </Card>

      
    </div>
  );
};

export default FarmDetail;
