import { Button, GridCard } from "@/components";
import { errorToast } from "@/lib/toast";
import { useGetPosts } from "@/queries/post.queries";
import { Plus, Calendar } from "lucide-react";
import type { ColDef } from "node_modules/ag-grid-community/dist/types/src/main-umd-noStyles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle } from "lucide-react";
import { useGetLikeStatus, useToggleLike } from "@/queries/post.queries";
import { getUserEmail } from "@/utils/auth";
import PostFeedCard from "@/components/PostFeedCard";


export interface PostInfo {
  id: number;
  title: string;
  updatedAt: string;
  memNickname: string;
  memProfileImg: string;
  content: string;
  viewCount : number;
  commentCount: number;
}

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

const PostList = () => {
  
  const nav = useNavigate();
  const { data } = useGetPosts();
  const result: PostInfo[] = data ?? [];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(result.length / pageSize);
  const pagedResult = result.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const colDefs : ColDef<PostInfo>[] = [
    {
      headerName: "번호",
      width: 80,
      valueGetter: (params) => {
        if (!result || result.length === 0) return "";
        const globalIndex = (currentPage - 1) * pageSize + (params.node?.rowIndex ?? 0);
        return result.length - globalIndex;
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
      },
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
    {
      field: "viewCount",
      headerName: "조회수",
      width: 100,
      valueFormatter: (params) => `${params.value ?? 0}회`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 기존 테이블 */}
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
        <div className="flex flex-col">
          <GridCard<PostInfo>
            title="등록된 게시판 목록"
            count={result.length}
            rowData={pagedResult}
            columnDefs={colDefs}
            domLayout="autoHeight"  // ← 빈 공백 제거
          />

          {/* 커스텀 페이지네이션 */}
          <div className="mt-3 flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded px-2 py-1 text-sm disabled:opacity-40 hover:bg-accent"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 text-sm ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "hover:bg-accent"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded px-2 py-1 text-sm disabled:opacity-40 hover:bg-accent"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 피드 목록 */}
      <div className="mx-auto max-w-2xl space-y-4">
        {result.map((post) => (
          <PostFeedCard
            key={post.id}
            post={post}
            onClick={() => nav(`/namu/post-list/${post.id}`)}
          />
          

        ))}
      </div>
    </div>
  );
};

export default PostList;