import { useGetPosts } from "@/queries/post.queries";
import PostFeedCard from "@/components/PostFeedCard";
import { useNavigate } from "react-router-dom";
import type { PostInfo } from "./PostList";

const PostFeed = () => {
  const nav = useNavigate();
  const { data } = useGetPosts();
  const result: PostInfo[] = data ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {result.map((post) => (
        <PostFeedCard
          key={post.id}
          post={post}
          onClick={() => nav(`/namu/post-list/${post.id}`)}
        />
      ))}
    </div>
  );
};

export default PostFeed;
