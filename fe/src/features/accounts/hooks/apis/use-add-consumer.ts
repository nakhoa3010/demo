import { QueryKeys } from '@/lib/query/query-keys';
import { axiosClientInstance } from '@/lib/utils/api-client';
import { queryClient } from '@/providers/query-provider';
import { useMutation } from '@tanstack/react-query';

export default function useAddConsumerApi() {
  const { mutateAsync: addConsumerApi } = useMutation<void, Error, { txHash: string }>({
    mutationFn: async ({ txHash }) => {
      return axiosClientInstance.post(`v1/account/create-consumer/${txHash}`);
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [QueryKeys.allAccounts] });
    },
  });
  return { addConsumerApi };
}
