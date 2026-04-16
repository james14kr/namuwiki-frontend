import { Button, Input } from "@/components";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toastMutation } from "@/lib/toast";
import { useGetPost, useUpdatePost } from "@/queries/post.queries";
import type { JSONContent } from "@tiptap/core";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileEdit } from "lucide-react";

const safeParseContent = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
};

const PostEdit = () => {
  const { postId } = useParams<{ postId: string }>();
  const { data: post } = useGetPost(postId ?? "");
  const [title, setTitle] = useState<string>("");
  const navigate = useNavigate();
  const updatePostMutation = useUpdatePost();

  // 기존 title
  useEffect(() => {
    if (post?.title) {
      setTitle(post.title);
    }
  }, [post]);

  const onSaveClick = (json: JSONContent) => {
    toastMutation(updatePostMutation.mutateAsync, {
      id : Number(postId)
      , title: title
      , content: JSON.stringify(json),
      },
      "수정 중~"
      , "수정되었습니다."
      , "수정에 실패하였습니다."
      ,{
        onSuccess: () => navigate("/namu/post-feed"),
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
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
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">게시글 수정</h1>
            <Badge variant="success" className="ml-auto">
              수정
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            제목과 본문을 입력하여 수정하세요.
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <FieldLabel htmlFor="title" className="text-sm font-medium">
              제목
            </FieldLabel>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="text-base"
            />
          </div>

          <div className="">
            <FieldLabel className="text-sm font-medium">본문</FieldLabel>
            <div className="h-[600px]">
              {post ? (
                <SimpleEditor 
                  onSave={onSaveClick} 
                  initialContent={safeParseContent(post.content)}
                  saveLabel="게시글 수정"
                />
              ) : (
                <div>로딩중...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostEdit;
