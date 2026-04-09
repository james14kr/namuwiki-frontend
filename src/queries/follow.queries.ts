import { deleteFollow, getFollowList, postFollow } from "@/api/follow.api";
import { useMutation, useQuery } from "@tanstack/react-query"

//팔로우
export const usePostFollow = () => {
  return useMutation({
    mutationFn : (data: {followerEmail : string; farmerEmail : string}) => 
      postFollow(data),
  })
}

//언팔로우
export const useDeleteFollow = () => {
  return useMutation({
    mutationFn : (data : {followerEmail : string; farmerEmail : string}) => 
      deleteFollow(data),
  })
}

//팔로우 목록 조회
export const useGetFollowList = (followerEmail : string) => {
  return useQuery({
    queryKey : ["followList", followerEmail],
    queryFn : () => getFollowList(followerEmail),
    enabled : !!followerEmail,
  })
}