import { Button, Input } from "@/components";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toastMutation } from "@/lib/toast";
import { useCreatePost } from "@/queries/post.queries";
import type { JSONContent } from "@tiptap/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileEdit } from "lucide-react";
import { decodeToken } from "@/utils/auth";

const PostRegister = () => {
  const [title, setTitle] = useState<string>("");
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const onSaveClick = (json: JSONContent) => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeToken(token.replace("Bearer ","")) : null;
    const memEmail = decoded?.sub ?? null;

    toastMutation(createPostMutation.mutateAsync, 
      {
        title: title,
        content: JSON.stringify(json),
        memEmail : memEmail,
      },
      "등록중..."
      , "등록되었습니다."
      , "등록에 실패하였습니다.",
      {
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
            <h1 className="text-xl font-bold tracking-tight">새 게시글 작성</h1>
            <Badge variant="success" className="ml-auto">
              새 글
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            제목과 본문을 입력하여 게시글을 작성하세요.
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
              <SimpleEditor onSave={onSaveClick} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostRegister;
