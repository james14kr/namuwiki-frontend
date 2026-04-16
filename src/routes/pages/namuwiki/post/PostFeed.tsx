import { useGetPosts } from "@/queries/post.queries";
import PostFeedCard from "@/components/PostFeedCard";
import { useNavigate } from "react-router-dom";
import type { PostInfo } from "./PostList";
import { Button } from "@/components";
import { Plus } from "lucide-react";

const PostFeed = () => {
  const nav = useNavigate();
  const { data } = useGetPosts();
  const result: PostInfo[] = data ?? [];

  return (
    <div>
      <div className="flex justify-end mb-4">  {/* ← 추가 */}
        <Button
          size="sm"
          className="bg-primary"
          onClick={() => nav("/namu/post-register")}
        >
          <Plus className="size-4" />
          게시글 등록하기
        </Button>
      </div>
      <div className="max-w-max space-y-4">
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

export default PostFeed;
