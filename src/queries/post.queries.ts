import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api/post.api";
import type { PostRequest } from "@/types/postType";
import { queryKeys } from "@/queryKeys";

// Get은 useQuery, 나머지는 useMutation
export const useGetPosts = () => {
  return useQuery({
    queryKey: queryKeys.post.all,
    queryFn: postApi.getAll,
  });
};

export const useGetPost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.post.detail(id),
    queryFn: () => postApi.getOne(id),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PostRequest) => postApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post.all });
    },
  });
};

export const useDeleteDetail1 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postApi.deleteDetail1(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post.all });
    },
    onError: (e) => {
      console.log(e.message);
    }
  });
};
