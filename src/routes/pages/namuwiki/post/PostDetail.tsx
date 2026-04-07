import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteDetail1, useGetPost } from "@/queries/post.queries";
import { AppAlertDialog, Button } from "@/components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
import { ArrowLeft, Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { postApi } from "@/api/post.api";
import { errorToast, successToast } from "@/lib/toast";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { isAdmin } from "@/utils/auth";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
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

            <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              {post.title}
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* 작성자 정보 */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">작성자</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="text-border">|</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              
              {admin
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
    </>
  );
};

export default PostDetail;
