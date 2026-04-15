import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteDetail1, useGetPost } from "@/queries/post.queries";
import { AppAlertDialog, Button, Input } from "@/components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { ArrowLeft, Calendar, Clock, Edit, Trash2, UserCheck } from "lucide-react";
import { postApi } from "@/api/post.api";
import { errorToast, successToast, toastMutation } from "@/lib/toast";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { isAdmin, getUserEmail } from "@/utils/auth";
import { decodeToken } from "@/utils/auth";
import { useGetComments, useInsertComment, useUpdateComment, useDeleteComment } from "@/queries/comment.queries";
import { Heart } from "lucide-react";
import { useGetLikeStatus, useToggleLike } from "@/queries/post.queries";
import { useDeleteFollow, usePostFollow } from "@/queries/follow.queries";
import { useQueryClient } from "@tanstack/react-query";
import { getCheckFollow } from "@/api/follow.api";
import { tr } from "date-fns/locale";
import {toast} from "sonner"

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 9);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 9);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 안전하게 파싱하는 헬퍼 함수 추가 (컴포넌트 밖에)
const safeParseContent = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    return content; // JSON 아니면 그냥 문자열로 반환
  }
};

const PostDetailSkeleton = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    <Skeleton className="h-8 w-24" />
    <Card>
      <CardHeader className="space-y-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  </div>
);

