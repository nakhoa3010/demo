import { QueryKeys } from '@/lib/query/query-keys';
import { axiosClientInstance } from '@/lib/utils/api-client';
import { queryClient } from '@/providers/query-provider';
import { useMutation } from '@tanstack/react-query';

export default function useCreateAccountApi() {
  const { mutateAsync: createAccount, isPending } = useMutation<void, Error, { txHash: string }>({
    mutationFn: async ({ txHash }) => {
      const response = await axiosClientInstance.post(`v1/account/create/${txHash}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.allAccounts] });
    },
  });

  return { createAccount, isPending };
}
