import { getFarmList } from '@/api/farmApi'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const useGetFarmList = () => {
  return useQuery({
    queryKey : ["farmList"],
    queryFn : getFarmList,
  });
};