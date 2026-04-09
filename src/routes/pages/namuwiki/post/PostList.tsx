import { Button, GridCard } from "@/components";
import { errorToast } from "@/lib/toast";
import { useGetPosts } from "@/queries/post.queries";
import { Plus } from "lucide-react";
import type { ColDef } from "node_modules/ag-grid-community/dist/types/src/main-umd-noStyles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PostInfo {
  id: number;
  title: string;
  updatedAt: string;
  memNickname : string;
  memProfileImg : string;
}

const PostList = () => {
  const nav = useNavigate();
  const { data } = useGetPosts();
  const result: PostInfo[] = data ?? [];
  const [colDefs] = useState<ColDef<PostInfo>[]>([
    {
      headerName: "번호",
      width: 80,
      valueGetter: (params) => {
        const total = params.api.getDisplayedRowCount();
        return total - (params.node?.rowIndex ?? 0);
      },
    },
    {
      field: "title",
      headerName: "제목",
      flex: 1,
      onCellClicked: (e) => {
        if (!e.data) {
          errorToast("해당 게시글에 문제가 생겼습니다.");
          return;
        }
        nav(`/namu/post-list/${e.data.id}`);
      }
    },
    {
      field: "memNickname",
      headerName: "닉네임",
      flex: 1,
      cellRenderer: (params: any) => {
        const profileImg = params.data?.memProfileImg;
        const nickname = params.data?.memNickname ?? "알수없음";
        const initial = nickname?.[0] ?? "U";
        return (
          <div className="flex items-center gap-2">
            {profileImg ? (
              <img src={profileImg} className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {initial}
              </div>
            )}
            <span>{nickname}</span>
          </div>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "게시글 등록 날짜 & 시간",
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        date.setHours(date.getHours() + 9);
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ]);
  return (
    <div>
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          className="bg-primary"
          onClick={() => nav("/namu/post-register")}
        >
          <Plus className="size-4" />
          게시글 등록하기
        </Button>
      </div>
      <div className="flex h-[720px] flex-col">
        <GridCard<PostInfo>
          title="등록된 판매정보 목록"
          count={result.length}
          rowData={result}
          columnDefs={colDefs}
        />
      </div>
      
    </div>
    
  );
};

export default PostList;
