import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEmail } from "@/utils/auth";
import { memberApi } from "@/api/memberApi";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const MyActivity = () => {
  const nav = useNavigate();
  const currentUserEmail = getUserEmail();
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [myComments, setMyComments] = useState<any[]>([]);
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);

  useEffect(() => {
    if (!currentUserEmail) return;
    memberApi.getMyPosts(currentUserEmail).then((data) => setMyPosts(data));
    memberApi.getMyComments(currentUserEmail).then((data) => setMyComments(data));
  }, [currentUserEmail]);

  // 댓글을 게시글별로 그룹핑
const groupedComments = myComments.reduce((acc: any, comment: any) => {
  const postId = comment.postId;
  if (!acc[postId]) {
    acc[postId] = {
      postId,
      postTitle: comment.postTitle,
      postWriterNickname: comment.postWriterNickname,
      comments: [],
      latestAt: comment.createdAt,  // ← 추가
    };
  }
  acc[postId].comments.push(comment);
  // 최신 댓글 시간 업데이트
  if (comment.createdAt > acc[postId].latestAt) {
    acc[postId].latestAt = comment.createdAt;
  }
  return acc;
}, {});

// 최신 댓글 순으로 정렬
const sortedGroups = Object.values(groupedComments).sort(
  (a: any, b: any) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime()
);

  // 접기/펼치기 토글
  const toggleExpand = (postId: number) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      {/* 상단 */}
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </button>

      <h1 className="text-xl font-bold">내 활동 기록</h1>

      {/* 탭 */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "posts"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          내가 작성한 게시글 ({myPosts.length})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "comments"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          내가 작성한 댓글 ({Object.keys(groupedComments).length})
        </button>
      </div>

      {/* 내가 작성한 게시글 */}
      {activeTab === "posts" && (
        <div className="space-y-3">
          {myPosts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              작성한 게시글이 없습니다.
            </p>
          ) : (
            myPosts.map((post: any) => (
              <Card
                key={post.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => nav(`/namu/post-list/${post.id}`)}
              >
                <CardContent className="py-4">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(post.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* 내가 작성한 댓글 */}
      {activeTab === "comments" && (
        <div className="space-y-3">
          {Object.keys(groupedComments).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              작성한 댓글이 없습니다.
            </p>
          ) : (
            sortedGroups.map((group: any) => (
              <Card key={group.postId}>
                <CardHeader 
                  className="py-3"
                 
                >
                  <div className="flex items-center">
                    {/* 게시글 - 왼쪽과 중앙 클릭하면 해당 게시글로 이동 */}
                    <div
                      className="flex flex-col gap-1 flex-1 cursor-pointer hover:opacity-70"
                      onClick={() => nav(`/namu/post-list/${group.postId}`)}
                    >
                      <p className="text-sm font-medium">{group.postTitle}</p>
                      <span className="text-xs text-muted-foreground">
                        작성자: {group.postWriterNickname ?? "알수없음"}
                      </span>
                    </div>

                    {/* 댓글 수 - 오른쪽 클릭하면 접기/펼치기 */}
                    <button
                      onClick={() => toggleExpand(group.postId)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span>댓글 {group.comments.length}개</span>
                      {expandedPostIds.includes(group.postId) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </CardHeader>

                {/* 댓글 목록 - 펼쳐졌을 때만 표시 */}
                {expandedPostIds.includes(group.postId) && (
                  <>
                    <Separator />
                    <CardContent className="py-3 space-y-2">
                      {group.comments.map((comment: any) => (
                        <div key={comment.id} className="flex flex-col gap-1 py-2 border-b last:border-0">
                          <p className="text-sm">{comment.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyActivity;