import type { PostRequest, PostResponse } from "@/types/postType";
import { api } from "@/utils";

export const postApi = {
  create: async (dto: PostRequest) => {
    const { data } = await api.post("/posts", dto);
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get<PostResponse>(`/posts/${id}`);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get<PostResponse[]>("/posts");
    return data;
  },
  // 상세보기 삭제 axios
  deleteDetail1: async (id: number) => {
    await api.delete(`/posts/${id}`);
  },
};
