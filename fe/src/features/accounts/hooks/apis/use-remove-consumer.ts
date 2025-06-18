import { axiosClientInstance } from '@/lib/utils/api-client';
import { useMutation } from '@tanstack/react-query';

export default function useRemoveConsumerApi() {
  const { mutateAsync: removeConsumerApi } = useMutation<void, Error, { txHash: string }>({
    mutationFn: async ({ txHash }) => {
      return axiosClientInstance.post(`v1/account/remove-consumer/${txHash}`);
    },
  });
  return { removeConsumerApi };
}