const PostDetail = () => {
  const navigate = useNavigate();
  const deletePostMutate = useDeleteDetail1();

  const { postId } = useParams<{ postId: string }>();
  const { data: post, isLoading } = useGetPost(postId ?? "");
  const [open, setOpen] = useState<boolean>(false);
  // 댓글 관련
  const [commentContent, setCommentContent] = useState<string>("");
  const {data : comments} = useGetComments(Number(postId));
  const insertCommentMutate = useInsertComment(Number(postId));
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommContent, setEditCommContent] = useState<string>("");
  const updateCommentMutate = useUpdateComment(Number(postId));
  const deleteCommentMutate = useDeleteComment(Number(postId));
  // 좋아요 관련
  const currentUserEmail = getUserEmail();
  const { data: likeStatus } = useGetLikeStatus(Number(postId), currentUserEmail);
  const toggleLikeMutate = useToggleLike(Number(postId), currentUserEmail);


  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: true,
          enableClickSelection: false,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],

    content: post?.content ? safeParseContent(post.content) : "",
  });

  useEffect(() => {
    if (editor && post?.content) {
      editor.commands.setContent(safeParseContent(post.content));
    }
  }, [editor, post?.content]);

   //팔로우 버튼 추가
  const [isFollowing, setIsFollowing] = useState(false);
  const followMutation = usePostFollow();
  const unfollowMutation = useDeleteFollow();
  const queryClient = useQueryClient();

  useEffect(() => {
    if(!currentUserEmail || !post?.memEmail) return;
    if(currentUserEmail === post?.memEmail) return;
    if(post?.memRole === "ADMIN") return;
    getCheckFollow({followerEmail: currentUserEmail, farmerEmail : post.memEmail}).then(setIsFollowing);
  }, [currentUserEmail, post?.memEmail, post?.memRole]);

  const handleFollow = async () => {
    if(!currentUserEmail || !post) return;
    toast.dismiss();
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

  if (isLoading) return <PostDetailSkeleton />;

  if (!post) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 py-20">
        <div className="text-6xl">📭</div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          게시글을 찾을 수 없습니다
        </h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
      </div>
    );
  }

  // 상세보기 삭제

  // 상세 삭제 axios 함수 호출
  const onConfirmHandler = (id: number) => {
    // try{
    //   await postApi.deleteDetail1(id);
    // } catch(e){
    //   console.error(e);
    //   alert("삭제 중 오류 발생");
    // }
    //navigate("/namu/post-list");
    deletePostMutate.mutate(id, {
      onSuccess: () => {
        successToast("삭제에 성공하였습니다.");
        navigate("/namu/post-list");
      },
      onError: () => {
        errorToast("삭제에 실패하였습니다.");
      },
    });
  };

  // 관리자일때 수정 삭제 가능
  const admin = isAdmin();

  // 본인 or 관리자일때 수정 삭제 버튼 표시
  const canEditDelete = admin || currentUserEmail === post.memEmail;


  // 댓글 기능
  const onCommentSubmit = ()=>{
    if (!commentContent.trim()) return;
    const token = localStorage.getItem("token");
    const decoded = token ? decodeToken(token.replace("Bearer ", "")) : null;
    const memEmail = decoded?.sub ?? null;

    insertCommentMutate.mutate(
      {postId : Number(postId), memEmail, content : commentContent},
      {
        onSuccess:()=>{
          setCommentContent("");
          successToast("댓글이 등록되었습니다.");

        },
        onError:()=>{
          errorToast("댓글 등록에 실패하였습니다.");
        },
      }
    );


  };

  // 좋아요
  const onLikeClick = () => {
    if (!currentUserEmail) return;
    toggleLikeMutate.mutate({ postId: Number(postId), memEmail: currentUserEmail });
  };

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Button>

        <Card className="overflow-hidden">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">게시글</Badge>
              <Badge variant="outline">#{post.id}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                {post.title}
              </h1>
              <button
                onClick={onLikeClick}
                className="flex items-center gap-1 text-muted-foreground hover:text-red-500"
              >
                <Heart className={`h-5 w-5 ${likeStatus?.liked ? "fill-red-500 text-red-500" : ""}`} />
                <span className="text-sm">{likeStatus?.likeCount ?? 0}</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* 작성자 정보 */}
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
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">
                      {post.memNickname ?? "알수없음"}
                    </span>
                    {post.memRole === "FARMER" 
                    ? (<Badge variant="success">농장주</Badge>) 
                    : post.memRole === "ADMIN"
                    ? <Badge variant="danger">관리자</Badge>
                    : (<Badge variant="secondary">일반 회원</Badge>)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="text-border">|</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* 팔로우 버튼 */}
              {currentUserEmail && currentUserEmail !== post.memEmail && post.memRole !== "ADMIN" && (
                <Button
                  onClick={handleFollow}
                  size="sm"
                  variant="outline"
                  className={`rounded-full ${
                    isFollowing
                      ? "border-green-600 text-green-600 hover:bg-green-50"
                      : "text-muted-foreground hover:border-green-600 hover:text-green-600"
                  }`}
                  disabled={followMutation.isPending || unfollowMutation.isPending}
                >
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  {isFollowing ? "팔로잉" : "팔로우"}
                </Button>
              )}


              {/* 액션 버튼 */}
              {canEditDelete
              &&
              (
                <div className="flex items-center gap-2">
                  {/* 상세보기 수정 버튼 */}
                  <Button
                    onClick={() => navigate(`/namu/post-edit/${post.id}`)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    수정
                  </Button>

                  {/* 상세보기 삭제 버튼 */}
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    size="sm"
                    className="gap-1 text-danger hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    삭제
                  </Button>
                </div>
              )}
              
            </div>
          </CardHeader>

          <Separator />

          {/* 본문 콘텐츠 */}
          <CardContent className="py-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <EditorContent editor={editor} />
            </div>
          </CardContent>

          <Separator />

          {/* 푸터 메타 정보 */}
          <div className="flex items-center justify-between px-6 py-4 text-xs text-muted-foreground">
            <span>
              최종 수정: {formatDate(post.updatedAt)}{" "}
              {formatTime(post.updatedAt)}
            </span>
            <span>게시글 ID: {post.id}</span>
          </div>
        </Card>
      </div>
      <AppAlertDialog
        open={open}
        title="게시글 삭제"
        description="정말 게시글을 삭제하시겠습니까?"
        onOpenChange={(state: boolean) => setOpen(state)}
        onConfirm={() => onConfirmHandler(post.id)}
      />

      {/* 좋아요 */}
      <div className="mx-auto max-w-4xl mt-2">
        <button
          onClick={onLikeClick}
          className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
        >
          <Heart className={`h-5 w-5 ${likeStatus?.liked ? "fill-red-500 text-red-500" : ""}`} />
          <span className="text-sm">{likeStatus?.likeCount ?? 0}명이 좋아합니다</span>
        </button>
      </div>


      {/* 댓글 */}
      
      <Card className="overflow-hidden mt-4">
        <CardHeader className="pb-4">
          <h2 className="text-base font-semibold">
            댓글 {comments?.length ?? 0}개
          </h2>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 py-4">
          {/* 댓글 목록 */}
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  {comment.memProfileImg ? (
                    <AvatarImage src={comment.memProfileImg} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {comment.memNickname?.[0] ?? "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.memNickname}</span>
                      {comment.memRole === "FARMER" ? (<Badge variant="success">농장주</Badge>) : (<Badge variant="secondary">일반 회원</Badge>)}
                      {/* 댓글 등록 날짜 + 시간 */}
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt !== comment.updatedAt ? (
                          <>
                            {formatDate(comment.updatedAt)}&nbsp;{formatTime(comment.updatedAt)}
                            {/* created updated 다르면 수정됨이라는 글자 표시 */}
                            {comment.createdAt !== comment.updatedAt && (
                              <span className="ml-1 text-xs text-muted-foreground">(수정됨)</span>
                            )}
                          </>
                        ) : (
                          <>
                            {formatDate(comment.createdAt)}&nbsp;{formatTime(comment.createdAt)}
                          </>
                        )}
                      </span>
                    </div>

                    {/* 본인 or 관리자만 버튼 표시 */}
                    {(admin || currentUserEmail === comment.memEmail) && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            setEditCommentId(comment.id);
                            setEditCommContent(comment.content);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-danger hover:text-danger"
                          onClick={() => {
                            deleteCommentMutate.mutate(comment.id, {
                              onSuccess: () => successToast("댓글이 삭제되었습니다."),
                              onError: () => errorToast("댓글 삭제에 실패하였습니다."),
                            });
                          }}
                        >
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 수정 중이면 input, 아니면 내용 표시 */}
                  {editCommentId === comment.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editCommContent}
                        onChange={(e) => setEditCommContent(e.target.value)}
                        className="flex-1 h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                          updateCommentMutate.mutate({
                            id: comment.id
                            , postId: Number(postId)
                            , memEmail: currentUserEmail
                            , content: editCommContent 
                          },
                          {
                            onSuccess: () => {
                              setEditCommentId(null);
                              successToast("댓글이 수정되었습니다.");
                            },
                            onError: () => errorToast("댓글 수정에 실패하였습니다."),
                          });
                        }}
                      >
                        완료
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setEditCommentId(null)}
                      >
                        취소
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm">{comment.content}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              첫 댓글을 작성해보세요!
            </p>
          )}
          <Separator />

          {/* 댓글 입력 */}
          {currentUserEmail ? (
            <div className="flex gap-2">
              <Input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="flex-1"
              />
              <Button onClick={onCommentSubmit} size="sm">
                등록
              </Button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-2">
              로그인 후 댓글을 작성할 수 있습니다.
            </p>
          )}


        </CardContent>
      </Card>
    </>
  );
};

export default PostDetail;
