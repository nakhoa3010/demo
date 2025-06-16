import { useQuery } from '@tanstack/react-query';
import { axiosClientInstance } from '@/lib/utils/api-client';
import { QueryKeys } from '@/lib/query/query-keys';
import { AccountItem } from '@/types/account-type';

export default function useAllAccounts() {
  const { data, isLoading, isFetching } = useQuery<AccountItem[]>({
    queryKey: [QueryKeys.allAccounts],
    queryFn: async () => {
      return axiosClientInstance.get('v1/account');
    },
  });

  return {
    accounts: data || [],
    isAccountsLoading: isLoading || isFetching,
  };
}
