import { useQuery, useMutation } from '@tanstack/react-query';
import { fetch__Name__Data, create__Name__ } from './__name__.service';

// TODO: 목록 가져오기 위한 Query Hook
export const use__Name__Query = () => {
  return useQuery(['__name__'], fetch__Name__Data);
};

// TODO: 생성 로직을 위한 Mutation Hook
export const useCreate__Name__ = () => {
  return useMutation(create__Name__);
};
