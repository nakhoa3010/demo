import { axiosClientInstance } from '@/lib/utils/api-client';
import { useMutation } from '@tanstack/react-query';

export default function usePostTxHasMutation() {
  const { data, isPending, error, mutateAsync } = useMutation({
    mutationFn: (txHash: string) => {
      return axiosClientInstance.post(`flipcoin/flip/${txHash}`);
    },
  });

  return { data, isPending, error, mutateAsync };
}
