import { GridCard } from "@/components";
import { errorToast } from "@/lib/toast";
import { useGetPosts } from "@/queries/post.queries";
import type { ColDef } from "node_modules/ag-grid-community/dist/types/src/main-umd-noStyles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PostInfo {
  id: number;
  title: string;
  updatedAt: string;
}

const PostList = () => {
  const nav = useNavigate();
  const { data } = useGetPosts();
  const result: PostInfo[] = data ?? [];
  const [colDefs] = useState<ColDef<PostInfo>[]>([
    {
      field: "id",
      headerName: "id",
      width: 80,
      sortable: true,
    },
    {
      field: "title",
      headerName: "title",
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
      field: "updatedAt",
      headerName: "updatedAt",
      flex: 1,
    },
  ]);
  return (
    <div className="flex h-[720px] flex-col">
      <GridCard<PostInfo>
        title="등록된 판매정보 목록"
        count={result.length}
        rowData={result}
        columnDefs={colDefs}
      />
    </div>
  );
};

export default PostList;
