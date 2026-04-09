import React from "react";
import type { PostInfo } from "@/routes/pages/namuwiki/post/PostList";
import { getUserEmail } from "@/utils/auth";
import { useGetLikeStatus, useToggleLike } from "@/queries/post.queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {post.memNickname ?? "알수없음"}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.updatedAt)}</span>
            </div>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            조회수 {post.viewCount ?? 0}회
          </span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3">
        <h2 className="mb-2 text-base font-semibold">{post.title}</h2>
        <div className="max-h-72 overflow-hidden text-sm text-muted-foreground">
          {post.content ? (
            (() => {
              try {
                const json = JSON.parse(post.content);
                const firstImage = json.content?.find(
                  (node: any) => node.type === "image" ||
                  node.content?.some((c: any) => c.type === "image")
                );
                const imgSrc = firstImage?.attrs?.src ??
                  firstImage?.content?.find((c: any) => c.type === "image")?.attrs?.src;
                const text = json.content
                  ?.flatMap((node: any) =>
                    node.content?.map((c: any) => c.text ?? "") ?? []
                  )
                  .join(" ");
                return (
                  <>
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        className="mb-2 rounded-md object-cover"
                        style={{ width: "50%", height: "auto" }}
                      />
                    )}
                    <p className="line-clamp-3">{text}</p>
                  </>
                );
              } catch {
                return <p className="line-clamp-4">{post.content}</p>;
              }
            })()
          ) : (
            <p className="text-muted-foreground/50">내용 없음</p>
          )}
        </div>

        {/* 좋아요 & 댓글 */}
        <div className="mt-3 flex items-center gap-4 border-t pt-3">
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
      </CardContent>
    </Card>
  );
};

export default PostFeedCard;