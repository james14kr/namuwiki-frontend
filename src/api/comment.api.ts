
import { CommentResponse, type CommentRequest } from "@/types/commentType";
import { api } from "@/utils";

export const commentApi = {

  // 댓글 등록 api
  insertComment: async (dto:CommentRequest)=>{
    const {data} = await api.post("/comments", dto);
    return data;
  },

  // 게시글별 댓글 목록 조회 api
  selectComment: async (postId:number)=>{
    const{data} = await api.get<CommentResponse[]>(`/comments/${postId}`);
    return data;
  }



};