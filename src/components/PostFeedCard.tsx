import React, { useEffect, useState } from "react";
import type { PostInfo } from "@/routes/pages/namuwiki/post/PostList";
import { getUserEmail } from "@/utils/auth";
import { useGetLikeStatus, useToggleLike } from "@/queries/post.queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Heart, MessageCircle, UserCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "./ui/badge";
import { Secondary } from "./ui/badge.stories";
import { useDeleteFollow, usePostFollow } from "@/queries/follow.queries";
import { getCheckFollow } from "@/api/follow.api";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toastMutation } from "@/lib/toast";
import {toast} from "sonner";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 9);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const PostFeedCard = ({ post, onClick }: { post: PostInfo; onClick: () => void }) => {
  const currentUserEmail = getUserEmail();
  const { data: likeStatus } = useGetLikeStatus(post.id, currentUserEmail);
  const toggleLikeMutate = useToggleLike(post.id, currentUserEmail);
  const [isFollowing, setIsFollowing] = useState(false);
  const followMutation = usePostFollow();
  const unfollowMutation = useDeleteFollow();
  const queryClient = useQueryClient();

  useEffect(() => {
    if(!currentUserEmail || !post.memEmail) return;
    if(currentUserEmail === post.memEmail) return;
    getCheckFollow({followerEmail: currentUserEmail, farmerEmail : post.memEmail}).then(setIsFollowing);
  }, [currentUserEmail, post.memEmail])

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.dismiss();
    if(!currentUserEmail) return;
    
    if(isFollowing) {
      const {error} = await toastMutation(unfollowMutation.mutateAsync, {followerEmail: currentUserEmail, farmerEmail: post.memEmail}, "언팔로우 중...", `${post.memNickname}님을 언팔로우했습니다.`, "언팔로우에 실패했습니다.")
      if(!error){
        setIsFollowing(false);
        queryClient.invalidateQueries({queryKey: ["followList"]});
      }
    }else{
      const {error} = await toastMutation(followMutation.mutateAsync, {followerEmail: currentUserEmail, farmerEmail: post.memEmail}, "팔로우 중...", `${post.memNickname}님을 팔로우했습니다.`, "팔로우에 실패했습니다.")
      if(!error){
        setIsFollowing(true);
        queryClient.invalidateQueries({queryKey: ["followList"]});
      }
    }
  }

  const onLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 막기
    if (!currentUserEmail) return;
    toggleLikeMutate.mutate({ postId: post.id, memEmail: currentUserEmail });
  };

  return (
  <Card
    className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
    onClick={onClick}
  >
    {/* 작성자 정보 */}
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">

        {/* 왼쪽: 작성자 정보 */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {post.memProfileImg ? (
              <AvatarImage src={post.memProfileImg} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                {post.memNickname?.[0] ?? "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">
                {post.memNickname ?? "알수없음"}
              </span>
              {post.memRole === "FARMER"
                ? <Badge variant="success">농장주</Badge>
                : post.memRole === "ADMIN"
                ? <Badge variant="danger">관리자</Badge>
                : <Badge variant="secondary">일반 회원</Badge>}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* 오른쪽 상단: 팔로우 버튼 */}
        {currentUserEmail && currentUserEmail !== post.memEmail && post.memRole !== "ADMIN" &&(
          <Button
            onClick={handleFollow}
            size="sm"
            variant="outline"
            className={`rounded-full text-sx border-none ${
              isFollowing
                ? "border-green-600 text-green-600 hover:bg-green-50"
                : "text-muted-foreground hover:border-green-600 hover:text-green-600"
            }`}
            disabled={followMutation.isPending || unfollowMutation.isPending}
          >
            {isFollowing
              ? <><UserCheck className="h-3 w-3 mr-1" />팔로잉</>
              : <><UserCheck className="h-3 w-3 mr-1" />팔로우</>
            }
          </Button>
        )}

      </div>
    </CardHeader>


    {/* 이미지 (있을 때만) */}
    {(() => {
      try {
        const json = JSON.parse(post.content ?? "");
        const firstImage = json.content?.find(
          (node: any) =>
            node.type === "image" ||
            node.content?.some((c: any) => c.type === "image")
        );
        const imgSrc =
          firstImage?.attrs?.src ??
          firstImage?.content?.find((c: any) => c.type === "image")?.attrs?.src;
        if (!imgSrc) return null;
        return (
          <img
            src={imgSrc}
            className="w-full object-cover"
            style={{ maxHeight: "240px" }}
          />
        );
      } catch {
        return null;
      }
    })()}

    <CardContent className="pt-3">
      {/* 제목 */}
      <h2 className="mb-1 text-base font-semibold">{post.title}</h2>

      {/* 본문 미리보기 */}
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {(() => {
          try {
            const json = JSON.parse(post.content ?? "");
            return json.content
              ?.flatMap((node: any) =>
                node.content?.map((c: any) => c.text ?? "") ?? []
              )
              .join(" ");
          } catch {
            return post.content;
          }
        })()}
      </p>

      {/* 좋아요 & 댓글 & 조회수 */}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onLikeClick}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500"
          >
            <Heart
              className={`h-4 w-4 ${likeStatus?.liked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span>{likeStatus?.likeCount ?? 0}</span>
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount ?? 0}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          조회 {post.viewCount ?? 0}
        </span>
      </div>
    </CardContent>
  </Card>
  );

};

export default PostFeedCard;