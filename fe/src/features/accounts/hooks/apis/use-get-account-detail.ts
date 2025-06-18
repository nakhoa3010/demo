import { useQuery } from '@tanstack/react-query';
import { AccountDetailItem } from '@/types/account-type';
import { QueryKeys } from '@/lib/query/query-keys';
import { axiosClientInstance } from '@/lib/utils/api-client';

export const useGetAccountDetail = (accountId: string) => {
  const { data, isLoading, isFetching, error, refetch } = useQuery<AccountDetailItem>({
    queryKey: [QueryKeys.accountDetail(accountId)],
    queryFn: () => axiosClientInstance.get(`v1/account/detail/${accountId}`),
  });

  return {
    accountDetail: data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
};
