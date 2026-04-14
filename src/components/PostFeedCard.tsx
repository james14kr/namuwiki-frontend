import React from "react";
import type { PostInfo } from "@/routes/pages/namuwiki/post/PostList";
import { getUserEmail } from "@/utils/auth";
import { useGetLikeStatus, useToggleLike } from "@/queries/post.queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "./ui/badge";
import { Secondary } from "./ui/badge.stories";

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
        <div className="">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">
              {post.memNickname ?? "알수없음"}
            </span>
            {post.memRole === "FARMER" ? (<Badge variant="success">농장주</Badge>) : (<Badge variant="secondary">일반 회원</Badge>)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.updatedAt)}</span>
          </div>
        </div>
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